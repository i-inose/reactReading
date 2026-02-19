// ============================================================
// src/pages/ReaderPage.tsx - メイン読書ページ
// ============================================================
// 【このファイルで学べること】
// - カスタムフック（useReader）の利用パターン
//   02-mastra-rag の ChatPage が useChat を使うのと同じ構造
// - ref を使った自動スクロール
// - 条件付きレンダリングで状態に応じた UI 切り替え
// ============================================================

import { useReader } from "../hooks/useReader";
import { TextInput } from "../components/TextInput";
import { StreamingText } from "../components/StreamingText";
import type { StreamStatus } from "../types";

export function ReaderPage() {
  const { entries, isStreaming, summarize, streamEndRef } = useReader();

  // 最新エントリーの状態を取得（ストリーミング表示用）
  const latestEntry = entries[0];
  const currentStatus: StreamStatus = latestEntry
    ? latestEntry.status
    : "idle";
  const currentSummary = latestEntry?.summary ?? "";

  return (
    <div className="reader-page">
      <h2 className="reader-page__title">AI 読書ノート</h2>
      <p className="reader-page__desc">
        テキストを入力すると、AI が要約を生成します（ストリーミング表示）
      </p>

      {/* テキスト入力エリア */}
      <TextInput onSubmit={summarize} disabled={isStreaming} />

      {/* ストリーミング要約表示 */}
      <StreamingText text={currentSummary} status={currentStatus} />

      {/* 自動スクロールのアンカー */}
      <div ref={streamEndRef} />
    </div>
  );
}
