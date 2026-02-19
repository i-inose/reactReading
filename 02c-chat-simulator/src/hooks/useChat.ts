import { useReducer, useRef, useEffect, useCallback } from "react";
import type { ChatState, ChatAction, ChatMessage } from "../types.ts";
import { getRandomResponse } from "../data/responses.ts";

// ============================================================
// chatReducer ― メッセージ状態を管理する Reducer
// ============================================================
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "ADD_USER_MESSAGE": {
      const newMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: action.payload,
        timestamp: Date.now(),
        status: "complete",
      };
      return {
        ...state,
        messages: [...state.messages, newMessage],
      };
    }
    case "START_AI_MESSAGE": {
      const newMessage: ChatMessage = {
        id: action.payload,
        role: "ai",
        content: "",
        timestamp: Date.now(),
        status: "streaming",
      };
      return {
        ...state,
        messages: [...state.messages, newMessage],
      };
    }
    case "APPEND_AI_CHUNK": {
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.payload.id
            ? { ...msg, content: msg.content + action.payload.chunk }
            : msg
        ),
      };
    }
    case "COMPLETE_AI_MESSAGE": {
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.payload
            ? { ...msg, status: "complete" as const }
            : msg
        ),
      };
    }
    case "SET_STATUS": {
      return {
        ...state,
        streamStatus: action.payload,
      };
    }
  }
}

const initialState: ChatState = {
  messages: [],
  streamStatus: "idle",
};

// ============================================================
// useChat ― チャット機能を提供するカスタムフック
// ============================================================
export function useChat() {
  // ----------------------------------------------------------
  // TODO(Q3): useReducer でチャット状態を初期化してください
  //
  // ヒント:
  // - useReducer は useState の代替で、複雑な状態遷移に適しています
  // - useReducer(reducer関数, 初期値) の形式で呼び出します
  // - 戻り値は [state, dispatch] の配列です
  // - chatReducer と initialState を使ってください
  //
  // 参考: React 公式ドキュメント useReducer
  //   const [state, dispatch] = useReducer(reducer, initialState)
  // ----------------------------------------------------------
  const [state, dispatch] = (undefined as any);

  // ----------------------------------------------------------
  // TODO(Q5): useRef + useEffect で自動スクロールを実装してください
  //
  // ヒント:
  // - useRef<HTMLDivElement>(null) で DOM 要素への参照を作成します
  // - useEffect で messages が変わるたびにスクロールを実行します
  // - scrollIntoView({ behavior: "smooth" }) でスムーズにスクロールします
  // - messagesEndRef.current?.scrollIntoView(...) の形式で呼び出します
  //
  // 参考: 01-task-manager の useRef 使用箇所
  // ----------------------------------------------------------
  const messagesEndRef = undefined as any;

  // ----------------------------------------------------------
  // TODO(Q4): ストリーミングシミュレーション関数を実装してください
  //
  // ヒント:
  // - response 文字列を1文字ずつ setTimeout で追加します
  // - 再帰的に setTimeout を呼び出すか、ループで遅延を作ります
  // - 各文字ごとに dispatch({ type: "APPEND_AI_CHUNK", ... }) します
  // - 全文字の送信後に dispatch({ type: "COMPLETE_AI_MESSAGE", ... }) します
  // - 遅延は 30〜50ms 程度がリアルに見えます
  //
  // 実装パターン:
  //   let index = 0;
  //   function appendNext() {
  //     if (index < response.length) {
  //       dispatch(APPEND_AI_CHUNK で1文字追加);
  //       index++;
  //       setTimeout(appendNext, 30 + Math.random() * 20);
  //     } else {
  //       dispatch(COMPLETE_AI_MESSAGE);
  //       dispatch(SET_STATUS を "idle" に);
  //     }
  //   }
  //   appendNext();
  // ----------------------------------------------------------
  const simulateStreaming = (messageId: string, response: string) => {
    // ここを実装してください
  };

  // ----------------------------------------------------------
  // TODO(Q6): useCallback で sendMessage 関数をメモ化してください
  //
  // ヒント:
  // - useCallback(fn, deps) でコールバック関数をメモ化します
  // - 依存配列が変わらない限り、同じ関数参照が再利用されます
  // - sendMessage は以下の処理を順に行います:
  //   1. dispatch(ADD_USER_MESSAGE) でユーザーメッセージを追加
  //   2. dispatch(SET_STATUS) を "streaming" にセット
  //   3. 新しいメッセージIDを生成 (crypto.randomUUID())
  //   4. dispatch(START_AI_MESSAGE) で空の AI メッセージを追加
  //   5. getRandomResponse() でランダムな応答を取得
  //   6. setTimeout で少し遅延させてから simulateStreaming を呼ぶ
  //
  // 参考: 01-task-manager のイベントハンドラ
  // ----------------------------------------------------------
  const sendMessage = undefined as any;

  return {
    messages: state.messages,
    streamStatus: state.streamStatus,
    sendMessage,
    messagesEndRef,
  };
}
