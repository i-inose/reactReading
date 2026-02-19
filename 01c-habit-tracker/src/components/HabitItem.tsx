import { useCallback } from "react";
import { memo } from "react";
import type { Habit } from "../types";

interface HabitItemProps {
  habit: Habit;
  todayStr: string;
  onToggle: (id: number, date: string) => void;
  onDelete: (id: number) => void;
}

// TODO(Q6): React.memo と useCallback を使ってパフォーマンスを最適化してください
// 以下の2つを実装します:
//   1. HabitItemInner コンポーネント内で useCallback を使い、
//      handleToggle と handleDelete をメモ化する
//      - handleToggle: () => onToggle(habit.id, todayStr)
//      - handleDelete: () => onDelete(habit.id)
//   2. コンポーネント全体を memo() でラップして export する
//
// ヒント: useCallback(fn, [deps]) で関数をメモ化する。
//         memo(Component) でコンポーネントの不要な再レンダリングを防ぐ。
// 参考: 01-task-manager/src/components/TaskItem.tsx

function HabitItemInner({ habit, todayStr, onToggle, onDelete }: HabitItemProps) {
  const isDoneToday = habit.completedDates.includes(todayStr);

  // ここに useCallback で handleToggle と handleDelete を書いてください
  const handleToggle = () => { onToggle(habit.id, todayStr); }; // ← useCallback で置き換える
  const handleDelete = () => { onDelete(habit.id); }; // ← useCallback で置き換える

  void useCallback; // ← 正しく実装したらこの行を削除

  const streak = calculateStreak(habit.completedDates);

  return (
    <li className={`habit-item ${isDoneToday ? "habit-item--done" : ""}`}>
      <button
        className="habit-item__toggle"
        onClick={handleToggle}
        style={{ borderColor: habit.color, backgroundColor: isDoneToday ? habit.color : "transparent" }}
        aria-label={isDoneToday ? "未完了に戻す" : "完了にする"}
      >
        {isDoneToday && <span className="habit-item__check">&#10003;</span>}
      </button>

      <div className="habit-item__content">
        <span className="habit-item__name">{habit.name}</span>
        <div className="habit-item__meta">
          <span className="habit-item__streak">
            {streak > 0 ? `${streak}日連続` : "未開始"}
          </span>
          <span className="habit-item__total">
            合計 {habit.completedDates.length} 回
          </span>
        </div>
      </div>

      <button
        className="habit-item__delete"
        onClick={handleDelete}
        aria-label="削除"
      >
        &#10005;
      </button>
    </li>
  );
}

function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;

  const sorted = [...completedDates].sort().reverse();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const latestDate = new Date(sorted[0] + "T00:00:00");
  const diffDays = Math.floor((today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays > 1) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const current = new Date(sorted[i - 1] + "T00:00:00");
    const prev = new Date(sorted[i] + "T00:00:00");
    const diff = Math.floor((current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// ここを memo(HabitItemInner) に変更してください
export const HabitItem = HabitItemInner; // ← memo() でラップする
void memo; // ← 正しく実装したらこの行を削除
