// ============================================================
// TaskStats.tsx ― タスク統計情報コンポーネント
//
// 【このファイルで学べること】
// - useMemo で複数の計算結果をまとめてメモ化する
// - オブジェクトの分割代入
// - 算術演算と条件分岐を JSX 内で使う
// ============================================================

import { useMemo } from "react";
import type { Task, FilterType } from "../types";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface TaskStatsProps {
  tasks: Task[];         // タスクの配列
  filter: FilterType;    // 現在のフィルター
  onFilterChange: (filter: FilterType) => void;  // フィルター変更関数
}

// --------------------------------------------------
// フィルターボタンの定義
// as const で readonly タプルにする
// --------------------------------------------------
const FILTERS: { value: FilterType; label: string }[] = [
  { value: "all", label: "すべて" },
  { value: "active", label: "未完了" },
  { value: "completed", label: "完了済み" },
];

// --------------------------------------------------
// TaskStats コンポーネント
// --------------------------------------------------
export function TaskStats({ tasks, filter, onFilterChange }: TaskStatsProps) {
  // --------------------------------------------------
  // useMemo で統計情報を計算する
  // tasks が変わったときだけ再計算される
  // --------------------------------------------------
  const stats = useMemo(() => {
    // 全タスク数
    const total = tasks.length;

    // 完了数: filter で done が true のものを数える
    const completed = tasks.filter((t) => t.done).length;

    // 未完了数: 全体から完了数を引く
    const active = total - completed;

    // 完了率: 0 除算を防いでパーセントを計算する
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    // オブジェクトを返す（プロパティの省略記法: { total } は { total: total } と同じ）
    return { total, completed, active, percentage };
  }, [tasks]); // tasks が変わったときだけ再計算する

  return (
    <div className="task-stats">
      {/* 統計情報の表示 */}
      <div className="task-stats__summary">
        <span className="task-stats__item">
          全 {stats.total} 件
        </span>
        <span className="task-stats__item">
          完了 {stats.completed} 件
        </span>
        <span className="task-stats__item">
          未完了 {stats.active} 件
        </span>
        <span className="task-stats__item">
          {/* 進捗率をパーセントで表示する */}
          達成率 {stats.percentage}%
        </span>
      </div>

      {/* フィルターボタン */}
      <div className="task-stats__filters">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            // className を動的に切り替える
            // 現在のフィルターと一致するボタンにアクティブクラスを付ける
            className={`task-stats__filter-btn ${
              filter === f.value ? "task-stats__filter-btn--active" : ""
            }`}
            // onClick に直接アロー関数を書く方法
            // 注意: この方法だとレンダリングのたびに新しい関数が作られる
            // パフォーマンスが問題になる場合は useCallback を使う
            onClick={() => onFilterChange(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
