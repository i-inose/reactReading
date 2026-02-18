// ============================================================
// useTasks.ts ― タスク管理のカスタムフック
//
// 【カスタムフックとは？】
// React の組み込みフック（useState, useEffect 等）を組み合わせて
// 再利用可能なロジックを切り出したもの。名前は必ず "use" で始める。
// コンポーネントからロジックを分離し、テストしやすくする。
// ============================================================

import { useReducer, useEffect, useCallback } from "react";
import { taskReducer, initialTaskState } from "../reducers/taskReducer";
import * as api from "../api";     // api.ts の全関数をまとめてインポート
import type { CreateTaskInput } from "../types";

// --------------------------------------------------
// カスタムフックの戻り値の型
// コンポーネントに公開する値と関数を定義する
// --------------------------------------------------
interface UseTasksReturn {
  tasks: typeof initialTaskState.tasks;  // typeof でフィールドの型を取得
  filter: typeof initialTaskState.filter;
  isLoading: boolean;
  error: string | null;
  addTask: (input: CreateTaskInput) => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  setFilter: (filter: typeof initialTaskState.filter) => void;
  refetch: () => Promise<void>;
}

// --------------------------------------------------
// useTasks カスタムフック本体
// --------------------------------------------------
export function useTasks(): UseTasksReturn {
  // useReducer: 複雑な状態管理に使うフック
  // useState と違い、更新ロジックを reducer 関数に集約できる
  // 戻り値は [現在のstate, dispatch関数] のタプル
  const [state, dispatch] = useReducer(taskReducer, initialTaskState);

  // --------------------------------------------------
  // データ取得関数
  // useCallback でメモ化して、依存配列に入れても無限ループしないようにする
  // --------------------------------------------------
  const fetchData = useCallback(async () => {
    // ローディング開始のアクションを dispatch（発行）する
    dispatch({ type: "FETCH_START" });

    try {
      // API からタスク一覧を取得する
      const tasks = await api.fetchTasks();

      // 取得成功のアクションを dispatch する
      dispatch({ type: "FETCH_SUCCESS", payload: tasks });
    } catch (err) {
      // 取得失敗のアクションを dispatch する
      const message = err instanceof Error ? err.message : "不明なエラー";
      dispatch({ type: "FETCH_ERROR", payload: message });
    }
  }, []); // 依存なし → 関数は一度だけ作られる

  // --------------------------------------------------
  // useEffect: 副作用（API 呼び出し、DOM 操作等）を実行するフック
  // コンポーネントのマウント時にデータを取得する
  // --------------------------------------------------
  useEffect(() => {
    // useEffect 内で async 関数を直接書けないので、即座に呼び出す
    fetchData();
  }, [fetchData]); // fetchData が変わったときに再実行（実質マウント時のみ）

  // --------------------------------------------------
  // タスク追加
  // --------------------------------------------------
  const addTask = useCallback(async (input: CreateTaskInput) => {
    try {
      // API でタスクを作成する
      const newTask = await api.createTask(input);

      // 成功したらローカルの state にも追加する
      dispatch({ type: "ADD_TASK", payload: newTask });
    } catch (err) {
      const message = err instanceof Error ? err.message : "不明なエラー";
      dispatch({ type: "FETCH_ERROR", payload: message });
    }
  }, []);

  // --------------------------------------------------
  // タスクの完了切り替え
  // --------------------------------------------------
  const toggleTask = useCallback(async (id: number) => {
    try {
      const updated = await api.toggleTask(id);
      dispatch({ type: "TOGGLE_TASK", payload: updated });
    } catch (err) {
      const message = err instanceof Error ? err.message : "不明なエラー";
      dispatch({ type: "FETCH_ERROR", payload: message });
    }
  }, []);

  // --------------------------------------------------
  // タスク削除
  // --------------------------------------------------
  const deleteTask = useCallback(async (id: number) => {
    try {
      await api.deleteTask(id);
      dispatch({ type: "DELETE_TASK", payload: id });
    } catch (err) {
      const message = err instanceof Error ? err.message : "不明なエラー";
      dispatch({ type: "FETCH_ERROR", payload: message });
    }
  }, []);

  // --------------------------------------------------
  // フィルター変更
  // --------------------------------------------------
  const setFilter = useCallback((filter: typeof initialTaskState.filter) => {
    dispatch({ type: "SET_FILTER", payload: filter });
  }, []);

  // --------------------------------------------------
  // フックの戻り値
  // state の各フィールドと操作関数をまとめて返す
  // --------------------------------------------------
  return {
    tasks: state.tasks,
    filter: state.filter,
    isLoading: state.isLoading,
    error: state.error,
    addTask,
    toggleTask,
    deleteTask,
    setFilter,
    refetch: fetchData,
  };
}
