// ============================================================
// taskReducer.ts ― useReducer 用のリデューサー
//
// 【useReducer とは？】
// useState の高機能版。状態の更新ロジックが複雑な場合に使う。
// Redux と同じ考え方: (現在のstate, action) → 新しいstate
// タスク管理のように「追加・削除・更新・フィルター変更」など
// 複数の操作がある場合に適している。
// ============================================================

import type { Task, FilterType } from "../types";

// --------------------------------------------------
// State の型: reducer が管理する状態の全体像
// --------------------------------------------------
export interface TaskState {
  tasks: Task[];            // タスクの配列
  filter: FilterType;       // 現在のフィルター（"all" | "active" | "completed"）
  isLoading: boolean;       // データ取得中かどうか
  error: string | null;     // エラーメッセージ（エラーなしなら null）
}

// --------------------------------------------------
// Action の型: 判別共用体（Discriminated Union）で定義する
// type プロパティがタグになり、switch 文で安全に分岐できる
// --------------------------------------------------
export type TaskAction =
  // データ取得を開始するアクション
  | { type: "FETCH_START" }
  // データ取得に成功したアクション（取得したタスク配列を持つ）
  | { type: "FETCH_SUCCESS"; payload: Task[] }
  // データ取得に失敗したアクション（エラーメッセージを持つ）
  | { type: "FETCH_ERROR"; payload: string }
  // タスクを追加するアクション（新しいタスクを持つ）
  | { type: "ADD_TASK"; payload: Task }
  // タスクの完了状態を切り替えるアクション（更新後のタスクを持つ）
  | { type: "TOGGLE_TASK"; payload: Task }
  // タスクを削除するアクション（削除する ID を持つ）
  | { type: "DELETE_TASK"; payload: number }
  // フィルターを変更するアクション
  | { type: "SET_FILTER"; payload: FilterType };

// --------------------------------------------------
// 初期状態
// --------------------------------------------------
export const initialTaskState: TaskState = {
  tasks: [],
  filter: "all",
  isLoading: false,
  error: null,
};

// --------------------------------------------------
// Reducer 関数
// 現在の state と action を受け取り、新しい state を返す
// 重要: state を直接変更せず、常に新しいオブジェクトを返す（イミュータブル）
// --------------------------------------------------
export function taskReducer(state: TaskState, action: TaskAction): TaskState {
  // switch 文で action.type を判定する
  // TypeScript は各 case で action.payload の型を自動的に絞り込む
  switch (action.type) {
    case "FETCH_START":
      // ローディング開始: isLoading を true にし、エラーをクリア
      return {
        ...state,          // スプレッド構文で既存の state をコピー
        isLoading: true,
        error: null,
      };

    case "FETCH_SUCCESS":
      // 取得成功: タスク配列をセットし、ローディングを解除
      return {
        ...state,
        tasks: action.payload,   // payload は Task[] と推論される
        isLoading: false,
      };

    case "FETCH_ERROR":
      // 取得失敗: エラーメッセージをセットし、ローディングを解除
      return {
        ...state,
        error: action.payload,   // payload は string と推論される
        isLoading: false,
      };

    case "ADD_TASK":
      // タスク追加: 既存配列の末尾に新しいタスクを追加
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };

    case "TOGGLE_TASK":
      // 完了切替: 該当 ID のタスクだけを更新後のデータに置き換え
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };

    case "DELETE_TASK":
      // 削除: 該当 ID のタスクを除外する
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };

    case "SET_FILTER":
      // フィルター変更
      return {
        ...state,
        filter: action.payload,
      };

    default:
      // ここに到達することはないが、型安全性のために書く
      return state;
  }
}
