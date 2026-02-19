// ============================================================
// src/pages/HistoryPage.tsx - 要約履歴ページ
// ============================================================
// 【このファイルで学べること】
// - リスト表示と条件付きレンダリング（空状態の表示）
//   02-mastra-rag の DocumentsPage と同パターン
// - 子コンポーネント（EntryCard）への props 受け渡し
// ============================================================

import { useReader } from "../hooks/useReader";
import { EntryCard } from "../components/EntryCard";

export function HistoryPage() {
  const { entries, deleteEntry } = useReader();

  // 完了済みエントリーのみ履歴に表示
  const completedEntries = entries.filter((e) => e.status === "done");

  return (
    <div className="history-page">
      <div className="history-page__header">
        <h2 className="history-page__title">要約履歴</h2>
        <span className="history-page__count">
          {completedEntries.length} 件
        </span>
      </div>

      {completedEntries.length === 0 ? (
        <div className="history-page__empty">
          <p>まだ要約履歴がありません。</p>
          <p>「Reader」タブからテキストを入力して要約を生成してください。</p>
        </div>
      ) : (
        <div className="history-page__list">
          {completedEntries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onDelete={deleteEntry}
            />
          ))}
        </div>
      )}
    </div>
  );
}
