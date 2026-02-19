// ============================================================
// src/hooks/useReader.ts - 読書ノートのコアロジック
// ============================================================
// 【このファイルで学べること】
// - useReducer による複雑な状態管理（02-mastra-rag の useChat と同パターン）
// - setTimeout チェーンによるストリーミング模擬
//   （02-mastra-rag では ReadableStream + SSE パースだった部分）
// - useRef + scrollIntoView による自動スクロール
// - useCallback による関数メモ化
// - useEffect による localStorage 同期
// ============================================================

import { useReducer, useRef, useEffect, useCallback } from "react";
import type { ReadingEntry, EntryAction } from "../types";
import { pickRandomSummary } from "../data/summaryTemplates";

const STORAGE_KEY = "streaming-reader-entries";

// --------------------------------------------------
// reducer: アクションに応じてエントリー配列を更新する純粋関数
// 02-mastra-rag の chatReducer と同じ Discriminated Union パターン
// --------------------------------------------------
function entryReducer(
  state: ReadingEntry[],
  action: EntryAction
): ReadingEntry[] {
  switch (action.type) {
    case "ADD_ENTRY":
      return [
        {
          id: action.payload.id,
          originalText: action.payload.originalText,
          summary: "",
          status: "streaming",
          createdAt: new Date().toISOString(),
        },
        ...state,
      ];

    case "APPEND_CHUNK":
      // 該当エントリーの summary に 1 文字追記
      return state.map((entry) =>
        entry.id === action.payload.id
          ? { ...entry, summary: entry.summary + action.payload.chunk }
          : entry
      );

    case "COMPLETE":
      return state.map((entry) =>
        entry.id === action.payload
          ? { ...entry, status: "done" as const }
          : entry
      );

    case "DELETE_ENTRY":
      return state.filter((entry) => entry.id !== action.payload);

    case "LOAD_ENTRIES":
      return action.payload;

    default:
      return state;
  }
}

// --------------------------------------------------
// useReader カスタムフック
// 読書エントリーの CRUD + ストリーミング要約を一元管理
// --------------------------------------------------
export function useReader() {
  const [entries, dispatch] = useReducer(entryReducer, []);

  // 自動スクロール用の ref（02-mastra-rag の bottomRef と同じ役割）
  const streamEndRef = useRef<HTMLDivElement>(null);

  // 現在ストリーミング中かどうかを派生値として算出
  const isStreaming = entries.some((e) => e.status === "streaming");

  // --------------------------------------------------
  // localStorage からの復元（マウント時に1回だけ実行）
  // --------------------------------------------------
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: ReadingEntry[] = JSON.parse(saved);
        // 中断された streaming エントリーは done に修正
        const fixed = parsed.map((e) =>
          e.status === "streaming" ? { ...e, status: "done" as const } : e
        );
        dispatch({ type: "LOAD_ENTRIES", payload: fixed });
      }
    } catch {
      // パース失敗時は空のまま開始
    }
  }, []);

  // --------------------------------------------------
  // entries が変わるたびに localStorage に保存
  // --------------------------------------------------
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  // ストリーミング中は末尾へ自動スクロール
  useEffect(() => {
    if (isStreaming) {
      streamEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [entries, isStreaming]);

  // --------------------------------------------------
  // 要約を開始する関数（setTimeout チェーンでストリーミング模擬）
  // 02-mastra-rag では SSE の ReadableStream.read() ループだったが、
  // ここでは setTimeout の再帰呼び出しで同じ「逐次表示」を再現する。
  // --------------------------------------------------
  const summarize = useCallback(
    (text: string) => {
      if (isStreaming) return; // 二重実行を防止

      const id = crypto.randomUUID();
      dispatch({ type: "ADD_ENTRY", payload: { id, originalText: text } });

      const summaryText = pickRandomSummary();
      let index = 0;

      const tick = () => {
        if (index < summaryText.length) {
          dispatch({
            type: "APPEND_CHUNK",
            payload: { id, chunk: summaryText[index] },
          });
          index++;
          setTimeout(tick, 30 + Math.random() * 20); // 30-50ms per char
        } else {
          dispatch({ type: "COMPLETE", payload: id });
        }
      };
      tick();
    },
    [isStreaming]
  );

  // エントリー削除
  const deleteEntry = useCallback((id: string) => {
    dispatch({ type: "DELETE_ENTRY", payload: id });
  }, []);

  return {
    entries,
    isStreaming,
    summarize,
    deleteEntry,
    streamEndRef,
  };
}
