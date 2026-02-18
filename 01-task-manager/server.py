# ============================================================
# server.py ― FastAPI によるバックエンド API サーバー
# React アプリのデータ永続化と CRUD 操作を提供する
#
# 【FastAPI とは？】
# Python 製の Web フレームワーク。型ヒント（Type Hints）を活用して
# 自動バリデーション・自動ドキュメント生成を行う。
# 高速で、Django REST Framework や Flask の代替として人気が高い。
# ============================================================

# --------------------------------------------------
# モジュールのインポート
# --------------------------------------------------

# FastAPI: Web フレームワーク本体
# HTTPException: HTTP エラーレスポンスを返すための例外クラス
from fastapi import FastAPI, HTTPException

# CORSMiddleware: 異なるオリジン（ポート）間の通信を許可するミドルウェア
# React（localhost:5173）から FastAPI（localhost:3001）への通信に必要
from fastapi.middleware.cors import CORSMiddleware

# BaseModel: リクエストボディやレスポンスの型（スキーマ）を定義するクラス
# Field: バリデーションルールを付与するための関数
from pydantic import BaseModel, Field

# Literal: TypeScript のリテラル型に相当する。値を限定する型ヒント
# Optional: None を許容する型ヒント（TypeScript の ?: に相当）
from typing import Literal, Optional

# datetime: 日時を扱う標準ライブラリ
from datetime import datetime, timezone

# --------------------------------------------------
# FastAPI アプリケーションのインスタンスを作成する
#
# title: Swagger UI（自動生成ドキュメント）に表示されるタイトル
# /docs にアクセスすると自動生成された API ドキュメントが見られる
# --------------------------------------------------
app = FastAPI(title="タスク管理 API")

# --------------------------------------------------
# CORS ミドルウェアの設定
#
# 【CORS とは？】
# Cross-Origin Resource Sharing の略。
# ブラウザは異なるオリジン（プロトコル + ホスト + ポート）への
# リクエストをデフォルトで制限する。CORS 設定で許可が必要。
# --------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    # 許可するオリジンのリスト（* は全て許可だが本番では制限すべき）
    allow_origins=["*"],
    # Cookie を含むリクエストを許可するか
    allow_credentials=True,
    # 許可する HTTP メソッド
    allow_methods=["*"],
    # 許可するリクエストヘッダー
    allow_headers=["*"],
)

# --------------------------------------------------
# Pydantic モデル（スキーマ定義）
#
# 【Pydantic とは？】
# Python のデータバリデーション＆シリアライゼーションライブラリ。
# FastAPI と統合されており、リクエスト/レスポンスの型を定義する。
# TypeScript の interface に相当する役割を果たす。
# --------------------------------------------------

# 優先度の型（TypeScript の type Priority = "low" | "medium" | "high" に相当）
PriorityType = Literal["low", "medium", "high"]


class Task(BaseModel):
    """タスク1件のデータ型（TypeScript の Task interface に相当）"""

    id: int                    # タスクの一意 ID
    title: str                 # タスクのタイトル
    done: bool                 # 完了状態
    priority: PriorityType     # 優先度（"low" | "medium" | "high" に制限）
    createdAt: str             # 作成日時（ISO 文字列）


class CreateTaskInput(BaseModel):
    """タスク新規作成時の入力型（TypeScript の CreateTaskInput に相当）

    Field を使ってバリデーションルールを設定する:
    - min_length=1: 空文字列を弾く
    - max_length=100: 100文字以内に制限
    """

    title: str = Field(min_length=1, max_length=100)  # 必須・1〜100文字
    priority: PriorityType = "medium"                   # デフォルト値は "medium"


class ApiResponse(BaseModel):
    """API レスポンスの共通型（TypeScript の ApiResponse<T> に相当）

    Python の Pydantic では Generic を使うこともできるが、
    シンプルに data を任意の型として定義する
    """

    data: Optional[list | dict] = None  # レスポンスデータ（リストまたは辞書）
    message: str                        # メッセージ

# --------------------------------------------------
# インメモリデータストア（簡易的なデータベース代わり）
# 本番環境では PostgreSQL や MongoDB などの DB を使う
# --------------------------------------------------
tasks: list[Task] = [
    Task(
        id=1,
        title="React の基礎を学ぶ",
        done=False,
        priority="high",
        createdAt=datetime.now(timezone.utc).isoformat(),
    ),
    Task(
        id=2,
        title="TypeScript の型定義を理解する",
        done=True,
        priority="high",
        createdAt=datetime.now(timezone.utc).isoformat(),
    ),
    Task(
        id=3,
        title="FastAPI で API を作る",
        done=False,
        priority="medium",
        createdAt=datetime.now(timezone.utc).isoformat(),
    ),
]

