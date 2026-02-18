// ============================================================
// src/hooks/useChat.ts - チャットロジック（カスタムフック）
// ============================================================
// 【このファイルで学べること】
// - ReadableStream の reader を使った SSE パース
// - TextDecoder によるバイト列→文字列変換
// - useReducer による複雑な状態管理
// - useRef + useEffect による自動スクロール
// ============================================================

import { useReducer, useRef, useEffect, useCallback } from "react";
import type { ChatMessage, SSEData } from "../types";
import { sendChatMessage } from "../api";

// --------------------------------------------------
// 【useReducer とは？】
// useState の上位版。複数のアクションで状態を更新する場合に使う。
// Redux と同様の「action → reducer → 新しい state」パターン。
// --------------------------------------------------

// チャットの状態
interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
}

// アクションの定義（Discriminated Union）
type ChatAction =
  | { type: "ADD_USER_MESSAGE"; content: string }
  | { type: "ADD_ASSISTANT_MESSAGE" }
  | { type: "APPEND_CONTENT"; content: string }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "CLEAR_MESSAGES" };

// --------------------------------------------------
// reducer 関数: アクションに応じて状態を更新する純粋関数
// --------------------------------------------------
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "ADD_USER_MESSAGE":
      return {
        ...state,
        messages: [
          ...state.messages,
          { role: "user", content: action.content },
        ],
      };
    case "ADD_ASSISTANT_MESSAGE":
      // AI の空メッセージを追加（ストリーミングで内容が追記される）
      return {
        ...state,
        messages: [...state.messages, { role: "assistant", content: "" }],
      };
    case "APPEND_CONTENT": {
      // 最後のメッセージ（AI）にテキストを追記
      const msgs = [...state.messages];
      const last = msgs[msgs.length - 1];
      if (last && last.role === "assistant") {
        msgs[msgs.length - 1] = {
          ...last,
          content: last.content + action.content,
        };
      }
      return { ...state, messages: msgs };
    }
    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading };
    case "CLEAR_MESSAGES":
      return { ...state, messages: [], isLoading: false };
    default:
      return state;
  }
}

// 初期状態
const initialState: ChatState = { messages: [], isLoading: false };

// --------------------------------------------------
// useChat カスタムフック
// チャットの状態管理とストリーミング通信を一元管理する
// --------------------------------------------------
export function useChat() {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // --------------------------------------------------
  // 【useRef とは？】
  // DOM 要素への参照を保持するフック。
  // ここではメッセージ一覧の末尾にスクロールするために使う。
  // --------------------------------------------------
  const bottomRef = useRef<HTMLDivElement>(null);

  // メッセージが更新されたら自動スクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [state.messages]);

  // --------------------------------------------------
  // メッセージ送信処理
  // 1. ユーザーメッセージを追加
  // 2. SSE ストリーミングを開始
  // 3. 受信したチャンクを逐次的に AI メッセージに追記
  // --------------------------------------------------
  const send = useCallback(async (message: string) => {
    dispatch({ type: "ADD_USER_MESSAGE", content: message });
    dispatch({ type: "ADD_ASSISTANT_MESSAGE" });
    dispatch({ type: "SET_LOADING", isLoading: true });

    try {
      // SSE レスポンスを取得
      const response = await sendChatMessage(message);
      const reader = response.body?.getReader();
      if (!reader) throw new Error("レスポンスの読み取りに失敗しました");

      // --------------------------------------------------
      // 【TextDecoder とは？】
      // バイト列（Uint8Array）を文字列に変換するブラウザ API。
      // ストリーミングでは部分的なバイト列が届くことがあるため、
      // stream: true を使って不完全なマルチバイト文字を正しく処理する。
      // --------------------------------------------------
      const decoder = new TextDecoder();
      let buffer = "";

      // ストリーミング読み取りループ
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // バイト列を文字列に変換してバッファに追加
        buffer += decoder.decode(value, { stream: true });

        // SSE のデータ行を処理
        // フォーマット: "data: {...}\n\n"
        const lines = buffer.split("\n\n");
        // 最後の要素は不完全な可能性があるのでバッファに残す
        buffer = lines.pop() || "";

        for (const line of lines) {
          const dataLine = line.trim();
          if (!dataLine.startsWith("data: ")) continue;

          const jsonStr = dataLine.slice(6); // "data: " を除去
          try {
            const data: SSEData = JSON.parse(jsonStr);

            if (data.type === "text") {
              dispatch({ type: "APPEND_CONTENT", content: data.content });
            } else if (data.type === "error") {
              dispatch({ type: "APPEND_CONTENT", content: data.content });
            }
            // "done" の場合は特に何もしない
          } catch {
            // JSON パースエラーは無視（不完全なデータの場合がある）
          }
        }
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "エラーが発生しました";
      dispatch({ type: "APPEND_CONTENT", content: `[エラー] ${errorMsg}` });
    } finally {
      dispatch({ type: "SET_LOADING", isLoading: false });
    }
  }, []);

  // チャット履歴のクリア
  const clear = useCallback(() => {
    dispatch({ type: "CLEAR_MESSAGES" });
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    send,
    clear,
    bottomRef,
  };
}
