// ============================================================
// VoteBar.tsx ― 投票結果の横棒グラフ1本分
//
// 【このファイルで学べること】
// - useMemo で計算結果をメモ化するパターン
// - CSS の width + transition でアニメーション付きバーを実装する
// - Props の型定義とシンプルなプレゼンテーションコンポーネント
//
// 【04-realtime-chat との対応】
// chat には直接対応するコンポーネントはないが、
// MessageBubble.tsx のような「データを受け取って表示するだけ」の
// プレゼンテーションコンポーネントと同じ考え方。
// ============================================================

import { useMemo } from "react";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface VoteBarProps {
  label: string;       // 選択肢のラベル（例: "猫派"）
  count: number;       // この選択肢の得票数
  totalVotes: number;  // 全選択肢の合計得票数
  color: string;       // バーの色（CSS カラー文字列）
  isSelected: boolean; // 自分が投票した選択肢かどうか
}

// --------------------------------------------------
// バーの色の配列（選択肢ごとに異なる色を割り当てる）
// --------------------------------------------------
export const BAR_COLORS = [
  "#4a90d9",  // 青
  "#e74c3c",  // 赤
  "#27ae60",  // 緑
  "#f39c12",  // オレンジ
  "#9b59b6",  // 紫
];

// --------------------------------------------------
// VoteBar コンポーネント
// --------------------------------------------------
export function VoteBar({ label, count, totalVotes, color, isSelected }: VoteBarProps) {
  // --------------------------------------------------
  // 【TODO(Q7)】useMemo でパーセンテージを計算する
  //
  // ヒント: useMemo は「計算コストの高い処理」や
  // 「依存する値が変わらない限り再計算しない」ようにするフック。
  // ここでは totalVotes が 0 のときに 0 を返し、
  // それ以外は (count / totalVotes) * 100 を計算する。
  //
  // 実装すべきこと:
  // 1. useMemo を使って percentage を計算する
  // 2. totalVotes === 0 の場合は 0 を返す
  // 3. それ以外は Math.round((count / totalVotes) * 100) を返す
  // 4. 依存配列は [count, totalVotes]
  //
  // 参考:
  //   const percentage = useMemo(() => {
  //     計算ロジック
  //   }, [依存する値]);
  // --------------------------------------------------
  void useMemo; // TODO 実装後は不要（lint エラー回避用）
  const percentage: number = undefined as any;
  // ↑ ここを useMemo に置き換える

  return (
    <div className={`vote-bar ${isSelected ? "vote-bar--selected" : ""}`}>
      <div className="vote-bar__header">
        <span className="vote-bar__label">
          {label}
          {isSelected && <span className="vote-bar__check"> ✓</span>}
        </span>
        <span className="vote-bar__stats">
          {count}票 ({percentage ?? 0}%)
        </span>
      </div>
      <div className="vote-bar__track">
        {/* --------------------------------------------------
          バーの幅を percentage に応じて変化させる。
          CSS の transition プロパティで滑らかにアニメーションする。
          style の width に直接パーセンテージを指定する。
        -------------------------------------------------- */}
        <div
          className="vote-bar__fill"
          style={{
            width: `${percentage ?? 0}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
