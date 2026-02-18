# ============================================================
# server.py ― FastAPI + WebSocket によるリアルタイムチャットサーバー
#
# 【このファイルで学べること】
# - WebSocket プロトコルの基礎（接続 → メッセージ送受信 → 切断）
# - ConnectionManager パターン（接続の一元管理）
# - JSON ベースのメッセージプロトコル設計
# - asyncio を使った非同期処理
# - ブロードキャスト（ルーム内の全ユーザーにメッセージ送信）
# ============================================================

# --------------------------------------------------
# モジュールのインポート
# --------------------------------------------------

# FastAPI: Web フレームワーク本体
# WebSocket: WebSocket 接続を扱うクラス
# WebSocketDisconnect: クライアントの切断を検知する例外
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

# CORSMiddleware: 異なるオリジン間の通信を許可する
from fastapi.middleware.cors import CORSMiddleware

# json: Python オブジェクトと JSON 文字列の相互変換
import json

# datetime: 日時を扱う標準ライブラリ
from datetime import datetime, timezone

# --------------------------------------------------
# 型ヒント（Type Hints）
#
# 【型ヒントとは？】
# Python 3.5 以降で導入された、変数や関数の型を明示する記法。
# TypeScript の型注釈に相当する。実行時の挙動には影響しないが、
# エディタの補完やドキュメントの品質が向上する。
# --------------------------------------------------
from typing import TypedDict

# --------------------------------------------------
# FastAPI アプリケーションの作成
# --------------------------------------------------
app = FastAPI(title="リアルタイムチャット API")

# CORS 設定（フロントエンドからのアクセスを許可する）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# メッセージの型定義（TypedDict）
#
# 【TypedDict とは？】
# 辞書（dict）のキーと値の型を定義するクラス。
# TypeScript の interface に相当し、型安全な辞書を作れる。
# --------------------------------------------------
class ChatMessageDict(TypedDict):
    """チャットメッセージ1件の型"""
    username: str       # 送信者名
    message: str        # メッセージ本文
    timestamp: str      # ISO 形式のタイムスタンプ
    isSystem: bool      # システムメッセージかどうか


# --------------------------------------------------
# ユーザー接続情報
# WebSocket 接続と紐づくユーザー情報を保持する
# --------------------------------------------------
class UserConnection:
    """1つの WebSocket 接続に紐づくユーザー情報"""

    def __init__(self, websocket: WebSocket, username: str, room: str):
        self.websocket = websocket  # WebSocket 接続オブジェクト
        self.username = username    # ユーザー名
        self.room = room            # 所属ルーム


