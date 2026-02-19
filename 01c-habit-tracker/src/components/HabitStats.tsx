import { useMemo } from "react";
import type { Habit } from "../types";

interface HabitStatsProps {
  habits: Habit[];
}

// TODO(Q8): useMemo を使って統計データの計算をメモ化してください
// 以下を useMemo の中で計算します:
//   - totalHabits: habits の総数
//   - todayStr: 今日の日付文字列（new Date().toISOString().split("T")[0]）
//   - completedToday: 今日完了済みの習慣の数
//     （habits.filter(h => h.completedDates.includes(todayStr)).length）
//   - completionRate: 完了率（totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0）
//   - return { totalHabits, completedToday, completionRate, todayStr }
//
// ヒント: useMemo(() => { ... return 計算結果 }, [habits]) で、
//         habits が変わったときだけ再計算される。
// 参考: useMemo は React のメモ化フック。重い計算の結果をキャッシュする。
export function HabitStats({ habits }: HabitStatsProps) {
  // ここに useMemo で stats を計算してください
  const stats = undefined as any as {
    totalHabits: number;
    completedToday: number;
    completionRate: number;
    todayStr: string;
  }; // ← useMemo(() => { ... }, [habits]) で置き換える

  void useMemo; // ← 正しく実装したらこの行を削除
  void habits; // ← 正しく実装したらこの行を削除

  return (
    <div className="habit-stats">
      <div className="habit-stats__summary">
        <span>合計: {stats.totalHabits} 件</span>
        <span>今日完了: {stats.completedToday} 件</span>
        <span>達成率: {stats.completionRate}%</span>
        <span>日付: {stats.todayStr}</span>
      </div>
      <div className="habit-stats__bar">
        <div
          className="habit-stats__bar-fill"
          style={{ width: `${stats.completionRate}%` }}
        />
      </div>
    </div>
  );
}
