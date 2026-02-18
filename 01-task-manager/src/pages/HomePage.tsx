// ============================================================
// HomePage.tsx ― メインページコンポーネント
//
// 【このファイルで学べること】
// - カスタムフックを使ってロジックとUIを分離する
// - 複数コンポーネントの組み合わせ（コンポジション）
// - 条件付きレンダリング（ローディング、エラー表示）
// - useState でモーダルの開閉を制御する
// ============================================================

import { useState, useCallback } from "react";

// カスタムフックをインポートする
// useTasks: タスクの CRUD 操作とフィルタリングを提供する
import { useTasks } from "../hooks/useTasks";

// コンポーネントをインポートする
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";
import { TaskStats } from "../components/TaskStats";
import { Modal } from "../components/Modal";

// --------------------------------------------------
// HomePage コンポーネント
// --------------------------------------------------
export function HomePage() {
  // --------------------------------------------------
  // カスタムフックからタスク管理に必要な値と関数を取得する
  // カスタムフックを使うことで、このコンポーネントはUIの描画に集中できる
  // --------------------------------------------------
  const {
    tasks,       // タスクの配列
    filter,      // 現在のフィルター
    isLoading,   // ローディング中フラグ
    error,       // エラーメッセージ
    addTask,     // タスク追加関数
    toggleTask,  // 完了切替関数
    deleteTask,  // 削除関数
    setFilter,   // フィルター変更関数
    refetch,     // データ再取得関数
  } = useTasks();

  // --------------------------------------------------
  // モーダルの開閉状態を useState で管理する
  // --------------------------------------------------
  const [isModalOpen, setIsModalOpen] = useState(false);

  // モーダルを開く関数
  const openModal = useCallback(() => setIsModalOpen(true), []);
  // モーダルを閉じる関数
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  // --------------------------------------------------
  // 条件付きレンダリング: ローディング中の表示
  // --------------------------------------------------
  if (isLoading) {
    return (
      <div className="page-loading">
        <p>読み込み中...</p>
      </div>
    );
  }

  // --------------------------------------------------
  // 条件付きレンダリング: エラー時の表示
  // --------------------------------------------------
  if (error) {
    return (
      <div className="page-error">
        <p>エラー: {error}</p>
        {/* refetch でデータの再取得を試みる */}
        <button onClick={refetch} className="page-error__btn">
          再読み込み
        </button>
      </div>
    );
  }

  // --------------------------------------------------
  // メインの UI を描画する
  // 各コンポーネントに必要な Props を渡す
  // --------------------------------------------------
  return (
    <div className="home-page">
      <h1 className="home-page__title">タスク管理</h1>

      {/* タスク追加フォーム */}
      {/* onAdd に addTask 関数を渡す（Props のバケツリレー） */}
      <TaskForm onAdd={addTask} />

      {/* 統計情報 + フィルター */}
      <TaskStats
        tasks={tasks}
        filter={filter}
        onFilterChange={setFilter}
      />

      {/* タスク一覧 */}
      <TaskList
        tasks={tasks}
        filter={filter}
        onToggle={toggleTask}
        onDelete={deleteTask}
      />

      {/* ヘルプボタン */}
      <button className="home-page__help-btn" onClick={openModal}>
        使い方
      </button>

      {/* モーダル（createPortal で body 直下にレンダリングされる） */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title="使い方ガイド">
        <div className="help-content">
          <h3>タスクの追加</h3>
          <p>上部のフォームにタスク名を入力し、優先度を選んで「追加」ボタンを押します。</p>
          <h3>タスクの完了</h3>
          <p>タスクの左側のボタンをクリックすると、完了/未完了を切り替えられます。</p>
          <h3>タスクの削除</h3>
          <p>タスクの右側の「✕」ボタンをクリックすると削除できます。</p>
          <h3>フィルター</h3>
          <p>「すべて」「未完了」「完了済み」のボタンで表示を絞り込めます。</p>
        </div>
      </Modal>
    </div>
  );
}