# --------------------------------------------------
# ConnectionManager ― 接続の一元管理
#
# 【ConnectionManager パターンとは？】
# 全ての WebSocket 接続を1つのクラスで管理するデザインパターン。
# ルームごとの接続管理、ブロードキャスト、ユーザーリストの
# 取得など、接続に関する操作をカプセル化する。
# --------------------------------------------------
class ConnectionManager:
    def __init__(self):
        # ルーム名 → 接続リストの辞書
        # dict[str, list[UserConnection]] の型で管理する
        self.rooms: dict[str, list[UserConnection]] = {
            "general": [],
            "random": [],
            "tech": [],
        }

        # ルームごとのメッセージ履歴（インメモリ）
        self.history: dict[str, list[ChatMessageDict]] = {
            "general": [],
            "random": [],
            "tech": [],
        }

        # メッセージ履歴の最大保存件数
        self.max_history = 100

    # --------------------------------------------------
    # ルームに接続を追加する
    # --------------------------------------------------
    async def connect(self, websocket: WebSocket, username: str, room: str):
        """ユーザーをルームに接続する"""
        # WebSocket のハンドシェイクを受け入れる
        # （まだ accept していない場合のみ）
        connection = UserConnection(websocket, username, room)
        self.rooms[room].append(connection)
        return connection

    # --------------------------------------------------
    # ルームから接続を削除する
    # --------------------------------------------------
    def disconnect(self, websocket: WebSocket, room: str):
        """ユーザーをルームから切断する"""
        self.rooms[room] = [
            conn for conn in self.rooms[room]
            if conn.websocket != websocket
        ]

    # --------------------------------------------------
    # ルーム内の全ユーザーにメッセージを送信する（ブロードキャスト）
    #
    # 【ブロードキャストとは？】
    # 1つのメッセージをルーム内の全ユーザーに一斉送信すること。
    # チャットの基本動作: 誰かがメッセージを送ると、同じルームの
    # 全員に転送される。
    # --------------------------------------------------
    async def broadcast(self, room: str, message: dict):
        """ルーム内の全接続にメッセージを送信する"""
        # 切断済み接続のリスト（送信失敗した接続を記録する）
        disconnected: list[UserConnection] = []

        for conn in self.rooms[room]:
            try:
                # JSON 文字列としてメッセージを送信する
                await conn.websocket.send_text(json.dumps(message))
            except Exception:
                # 送信に失敗した接続は切断済みとしてマークする
                disconnected.append(conn)

        # 切断済みの接続をルームから除去する
        for conn in disconnected:
            self.disconnect(conn.websocket, room)

    # --------------------------------------------------
    # 特定のユーザー以外にメッセージを送信する
    # 入力中通知を自分自身に送らないために使う
    # --------------------------------------------------
    async def broadcast_except(
        self, room: str, message: dict, exclude: WebSocket
    ):
        """指定した WebSocket 以外の全接続にメッセージを送信する"""
        disconnected: list[UserConnection] = []

        for conn in self.rooms[room]:
            if conn.websocket == exclude:
                continue  # 除外対象はスキップする
            try:
                await conn.websocket.send_text(json.dumps(message))
            except Exception:
                disconnected.append(conn)

        for conn in disconnected:
            self.disconnect(conn.websocket, room)

    # --------------------------------------------------
    # ルーム内のオンラインユーザー名リストを取得する
    # --------------------------------------------------
    def get_users(self, room: str) -> list[str]:
        """ルーム内のユーザー名一覧を返す"""
        return [conn.username for conn in self.rooms[room]]

    # --------------------------------------------------
    # メッセージ履歴に追加する
    # --------------------------------------------------
    def add_to_history(self, room: str, message: ChatMessageDict):
        """メッセージを履歴に保存する（最大件数を超えたら古い方を削除）"""
        self.history[room].append(message)
        # 最大件数を超えたら先頭（最も古い）を削除する
        if len(self.history[room]) > self.max_history:
            self.history[room] = self.history[room][-self.max_history:]

    # --------------------------------------------------
    # WebSocket からルーム名とユーザー名を逆引きする
    # --------------------------------------------------
    def find_connection(self, websocket: WebSocket) -> UserConnection | None:
        """WebSocket 接続からユーザー情報を検索する"""
        for room_connections in self.rooms.values():
            for conn in room_connections:
                if conn.websocket == websocket:
                    return conn
        return None


# ConnectionManager のインスタンスを作成する（グローバル）
manager = ConnectionManager()


# --------------------------------------------------
# 現在のタイムスタンプを ISO 文字列で取得する
# --------------------------------------------------
def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# --------------------------------------------------
# ユーザー一覧をブロードキャストする
# ユーザーの入退室時に全員のユーザーリストを更新する
# --------------------------------------------------
async def broadcast_users(room: str):
    """ルーム内のユーザー一覧を全員に送信する"""
    users = manager.get_users(room)
    await manager.broadcast(room, {"type": "users", "users": users})


