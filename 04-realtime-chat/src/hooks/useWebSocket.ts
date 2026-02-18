// ============================================================
// useWebSocket.ts ― WebSocket 接続を管理するカスタムフック
//
// 【このファイルで学べること】
// - WebSocket のライフサイクル（接続 → メッセージ送受信 → 切断）
// - useRef で WebSocket インスタンスを保持する理由
// - useCallback でコールバックをメモ化するパターン
// - 自動再接続ロジックの実装
// - useEffect のクリーンアップで接続を切断する
// ============================================================

import { useState, useRef, useCallback, useEffect } from "react";
import type { ConnectionStatus, ClientMessage, ServerMessage } from "../types";

// --------------------------------------------------
// フックの引数の型
// --------------------------------------------------
interface UseWebSocketOptions {
  onMessage: (message: ServerMessage) => void;  // メッセージ受信時のコールバック
}

// --------------------------------------------------
// フックの戻り値の型
// --------------------------------------------------
interface UseWebSocketReturn {
  status: ConnectionStatus;               // 接続状態
  connect: () => void;                    // 接続開始
  disconnect: () => void;                 // 切断
  sendMessage: (msg: ClientMessage) => void;  // メッセージ送信
}

// --------------------------------------------------
// 再接続の設定
// --------------------------------------------------
const MAX_RECONNECT_ATTEMPTS = 5;        // 最大再接続回数
const RECONNECT_INTERVAL_MS = 2000;      // 再接続の間隔（ミリ秒）

// --------------------------------------------------
// useWebSocket カスタムフック本体
//
// 【WebSocket とは？】
// HTTP と異なり、サーバーとクライアントが常時接続を維持する通信プロトコル。
// サーバーからクライアントへ能動的にデータを送れる（プッシュ通知）。
// チャット、リアルタイム更新、ゲームなどに使われる。
// --------------------------------------------------
export function useWebSocket({ onMessage }: UseWebSocketOptions): UseWebSocketReturn {
  // 接続状態を管理する state
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");

  // --------------------------------------------------
  // useRef でミュータブルな値を保持する
  //
  // 【なぜ useRef を使うのか？】
  // useState と違い、useRef の値を変更しても再レンダリングが起きない。
  // WebSocket インスタンスやタイマー ID など、レンダリングに影響しない値に適する。
  // また、useRef の値はコールバック内から常に最新値を参照できる。
  // --------------------------------------------------
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // onMessage を ref に保存して、最新のコールバックを参照できるようにする
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  // --------------------------------------------------
  // 再接続タイマーをクリアするヘルパー関数
  // --------------------------------------------------
  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current !== null) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  }, []);

  // --------------------------------------------------
  // WebSocket 接続を開始する
  // --------------------------------------------------
  const connect = useCallback(() => {
    // 既に接続中なら何もしない
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setStatus("connecting");
    clearReconnectTimer();

    // WebSocket URL を構築する
    // Vite のプロキシが /ws を FastAPI サーバーに転送する
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    // WebSocket インスタンスを作成する（接続開始）
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    // --------------------------------------------------
    // WebSocket のイベントハンドラを設定する
    //
    // 【WebSocket のイベント】
    // onopen:    接続成功時に呼ばれる
    // onmessage: サーバーからメッセージを受信した時に呼ばれる
    // onclose:   接続が閉じた時に呼ばれる
    // onerror:   エラー発生時に呼ばれる
    // --------------------------------------------------

    ws.onopen = () => {
      setStatus("connected");
      reconnectCountRef.current = 0;  // 再接続カウントをリセット
    };

    ws.onmessage = (event: MessageEvent) => {
      // サーバーから受信したデータは JSON 文字列なのでパースする
      const data = JSON.parse(event.data as string) as ServerMessage;
      onMessageRef.current(data);
    };

    ws.onclose = () => {
      setStatus("disconnected");
      wsRef.current = null;

      // 自動再接続を試行する
      if (reconnectCountRef.current < MAX_RECONNECT_ATTEMPTS) {
        reconnectCountRef.current += 1;
        setStatus("reconnecting");

        // 一定間隔をおいて再接続する（即座の再接続はサーバーに負荷をかける）
        reconnectTimerRef.current = setTimeout(() => {
          connect();
        }, RECONNECT_INTERVAL_MS);
      }
    };

    ws.onerror = () => {
      // onerror の後は onclose も呼ばれるため、ここでは何もしない
    };
  }, [clearReconnectTimer]);

  // --------------------------------------------------
  // WebSocket 接続を切断する
  // --------------------------------------------------
  const disconnect = useCallback(() => {
    clearReconnectTimer();
    reconnectCountRef.current = MAX_RECONNECT_ATTEMPTS; // 再接続を無効化
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus("disconnected");
  }, [clearReconnectTimer]);

  // --------------------------------------------------
  // メッセージを送信する
  // --------------------------------------------------
  const sendMessage = useCallback((msg: ClientMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      // オブジェクトを JSON 文字列に変換して送信する
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  // --------------------------------------------------
  // コンポーネントのアンマウント時に接続を切断する
  //
  // 【useEffect のクリーンアップ】
  // useEffect が返す関数は、コンポーネントがアンマウントされる時に実行される。
  // WebSocket 接続やタイマーなど、不要になったリソースを解放する。
  // --------------------------------------------------
  useEffect(() => {
    return () => {
      clearReconnectTimer();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [clearReconnectTimer]);

  return { status, connect, disconnect, sendMessage };
}
