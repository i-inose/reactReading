// ============================================================
// QuestionCard.tsx ― 質問と選択肢ボタンの表示
//
// 【このファイルで学べること】
// - 条件付きレンダリング（投票前/投票後で表示を切り替える）
// - 配列の map でリスト表示する
// - イベントハンドラに引数を渡すパターン
//
// 【04-realtime-chat との対応】
// chat の RoomSelector.tsx と似たパターン。
// 選択肢をボタンで表示し、クリックで選択する UI。
// ============================================================

import type { Question } from "../types";
import { VoteBar, BAR_COLORS } from "./VoteBar";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface QuestionCardProps {
  question: Question;        // 表示する質問
  votes: number[];           // 各選択肢の得票数
  hasVoted: boolean;         // 自分が投票済みかどうか
  selectedIndex: number | null;  // 自分が選んだ選択肢のインデックス
  onVote: (optionIndex: number) => void;  // 投票コールバック
}

// --------------------------------------------------
// QuestionCard コンポーネント
// --------------------------------------------------
export function QuestionCard({
  question,
  votes,
  hasVoted,
  selectedIndex,
  onVote,
}: QuestionCardProps) {
  // 全選択肢の合計得票数
  const totalVotes = votes.reduce((sum, v) => sum + v, 0);

  return (
    <div className="question-card">
      {/* 質問文 */}
      <h2 className="question-card__text">{question.text}</h2>

      {/* --------------------------------------------------
        投票前: 選択肢ボタンを表示
        投票後: 結果の棒グラフを表示
      -------------------------------------------------- */}
      {!hasVoted ? (
        <div className="question-card__options">
          {question.options.map((option, index) => (
            <button
              key={index}
              className="question-card__option-btn"
              onClick={() => onVote(index)}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <div className="question-card__results">
          {question.options.map((option, index) => (
            <VoteBar
              key={index}
              label={option}
              count={votes[index] ?? 0}
              totalVotes={totalVotes}
              color={BAR_COLORS[index % BAR_COLORS.length]}
              isSelected={selectedIndex === index}
            />
          ))}
          <p className="question-card__total">
            合計 {totalVotes} 票
          </p>
        </div>
      )}
    </div>
  );
}
