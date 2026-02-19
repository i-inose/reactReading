// ============================================================
// useEmployees.ts ― 社員検索状態管理カスタムフック
//
// 【このファイルで学べること】
// 1. useReducer による複雑な状態管理
// 2. useSearchParams による URL クエリパラメータとの同期
// 3. Discriminated Union（判別共用体）によるアクション型
// 4. カスタムフックでロジックを UI から分離する設計
// ============================================================

import { useReducer, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "./useDebounce";
import type {
  Department,
  SortField,
  SortOrder,
  SearchParams,
} from "../types";

// --------------------------------------------------
// State と Action の型定義
//
// 【useReducer とは？】
// useState の強化版。複数の関連する state をまとめて管理する。
// Redux と同じ「Action → Reducer → 新 State」パターンを使う。
// 状態遷移が複雑な場合に useState よりも整理しやすい。
// --------------------------------------------------

// 【Discriminated Union（判別共用体）】
// type フィールドでアクションの種類を区別する。
// switch 文で型が自動的に絞り込まれる（型ガード）。
type EmployeeAction =
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_LIMIT"; payload: number }
  | { type: "SET_QUERY"; payload: string }
  | { type: "SET_DEPARTMENT"; payload: Department | "all" }
  | { type: "SET_SORT"; payload: { sort: SortField; order: SortOrder } }
  | { type: "RESET" };

// --------------------------------------------------
// Reducer 関数（完成済み）
//
// 純粋関数: 同じ入力に対して常に同じ出力を返す。
// state を直接変更せず、新しいオブジェクトを返す（イミュータブル更新）。
// --------------------------------------------------
function employeeReducer(state: SearchParams, action: EmployeeAction): SearchParams {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_LIMIT":
      // 表示件数が変わったらページを1に戻す
      return { ...state, limit: action.payload, page: 1 };
    case "SET_QUERY":
      // 検索条件が変わったらページを1に戻す
      return { ...state, query: action.payload, page: 1 };
    case "SET_DEPARTMENT":
      return { ...state, department: action.payload, page: 1 };
    case "SET_SORT":
      return { ...state, sort: action.payload.sort, order: action.payload.order, page: 1 };
    case "RESET":
      return defaultParams;
    default:
      return state;
  }
}

// --------------------------------------------------
// デフォルトの検索パラメータ
// --------------------------------------------------
const defaultParams: SearchParams = {
  page: 1,
  limit: 10,
  query: "",
  department: "all",
  sort: "name",
  order: "asc",
};

// --------------------------------------------------
// useEmployees フック本体
// --------------------------------------------------

// TODO(Q4): useReducer の呼び出しと初期状態を設定してください
//
// 以下の2つを実装します:
//   1. useReducer(employeeReducer, defaultParams) を呼び出し、
//      [state, dispatch] を取得する
//   2. useSearchParams() を呼び出し、
//      [searchParams, setSearchParams] を取得する
//
// ヒント: useReducer の戻り値は [state, dispatch] のタプル。
//         const [state, dispatch] = useReducer(reducer, initialState); の形式。
//         useSearchParams は react-router-dom が提供するフック。
// 参考: 05-api-design/src/hooks/useProducts.ts の useReducer + useSearchParams 呼び出し
//
// TODO(Q5): useSearchParams による双方向同期を実装してください
//
// 以下の2つの useEffect を実装します:
//
// 【Effect 1: URL → State（初回マウント時に URL パラメータを読み込む）】
//   searchParams.get("page"), searchParams.get("query") 等で URL から値を取得し、
//   dispatch で state に反映する。依存配列は空配列 [] にする（初回のみ実行）。
//
// 【Effect 2: State → URL（state が変わるたびに URL パラメータを更新する）】
//   new URLSearchParams() を作成し、デフォルト値と異なるパラメータだけ set する。
//   setSearchParams(params, { replace: true }) で URL を更新する。
//   依存配列は同期対象の state プロパティ + setSearchParams。
//
// ヒント: 05-api-design/src/hooks/useProducts.ts の2つの useEffect を参考に。
//         URL → State は初回のみ（[]）、State → URL は state 変更時に実行。
//         debouncedQuery を URL 同期に使うことで、入力中の中間値が URL に反映されない。
// 参考: 05-api-design/src/hooks/useProducts.ts

export function useEmployees() {
  // ここに useReducer と useSearchParams を書いてください

  const _state = undefined as any as SearchParams; // ← useReducer で置き換える
  const _dispatch = undefined as any as React.Dispatch<EmployeeAction>; // ← useReducer で置き換える
  const _searchParams = undefined as any as URLSearchParams; // ← useSearchParams で置き換える
  const _setSearchParams = undefined as any as ReturnType<typeof useSearchParams>[1]; // ← useSearchParams で置き換える

  void useReducer;
  void useEffect;
  void useSearchParams;
  void _dispatch;
  void _searchParams;
  void _setSearchParams;

  // 検索テキストをデバウンスする（300ms の遅延）
  const debouncedQuery = useDebounce(_state.query, 300);

  // ここに URL → State の useEffect を書いてください（初回のみ実行）

  // ここに State → URL の useEffect を書いてください（state 変更時に実行）

  // --------------------------------------------------
  // ディスパッチ関数をラップして公開する
  //
  // 【useCallback とは？】
  // 関数の参照を安定させるフック。依存配列が変わらない限り
  // 同じ関数オブジェクトを返す。子コンポーネントの不要な再描画を防ぐ。
  // --------------------------------------------------
  const setPage = useCallback((_p: number) => {}, []); // ← dispatch で置き換える
  const setLimit = useCallback((_l: number) => {}, []); // ← dispatch で置き換える
  const setQuery = useCallback((_q: string) => {}, []); // ← dispatch で置き換える
  const setDepartment = useCallback((_d: Department | "all") => {}, []); // ← dispatch で置き換える
  const setSort = useCallback((_sort: SortField, _order: SortOrder) => {}, []); // ← dispatch で置き換える
  const reset = useCallback(() => {}, []); // ← dispatch で置き換える

  return {
    ..._state,
    debouncedQuery,
    setPage,
    setLimit,
    setQuery,
    setDepartment,
    setSort,
    reset,
  };
}