# 次に振る ID（自動インクリメント）
next_id = 4


# --------------------------------------------------
# API エンドポイントの定義
# REST API の基本: GET=取得, POST=作成, PATCH=部分更新, DELETE=削除
#
# 【デコレータとは？】
# @app.get("/path") のような記法。関数に追加の機能を付与する。
# FastAPI ではデコレータで URL パスと HTTP メソッドを紐づける。
# --------------------------------------------------

# GET /api/tasks ― 全タスクを取得する
@app.get("/api/tasks")
def get_tasks() -> ApiResponse:
    """全タスクを取得するエンドポイント

    -> ApiResponse は戻り値の型ヒント。FastAPI が自動でレスポンスを
    JSON に変換し、Swagger ドキュメントにも反映する。
    """
    return ApiResponse(
        # model_dump() で Pydantic モデルを辞書に変換する
        data=[task.model_dump() for task in tasks],
        message="タスク一覧を取得しました",
    )


# POST /api/tasks ― 新しいタスクを作成する
@app.post("/api/tasks", status_code=201)
def create_task(body: CreateTaskInput) -> ApiResponse:
    """新しいタスクを作成するエンドポイント

    body: CreateTaskInput ― FastAPI が自動でリクエストボディを
    パースし、Pydantic でバリデーションする。
    不正なデータが来ると自動で 422 エラーを返す。

    status_code=201: 成功時のデフォルトステータスコード
    201 = Created（リソースの作成成功）
    """
    # global 宣言: 関数の外で定義された変数を変更するために必要
    global next_id

    # 新しいタスクを作成する
    new_task = Task(
        id=next_id,
        title=body.title.strip(),                         # 前後の空白を除去
        done=False,                                        # 新規タスクは未完了
        priority=body.priority,                            # リクエストの優先度を使う
        createdAt=datetime.now(timezone.utc).isoformat(),  # 現在日時を ISO 形式で記録
    )

    # ID をインクリメントする
    next_id += 1

    # リストに追加する
    tasks.append(new_task)

    return ApiResponse(
        data=new_task.model_dump(),
        message="タスクを作成しました",
    )


# PATCH /api/tasks/{task_id}/toggle ― タスクの完了状態を切り替える
@app.patch("/api/tasks/{task_id}/toggle")
def toggle_task(task_id: int) -> ApiResponse:
    """タスクの完了状態を切り替えるエンドポイント

    {task_id}: パスパラメータ。FastAPI が自動で int に変換する。
    TypeScript の req.params.id に相当する。
    """
    # 該当するタスクを検索する
    for task in tasks:
        if task.id == task_id:
            # done の値を反転させる（True → False, False → True）
            task.done = not task.done

            status = "完了" if task.done else "未完了"
            return ApiResponse(
                data=task.model_dump(),
                message=f"タスクを{status}にしました",
            )

    # 見つからなければ 404 エラー
    # HTTPException: FastAPI のエラーレスポンス用例外
    raise HTTPException(status_code=404, detail="タスクが見つかりません")


# DELETE /api/tasks/{task_id} ― タスクを削除する
@app.delete("/api/tasks/{task_id}", status_code=204)
def delete_task(task_id: int) -> None:
    """タスクを削除するエンドポイント

    status_code=204: No Content（成功したがレスポンスボディなし）
    戻り値は None にする（204 はボディを返さない）
    """
    # global 宣言: tasks リストを再代入するために必要
    global tasks

    # 削除前の長さを記録する
    before = len(tasks)

    # リスト内包表記で該当 ID 以外のタスクだけ残す
    # TypeScript の filter に相当する
    tasks = [t for t in tasks if t.id != task_id]

    # 長さが変わっていなければ、削除対象が見つからなかった
    if len(tasks) == before:
        raise HTTPException(status_code=404, detail="タスクが見つかりません")

    # 204 は自動でボディなしのレスポンスを返す
    return None


# --------------------------------------------------
# サーバー起動設定
#
# if __name__ == "__main__": は、このファイルが直接実行されたときだけ
# 中のコードを実行する Python の慣習。import された場合は実行されない。
# --------------------------------------------------
if __name__ == "__main__":
    # uvicorn: ASGI サーバー。FastAPI アプリを起動するために使う
    import uvicorn

    # app: 起動する FastAPI アプリ
    # host: リッスンするアドレス（"0.0.0.0" で全てのインターフェースから受付）
    # port: ポート番号（React の Vite 開発サーバーとは別のポートを使う）
    uvicorn.run(app, host="0.0.0.0", port=3001)
