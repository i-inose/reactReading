// ============================================================
// src/components/StreamingText.tsx - ストリーミング表示コンポーネント
// ============================================================
// 【このファイルで学べること】
// - 条件付きレンダリング（idle / streaming / done の3状態）
//   02-mastra-rag の ChatMessage で「応答中...」を表示していたのと同パターン
// - CSS アニメーション（カーソル点滅）との連携
// - StreamStatus 型による型安全な状態管理
// ============================================================

import type { StreamStatus } from "../types";

interface StreamingTextProps {
  text: string;
  status: StreamStatus;
}

export function StreamingText({ text, status }: StreamingTextProps) {
  if (status === "idle") {
    return (
      <div className="streaming-text streaming-text--idle">
        <p className="streaming-text__placeholder">
          テキストを入力すると、ここに要約が表示されます
        </p>
      </div>
    );
  }

  return (
    <div className="streaming-text streaming-text--active">
      <div className="streaming-text__header">
        <span className="streaming-text__label">AI 要約</span>
        {status === "streaming" && (
          <span className="streaming-text__badge">生成中</span>
        )}
        {status === "done" && (
          <span className="streaming-text__badge streaming-text__badge--done">
            完了
          </span>
        )}
      </div>
      <p className="streaming-text__content">
        {text}
        {/* ストリーミング中はカーソルを表示 */}
        {status === "streaming" && (
          <span className="streaming-text__cursor" />
        )}
      </p>
    </div>
  );
}
