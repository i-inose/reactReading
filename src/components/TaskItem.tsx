// ============================================================
// TaskItem.tsx ― 個別タスクの表示コンポーネント
//
// 【このファイルで学べること】
// - React.memo によるパフォーマンス最適化（メモ化）
// - useCallback でイベントハンドラをメモ化する理由
// - Props の型定義とイベントハンドリング
// - 条件付きクラス名・条件付きレンダリング
// ============================================================

// React.memo をインポートする
// memo: Props が変わらない場合に再レンダリングをスキップする高階コンポーネント
import { memo, useCallback } from "react";

// 型定義をインポートする
import type { Task } from "../types";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface TaskItemProps {
  task: Task;                           // 表示するタスクデータ
  onToggle: (id: number) => Promise<void>;  // 完了切替コールバック
  onDelete: (id: number) => Promise<void>;  // 削除コールバック
}

// --------------------------------------------------
// 優先度に対応するラベルのマッピング
// Record<K, V>: キーが K、値が V のオブジェクト型
// --------------------------------------------------
const priorityLabels: Record<Task["priority"], string> = {
  low: "低",
  medium: "中",
  high: "高",
};

// --------------------------------------------------
// TaskItem コンポーネント
//
// 【React.memo とは？】
// コンポーネントを memo() で囲むと、Props が前回と同じ場合に
// 再レンダリングをスキップする（浅い比較で判定）。
// リスト内の個々のアイテムなど、親の更新で不要な再描画が
// 発生しやすい箇所に使うと効果的。
//
// 注意: memo は Props の「浅い比較」を行う。
// オブジェクトや関数が毎回新しく作られると memo は効かない。
// → 親コンポーネント側で useCallback / useMemo を使う。
// --------------------------------------------------
export const TaskItem = memo(function TaskItem({
  task,
  onToggle,
  onDelete,
}: TaskItemProps) {
  // --------------------------------------------------
  // useCallback でイベントハンドラをメモ化する
  // 理由: この関数が毎回新しくなると、子要素（button）の
  // React.memo が効かなくなるため
  // --------------------------------------------------

  // 完了切替ハンドラ
  const handleToggle = useCallback(() => {
    // onToggle にタスクの id を渡して呼び出す
    onToggle(task.id);
  }, [task.id, onToggle]); // task.id か onToggle が変わったときだけ再生成

  // 削除ハンドラ
  const handleDelete = useCallback(() => {
    onDelete(task.id);
  }, [task.id, onDelete]);

  return (
    // className を動的に組み立てる
    // テンプレートリテラルと三項演算子を組み合わせる
    <div className={`task-item ${task.done ? "task-item--done" : ""}`}>
      {/* チェックボックス部分 */}
      <button
        className="task-item__toggle"
        onClick={handleToggle}
        aria-label={task.done ? "未完了に戻す" : "完了にする"}
      >
        {/* 条件付きレンダリング: && 演算子を使う方法 */}
        {/* 条件 && JSX → 条件が true のときだけ JSX を描画する */}
        {task.done && <span className="task-item__check">✓</span>}
      </button>

      {/* タスク情報 */}
      <div className="task-item__content">
        {/* タイトル */}
        <span className="task-item__title">{task.title}</span>

        {/* メタ情報 */}
        <div className="task-item__meta">
          {/* 優先度バッジ */}
          <span className={`task-item__priority task-item__priority--${task.priority}`}>
            {/* Record からラベルを取得する */}
            {priorityLabels[task.priority]}
          </span>

          {/* 作成日（Date オブジェクトで整形する） */}
          <span className="task-item__date">
            {new Date(task.createdAt).toLocaleDateString("ja-JP")}
          </span>
        </div>
      </div>

      {/* 削除ボタン */}
      <button
        className="task-item__delete"
        onClick={handleDelete}
        aria-label="タスクを削除"
      >
        ✕
      </button>
    </div>
  );
});
