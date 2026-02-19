// ============================================================
// src/components/EntryCard.tsx - 読書エントリーカード
// ============================================================
// 【このファイルで学べること】
// - Props の型定義とコンポーネント分離
// - テキストの切り詰め表示（プレビュー）
// - 日付のフォーマット（toLocaleDateString）
// ============================================================

import type { ReadingEntry } from "../types";

interface EntryCardProps {
  entry: ReadingEntry;
  onDelete: (id: string) => void;
}

// 長いテキストを指定文字数で切り詰める
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function EntryCard({ entry, onDelete }: EntryCardProps) {
  const date = new Date(entry.createdAt).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="entry-card">
      <div className="entry-card__header">
        <span className="entry-card__date">{date}</span>
        <button
          className="entry-card__delete"
          onClick={() => onDelete(entry.id)}
        >
          削除
        </button>
      </div>

      <div className="entry-card__section">
        <span className="entry-card__label">原文</span>
        <p className="entry-card__text">{truncate(entry.originalText, 120)}</p>
      </div>

      <div className="entry-card__section">
        <span className="entry-card__label">要約</span>
        <p className="entry-card__text entry-card__text--summary">
          {entry.summary || "(要約なし)"}
        </p>
      </div>
    </div>
  );
}