# --------------------------------------------------
# WebSocket エンドポイント
#
# 【WebSocket のライフサイクル】
# 1. クライアントが /ws に接続する（HTTP → WebSocket にアップグレード）
# 2. サーバーが accept() で接続を受け入れる
# 3. クライアントとサーバーが双方向にメッセージを送受信する
# 4. どちらかが接続を閉じる（または通信エラー）
#
# @app.websocket デコレータで WebSocket エンドポイントを定義する。
# HTTP の @app.get / @app.post と同様だが、常時接続を維持する。
# --------------------------------------------------
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket 接続のメインハンドラ"""

    # WebSocket のハンドシェイクを受け入れる
    await websocket.accept()

    current_room: str | None = None
    current_username: str | None = None

    try:
        # --------------------------------------------------
        # メッセージ受信ループ
        # クライアントからのメッセージを待ち続ける（無限ループ）
        # WebSocket が閉じられると WebSocketDisconnect 例外が発生する
        # --------------------------------------------------
        while True:
            # テキストメッセージを受信する（JSON 文字列）
            raw = await websocket.receive_text()
            data = json.loads(raw)

            # メッセージの type フィールドで処理を分岐する
            # （TypeScript の判別共用体と同じ考え方）
            msg_type = data.get("type")

            # --------------------------------------------------
            # join: ルームに参加する
            # --------------------------------------------------
            if msg_type == "join":
                username = data["username"]
                room = data["room"]

                # 既に別のルームにいる場合は退出する
                if current_room and current_room != room:
                    manager.disconnect(websocket, current_room)
                    leave_msg: ChatMessageDict = {
                        "username": current_username or "",
                        "message": f"{current_username} が退出しました",
                        "timestamp": now_iso(),
                        "isSystem": True,
                    }
                    manager.add_to_history(current_room, leave_msg)
                    await manager.broadcast(current_room, {
                        "type": "chat", **leave_msg
                    })
                    await broadcast_users(current_room)

                # 新しいルームに接続する
                current_room = room
                current_username = username
                await manager.connect(websocket, username, room)

                # メッセージ履歴を送信する
                await websocket.send_text(json.dumps({
                    "type": "room_history",
                    "messages": manager.history[room],
                }))

                # 入室メッセージをブロードキャストする
                join_msg: ChatMessageDict = {
                    "username": username,
                    "message": f"{username} が参加しました",
                    "timestamp": now_iso(),
                    "isSystem": True,
                }
                manager.add_to_history(room, join_msg)
                await manager.broadcast(room, {"type": "chat", **join_msg})

                # ユーザー一覧を更新する
                await broadcast_users(room)

            # --------------------------------------------------
            # leave: ルームから退出する
            # --------------------------------------------------
            elif msg_type == "leave":
                room = data["room"]
                if current_room == room:
                    manager.disconnect(websocket, room)

                    leave_msg2: ChatMessageDict = {
                        "username": current_username or "",
                        "message": f"{current_username} が退出しました",
                        "timestamp": now_iso(),
                        "isSystem": True,
                    }
                    manager.add_to_history(room, leave_msg2)
                    await manager.broadcast(room, {
                        "type": "chat", **leave_msg2
                    })
                    await broadcast_users(room)
                    current_room = None

            # --------------------------------------------------
            # chat: チャットメッセージを送信する
            # --------------------------------------------------
            elif msg_type == "chat":
                if current_room and current_username:
                    chat_msg: ChatMessageDict = {
                        "username": current_username,
                        "message": data["message"],
                        "timestamp": now_iso(),
                        "isSystem": False,
                    }
                    # 履歴に保存する
                    manager.add_to_history(current_room, chat_msg)

                    # ルーム内の全員にブロードキャストする
                    await manager.broadcast(current_room, {
                        "type": "chat", **chat_msg
                    })

            # --------------------------------------------------
            # typing: 入力中通知を送信する
            # --------------------------------------------------
            elif msg_type == "typing":
                if current_room and current_username:
                    # 自分以外の全員に入力中通知を送る
                    await manager.broadcast_except(
                        current_room,
                        {"type": "typing", "username": current_username},
                        exclude=websocket,
                    )

    # --------------------------------------------------
    # WebSocketDisconnect: クライアントが接続を閉じた場合
    # ブラウザを閉じる、ネットワークが切れるなどで発生する
    # --------------------------------------------------
    except WebSocketDisconnect:
        if current_room and current_username:
            manager.disconnect(websocket, current_room)

            # 退出メッセージを送信する
            disconnect_msg: ChatMessageDict = {
                "username": current_username,
                "message": f"{current_username} が切断しました",
                "timestamp": now_iso(),
                "isSystem": True,
            }
            manager.add_to_history(current_room, disconnect_msg)
            await manager.broadcast(current_room, {
                "type": "chat", **disconnect_msg
            })
            await broadcast_users(current_room)

    except Exception:
        # その他の予期しないエラー
        if current_room:
            manager.disconnect(websocket, current_room)
            await broadcast_users(current_room)


# --------------------------------------------------
# サーバー起動設定
# --------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    # host: "0.0.0.0" で全てのインターフェースからアクセス可能にする
    # port: 8000（Vite のプロキシ先と一致させる）
    uvicorn.run(app, host="0.0.0.0", port=8000)
