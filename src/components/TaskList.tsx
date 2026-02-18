// ============================================================
// TaskList.tsx ― タスク一覧コンポーネント
//
// 【このファイルで学べること】
// - 配列の map でリストを描画する方法
// - key プロパティの重要性
// - useMemo で計算結果をキャッシュする
// - 条件付きレンダリングの複数パターン
// ============================================================

import { useMemo } from "react";

// 型定義をインポートする
import type { Task, FilterType } from "../types";

// 子コンポーネントをインポートする
import { TaskItem } from "./TaskItem";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface TaskListProps {
  tasks: Task[];                              // タスクの配列
  filter: FilterType;                         // 現在のフィルター
  onToggle: (id: number) => Promise<void>;    // 完了切替
  onDelete: (id: number) => Promise<void>;    // 削除
}

// --------------------------------------------------
// TaskList コンポーネント
// --------------------------------------------------
export function TaskList({ tasks, filter, onToggle, onDelete }: TaskListProps) {
  // --------------------------------------------------
  // useMemo: 計算結果をメモ化（キャッシュ）するフック
  //
  // 【なぜ useMemo を使うのか？】
  // コンポーネントが再レンダリングされるたびに filter 処理が走るのを防ぐ。
  // tasks か filter が変わったときだけ再計算する。
  //
  // 使い方: const 値 = useMemo(() => 計算処理, [依存配列]);
  // --------------------------------------------------
  const filteredTasks = useMemo(() => {
    // switch 文でフィルター条件に応じた配列を返す
    switch (filter) {
      case "active":
        // filter メソッドで未完了タスクだけ残す
        return tasks.filter((task) => !task.done);
      case "completed":
        // 完了タスクだけ残す
        return tasks.filter((task) => task.done);
      case "all":
      default:
        // 全件返す
        return tasks;
    }
  }, [tasks, filter]); // tasks または filter が変わったときだけ再計算する

  // --------------------------------------------------
  // 条件付きレンダリング: 早期リターンパターン
  // タスクが空のときは専用のメッセージを表示する
  // --------------------------------------------------
  if (filteredTasks.length === 0) {
    return (
      <div className="task-list__empty">
        <p>
          {/* 三項演算子のネスト: 複数条件の分岐 */}
          {filter === "all"
            ? "タスクがありません。上のフォームから追加してみましょう！"
            : filter === "active"
              ? "未完了のタスクはありません 🎉"
              : "完了済みのタスクはありません"}
        </p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {/* --------------------------------------------------
        配列の map でリストを描画する

        【key プロパティとは？】
        React がリスト内の各要素を識別するために必要な特別な属性。
        key があることで、要素の追加・削除・並び替え時に
        最小限の DOM 操作で効率的に更新できる。

        【key のルール】
        - 兄弟要素間でユニークであること
        - 安定していること（index は非推奨: 並び替え時に問題が起きる）
        - データの id を使うのがベストプラクティス
      -------------------------------------------------- */}
      {filteredTasks.map((task) => (
        // key={task.id} でこの要素を一意に識別する
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
