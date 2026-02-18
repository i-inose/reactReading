// ============================================================
// useProducts.ts ― 商品データ管理カスタムフック
//
// 【このファイルで学べること】
// 1. useReducer による複雑な状態管理
// 2. useSearchParams による URL クエリパラメータとの同期
// 3. useEffect でのデータフェッチパターン
// 4. カスタムフックでロジックを UI から分離する設計
// ============================================================

import { useReducer, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts, fetchCategories } from "../api";
import { useDebounce } from "./useDebounce";
import type {
  Product,
  Category,
  SortField,
  SortOrder,
  ProductQueryParams,
} from "../types";

// --------------------------------------------------
// State と Action の型定義
//
// 【useReducer とは？】
// useState の強化版。複数の関連する state をまとめて管理する。
// Redux と同じ「Action → Reducer → 新 State」パターンを使う。
// 状態遷移が複雑な場合に useState よりも整理しやすい。
// --------------------------------------------------

interface ProductsState {
  products: Product[];
  categories: Category[];
  total: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  // クエリパラメータ
  page: number;
  limit: number;
  search: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  sort: SortField;
  order: SortOrder;
}

// 【Discriminated Union（判別共用体）】
// type フィールドでアクションの種類を区別する。
// switch 文で型が自動的に絞り込まれる（型ガード）。
type ProductsAction =
  | { type: "SET_LOADING" }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_DATA"; payload: { products: Product[]; total: number; totalPages: number } }
  | { type: "SET_CATEGORIES"; payload: Category[] }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_PRICE_RANGE"; payload: { min: number | null; max: number | null } }
  | { type: "SET_SORT"; payload: { sort: SortField; order: SortOrder } }
  | { type: "RESET_FILTERS" };

// --------------------------------------------------
// 初期状態
// --------------------------------------------------
const initialState: ProductsState = {
  products: [],
  categories: [],
  total: 0,
  totalPages: 0,
  loading: false,
  error: null,
  page: 1,
  limit: 10,
  search: "",
  category: "",
  minPrice: null,
  maxPrice: null,
  sort: "created_at",
  order: "desc",
};

// --------------------------------------------------
// Reducer 関数
//
// 純粋関数: 同じ入力に対して常に同じ出力を返す。
// state を直接変更せず、新しいオブジェクトを返す（イミュータブル更新）。
// --------------------------------------------------
function productsReducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: true, error: null };
    case "SET_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "SET_DATA":
      return {
        ...state,
        loading: false,
        products: action.payload.products,
        total: action.payload.total,
        totalPages: action.payload.totalPages,
      };
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_SEARCH":
      // 検索条件が変わったらページを1に戻す
      return { ...state, search: action.payload, page: 1 };
    case "SET_CATEGORY":
      return { ...state, category: action.payload, page: 1 };
    case "SET_PRICE_RANGE":
      return { ...state, minPrice: action.payload.min, maxPrice: action.payload.max, page: 1 };
    case "SET_SORT":
      return { ...state, sort: action.payload.sort, order: action.payload.order, page: 1 };
    case "RESET_FILTERS":
      return {
        ...state,
        search: "",
        category: "",
        minPrice: null,
        maxPrice: null,
        sort: "created_at",
        order: "desc",
        page: 1,
      };
    default:
      return state;
  }
}

