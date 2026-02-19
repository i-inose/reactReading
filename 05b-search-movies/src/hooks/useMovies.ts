// ============================================================
// useMovies.ts ― 映画データ管理カスタムフック
//
// 【このファイルで学べること】
// 1. useReducer による複雑な検索状態の管理
// 2. useSearchParams で URL クエリパラメータと同期する
// 3. useMemo でフィルタ結果をキャッシュする
// 4. クライアントサイドでの検索・フィルタ・ソート・ページネーション
// ============================================================

import { useReducer, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "./useDebounce";
import { movies as allMovies } from "../data/movies";
import { filterAndSort, paginate } from "../utils/paginate";
import type { SortField, SortOrder, Movie, PaginatedResult } from "../types";

// --------------------------------------------------
// State と Action の型定義
// --------------------------------------------------

interface MoviesState {
  page: number;
  limit: number;
  search: string;
  genre: string;
  sort: SortField;
  order: SortOrder;
  viewMode: "card" | "table";
}

// 【Discriminated Union（判別共用体）】
type MoviesAction =
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_GENRE"; payload: string }
  | { type: "SET_SORT"; payload: { sort: SortField; order: SortOrder } }
  | { type: "SET_VIEW_MODE"; payload: "card" | "table" }
  | { type: "RESET_FILTERS" };

const initialState: MoviesState = {
  page: 1,
  limit: 12,
  search: "",
  genre: "",
  sort: "rating",
  order: "desc",
  viewMode: "card",
};

// --------------------------------------------------
// Reducer 関数（純粋関数）
// --------------------------------------------------

function moviesReducer(state: MoviesState, action: MoviesAction): MoviesState {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload, page: 1 };
    case "SET_GENRE":
      return { ...state, genre: action.payload, page: 1 };
    case "SET_SORT":
      return { ...state, sort: action.payload.sort, order: action.payload.order, page: 1 };
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload };
    case "RESET_FILTERS":
      return { ...state, search: "", genre: "", sort: "rating", order: "desc", page: 1 };
    default:
      return state;
  }
}

// --------------------------------------------------
// useMovies フック本体
// --------------------------------------------------

export function useMovies() {
  const [state, dispatch] = useReducer(moviesReducer, initialState);
  const [searchParams, setSearchParams] = useSearchParams();

  const debouncedSearch = useDebounce(state.search, 300);

  // URL パラメータから初期状態を復元する
  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    const search = searchParams.get("search") || "";
    const genre = searchParams.get("genre") || "";
    const sort = (searchParams.get("sort") || "rating") as SortField;
    const order = (searchParams.get("order") || "desc") as SortOrder;
    const view = (searchParams.get("view") || "card") as "card" | "table";

    if (page !== 1) dispatch({ type: "SET_PAGE", payload: page });
    if (search) dispatch({ type: "SET_SEARCH", payload: search });
    if (genre) dispatch({ type: "SET_GENRE", payload: genre });
    if (sort !== "rating" || order !== "desc") {
      dispatch({ type: "SET_SORT", payload: { sort, order } });
    }
    if (view !== "card") dispatch({ type: "SET_VIEW_MODE", payload: view });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // URL クエリパラメータに同期する
  useEffect(() => {
    const params = new URLSearchParams();
    if (state.page > 1) params.set("page", String(state.page));
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (state.genre) params.set("genre", state.genre);
    if (state.sort !== "rating") params.set("sort", state.sort);
    if (state.order !== "desc") params.set("order", state.order);
    if (state.viewMode !== "card") params.set("view", state.viewMode);

    setSearchParams(params, { replace: true });
  }, [state.page, debouncedSearch, state.genre, state.sort, state.order, state.viewMode, setSearchParams]);

  // --------------------------------------------------
  // フィルタ・ソート・ページネーションの結果を useMemo でキャッシュ
  //
  // allMovies は固定データなので、検索条件が変わったときだけ再計算する。
  // --------------------------------------------------
  const filtered: Movie[] = useMemo(
    () => filterAndSort(allMovies, debouncedSearch, state.genre, state.sort, state.order),
    [debouncedSearch, state.genre, state.sort, state.order],
  );

  const paginatedResult: PaginatedResult<Movie> = useMemo(
    () => paginate(filtered, state.page, state.limit),
    [filtered, state.page, state.limit],
  );

  // ディスパッチ関数をラップして公開する
  const setPage = useCallback((p: number) => dispatch({ type: "SET_PAGE", payload: p }), []);
  const setSearch = useCallback((s: string) => dispatch({ type: "SET_SEARCH", payload: s }), []);
  const setGenre = useCallback((g: string) => dispatch({ type: "SET_GENRE", payload: g }), []);
  const setSort = useCallback(
    (sort: SortField, order: SortOrder) =>
      dispatch({ type: "SET_SORT", payload: { sort, order } }),
    [],
  );
  const setViewMode = useCallback(
    (mode: "card" | "table") => dispatch({ type: "SET_VIEW_MODE", payload: mode }),
    [],
  );
  const resetFilters = useCallback(() => dispatch({ type: "RESET_FILTERS" }), []);

  return {
    movies: paginatedResult.data,
    total: paginatedResult.total,
    totalPages: paginatedResult.totalPages,
    page: paginatedResult.page,
    limit: paginatedResult.limit,
    search: state.search,
    genre: state.genre,
    sort: state.sort,
    order: state.order,
    viewMode: state.viewMode,
    setPage,
    setSearch,
    setGenre,
    setSort,
    setViewMode,
    resetFilters,
  };
}
