// ============================================================
// src/components/SourceCard.tsx - 引用元カード
// ============================================================
// 【このファイルで学べること】
// - Props の型定義と分割代入
// - 類似度スコアの表示フォーマット
// ============================================================

import type { Source } from "../types";

// --------------------------------------------------
// コンポーネントの Props 型
// React では props の型を interface で定義するのが一般的
// --------------------------------------------------
interface SourceCardProps {
  source: Source;
  index: number;
}

// --------------------------------------------------
// SourceCard: ベクトル検索でヒットしたチャンクを表示するカード
// score が高いほど質問との関連性が高い
// --------------------------------------------------
export function SourceCard({ source, index }: SourceCardProps) {
  // スコアを百分率に変換（例: 0.85 → 85%）
  const scorePercent = Math.round(source.score * 100);

  return (
    <div className="source-card">
      <div className="source-card__header">
        <span className="source-card__label">引用 #{index + 1}</span>
        <span className="source-card__score">
          類似度: {scorePercent}%
        </span>
      </div>
      <p className="source-card__text">{source.text}</p>
    </div>
  );
}