// --------------------------------------------------
// useProducts フック本体
// --------------------------------------------------
export function useProducts() {
  const [state, dispatch] = useReducer(productsReducer, initialState);
  const [searchParams, setSearchParams] = useSearchParams();

  // 検索テキストをデバウンスする（300ms の遅延）
  const debouncedSearch = useDebounce(state.search, 300);

  // --------------------------------------------------
  // URL クエリパラメータから初期状態を復元する
  //
  // 【useSearchParams とは？】
  // React Router が提供する、URL のクエリパラメータを管理するフック。
  // ?page=2&category=書籍 のような URL パラメータを読み書きできる。
  // ブラウザの「戻る」ボタンでフィルタ状態を復元できる。
  // --------------------------------------------------
  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sort = (searchParams.get("sort") || "created_at") as SortField;
    const order = (searchParams.get("order") || "desc") as SortOrder;

    if (page !== 1) dispatch({ type: "SET_PAGE", payload: page });
    if (search) dispatch({ type: "SET_SEARCH", payload: search });
    if (category) dispatch({ type: "SET_CATEGORY", payload: category });
    if (sort !== "created_at" || order !== "desc") {
      dispatch({ type: "SET_SORT", payload: { sort, order } });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------------------------------
  // URL クエリパラメータを同期する
  // --------------------------------------------------
  useEffect(() => {
    const params = new URLSearchParams();
    if (state.page > 1) params.set("page", String(state.page));
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (state.category) params.set("category", state.category);
    if (state.sort !== "created_at") params.set("sort", state.sort);
    if (state.order !== "desc") params.set("order", state.order);

    setSearchParams(params, { replace: true });
  }, [state.page, debouncedSearch, state.category, state.sort, state.order, setSearchParams]);

  // --------------------------------------------------
  // カテゴリ一覧を取得する（初回のみ）
  // --------------------------------------------------
  useEffect(() => {
    fetchCategories()
      .then((cats) => dispatch({ type: "SET_CATEGORIES", payload: cats }))
      .catch(() => {/* カテゴリ取得失敗は無視 */});
  }, []);

  // --------------------------------------------------
  // 商品データを取得する
  //
  // debouncedSearch を依存配列に入れることで、
  // 検索テキストが確定（デバウンス後）してから API を呼ぶ。
  // --------------------------------------------------
  useEffect(() => {
    dispatch({ type: "SET_LOADING" });

    const params: ProductQueryParams = {
      page: state.page,
      limit: state.limit,
      search: debouncedSearch,
      category: state.category,
      minPrice: state.minPrice,
      maxPrice: state.maxPrice,
      sort: state.sort,
      order: state.order,
    };

    fetchProducts(params)
      .then((res) => {
        dispatch({
          type: "SET_DATA",
          payload: {
            products: res.data,
            total: res.total,
            totalPages: res.totalPages,
          },
        });
      })
      .catch((err) => {
        dispatch({ type: "SET_ERROR", payload: err.message });
      });
  }, [
    state.page, state.limit, debouncedSearch,
    state.category, state.minPrice, state.maxPrice,
    state.sort, state.order,
  ]);

  // --------------------------------------------------
  // ディスパッチ関数をラップして公開する
  //
  // 【useCallback とは？】
  // 関数の参照を安定させるフック。依存配列が変わらない限り
  // 同じ関数オブジェクトを返す。子コンポーネントの不要な再描画を防ぐ。
  // --------------------------------------------------
  const setPage = useCallback((p: number) => dispatch({ type: "SET_PAGE", payload: p }), []);
  const setSearch = useCallback((s: string) => dispatch({ type: "SET_SEARCH", payload: s }), []);
  const setCategory = useCallback((c: string) => dispatch({ type: "SET_CATEGORY", payload: c }), []);
  const setPriceRange = useCallback(
    (min: number | null, max: number | null) =>
      dispatch({ type: "SET_PRICE_RANGE", payload: { min, max } }),
    []
  );
  const setSort = useCallback(
    (sort: SortField, order: SortOrder) =>
      dispatch({ type: "SET_SORT", payload: { sort, order } }),
    []
  );
  const resetFilters = useCallback(() => dispatch({ type: "RESET_FILTERS" }), []);
  const reload = useCallback(() => {
    dispatch({ type: "SET_LOADING" });
    const params: ProductQueryParams = {
      page: state.page,
      limit: state.limit,
      search: debouncedSearch,
      category: state.category,
      minPrice: state.minPrice,
      maxPrice: state.maxPrice,
      sort: state.sort,
      order: state.order,
    };
    fetchProducts(params)
      .then((res) => {
        dispatch({
          type: "SET_DATA",
          payload: { products: res.data, total: res.total, totalPages: res.totalPages },
        });
      })
      .catch((err) => dispatch({ type: "SET_ERROR", payload: err.message }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.page, state.limit, debouncedSearch, state.category, state.minPrice, state.maxPrice, state.sort, state.order]);

  return {
    ...state,
    setPage,
    setSearch,
    setCategory,
    setPriceRange,
    setSort,
    resetFilters,
    reload,
  };
}
