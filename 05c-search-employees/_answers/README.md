# 05c-search-employees 解答集

このファイルには、穴埋め問題（Q1〜Q10）の解答が含まれています。
自分で考えた後に答え合わせとして参照してください。

---

## Q1: PaginatedResult\<T\> と Employee インターフェース

**ファイル:** `src/types.ts`

```typescript
/** ページネーション結果（ジェネリクス） */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** 社員データ */
export interface Employee {
  id: number;
  name: string;
  department: Department;
  position: string;
  email: string;
  hireDate: string;
  salary: number;
}
```

**ポイント:**
- `PaginatedResult<T>` の `<T>` はジェネリクス（型パラメータ）。`PaginatedResult<Employee>` と使うと `items` が `Employee[]` になる
- `department` のプロパティには `Department` リテラル型を指定し、型安全にする
- `05-api-design/src/types.ts` の `PaginatedResponse<T>` と同じパターン

---

## Q2: SortField / SortOrder / SearchParams

**ファイル:** `src/types.ts`

```typescript
/** ソート可能なカラム名 */
export type SortField = "name" | "hireDate" | "salary" | "department";

/** ソート順序 */
export type SortOrder = "asc" | "desc";

/** 検索パラメータ */
export interface SearchParams {
  page: number;
  limit: number;
  query: string;
  department: Department | "all";
  sort: SortField;
  order: SortOrder;
}
```

**ポイント:**
- `SortField` と `SortOrder` はリテラル型の Union。間違った値を指定するとコンパイルエラーになる
- `department: Department | "all"` で、既存の `Department` 型と `"all"` リテラルを組み合わせた Union 型を作れる
- `05-api-design/src/types.ts` の `SortField`, `SortOrder`, `ProductQueryParams` と同じパターン

---

## Q3: useDebounce フック

**ファイル:** `src/hooks/useDebounce.ts`

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

**ポイント:**
- `useState<T>(value)` でジェネリクス付きの state を定義
- `useEffect` のクリーンアップ関数（`return () => clearTimeout(timer)`）で前回のタイマーをキャンセルする。これにより「最後の変更から delay ミリ秒後」にだけ値が更新される
- 依存配列 `[value, delay]` で、value か delay が変わったときだけ effect が再実行される
- `05-api-design/src/hooks/useDebounce.ts` と同一の実装

---

## Q4: useReducer の呼び出し

**ファイル:** `src/hooks/useEmployees.ts`

```typescript
export function useEmployees() {
  const [state, dispatch] = useReducer(employeeReducer, defaultParams);
  const [searchParams, setSearchParams] = useSearchParams();

  const debouncedQuery = useDebounce(state.query, 300);

  // ... (Q5 の実装に続く)
```

**ポイント:**
- `useReducer(reducer, initialState)` は `[state, dispatch]` のタプルを返す
- `useState` の強化版で、複雑な状態遷移を Reducer 関数にまとめて管理する
- `useSearchParams()` は React Router が提供するフック。URL のクエリパラメータを読み書きできる
- `05-api-design/src/hooks/useProducts.ts` と同じパターン

---

## Q5: useSearchParams 双方向同期

**ファイル:** `src/hooks/useEmployees.ts`

```typescript
  // URL → State（初回のみ）
  useEffect(() => {
    const page = Number(searchParams.get("page")) || 1;
    const query = searchParams.get("query") || "";
    const department = (searchParams.get("department") || "all") as Department | "all";
    const sort = (searchParams.get("sort") || "name") as SortField;
    const order = (searchParams.get("order") || "asc") as SortOrder;

    if (page !== 1) dispatch({ type: "SET_PAGE", payload: page });
    if (query) dispatch({ type: "SET_QUERY", payload: query });
    if (department !== "all") dispatch({ type: "SET_DEPARTMENT", payload: department });
    if (sort !== "name" || order !== "asc") {
      dispatch({ type: "SET_SORT", payload: { sort, order } });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // State → URL（state 変更時）
  useEffect(() => {
    const params = new URLSearchParams();
    if (state.page > 1) params.set("page", String(state.page));
    if (debouncedQuery) params.set("query", debouncedQuery);
    if (state.department !== "all") params.set("department", state.department);
    if (state.sort !== "name") params.set("sort", state.sort);
    if (state.order !== "asc") params.set("order", state.order);

    setSearchParams(params, { replace: true });
  }, [state.page, debouncedQuery, state.department, state.sort, state.order, setSearchParams]);

  // useCallback のラップ
  const setPage = useCallback((p: number) => dispatch({ type: "SET_PAGE", payload: p }), []);
  const setLimit = useCallback((l: number) => dispatch({ type: "SET_LIMIT", payload: l }), []);
  const setQuery = useCallback((q: string) => dispatch({ type: "SET_QUERY", payload: q }), []);
  const setDepartment = useCallback((d: Department | "all") => dispatch({ type: "SET_DEPARTMENT", payload: d }), []);
  const setSort = useCallback((sort: SortField, order: SortOrder) => dispatch({ type: "SET_SORT", payload: { sort, order } }), []);
  const reset = useCallback(() => dispatch({ type: "RESET" }), []);
```

**ポイント:**
- **URL → State**: 依存配列が空配列 `[]` なので初回レンダリング時のみ実行。URL からパラメータを読み取って state に反映
- **State → URL**: `state.page`, `debouncedQuery` 等が変わるたびに URL を更新。`{ replace: true }` で履歴を汚さない
- `debouncedQuery` を使うことで、入力中の中間値が URL に反映されない
- `useCallback` で関数の参照を安定させ、子コンポーネントの不要な再描画を防ぐ
- `05-api-design/src/hooks/useProducts.ts` の URL 同期と同じパターン

---

## Q6: paginate と filterAndSort 関数

**ファイル:** `src/utils/paginate.ts`

```typescript
/** 配列をページネーションする汎用関数 */
export function paginate<T>(items: T[], page: number, limit: number): PaginatedResult<T> {
  const totalPages = Math.ceil(items.length / limit);
  const paginatedItems = items.slice((page - 1) * limit, page * limit);

  return {
    items: paginatedItems,
    total: items.length,
    page,
    limit,
    totalPages,
  };
}

/** 社員データをフィルタ・ソートする関数 */
export function filterAndSort(employees: Employee[], params: SearchParams): Employee[] {
  let result = [...employees];

  // 名前で検索フィルタ
  if (params.query) {
    const query = params.query.toLowerCase();
    result = result.filter((e) => e.name.toLowerCase().includes(query));
  }

  // 部署フィルタ
  if (params.department !== "all") {
    result = result.filter((e) => e.department === params.department);
  }

  // ソート
  result.sort((a, b) => {
    let comparison = 0;
    switch (params.sort) {
      case "name":
        comparison = a.name.localeCompare(b.name, "ja");
        break;
      case "department":
        comparison = a.department.localeCompare(b.department);
        break;
      case "salary":
        comparison = a.salary - b.salary;
        break;
      case "hireDate":
        comparison = a.hireDate.localeCompare(b.hireDate);
        break;
    }
    return params.order === "asc" ? comparison : -comparison;
  });

  return result;
}
```

**ポイント:**
- `paginate<T>` はジェネリクスで任意の型の配列に対応。`Employee` 以外にも再利用可能
- `Math.ceil` で総ページ数を切り上げ計算。`slice` でページ分のデータを取り出す
- `filterAndSort` は純粋関数（副作用なし）。元の配列を変更しないよう `[...employees]` でコピーしてからフィルタ・ソート
- 文字列比較には `localeCompare` を使い、日本語ソートにも対応
- `params.order === "asc" ? comparison : -comparison` で昇順/降順を切り替え

---

## Q7: Pagination のページ番号計算

**ファイル:** `src/components/Pagination.tsx`

```typescript
export function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 0) return null;

  // ページ番号の範囲を計算する
  const range = 2;
  const start = Math.max(1, page - range);
  const end = Math.min(totalPages, page + range);

  const pages: number[] = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  // 件数表示の計算
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="pagination">
      <span className="pagination__info">
        {from}〜{to} / {total}件
      </span>

      <div className="pagination__controls">
        <button
          className="pagination__btn"
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          aria-label="最初のページ"
        >
          &laquo;
        </button>

        <button
          className="pagination__btn"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="前のページ"
        >
          &lsaquo;
        </button>

        {start > 1 && <span className="pagination__ellipsis">...</span>}
        {pages.map((p) => (
          <button
            key={p}
            className={`pagination__btn ${
              p === page ? "pagination__btn--active" : ""
            }`}
            onClick={() => onPageChange(p)}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        ))}
        {end < totalPages && <span className="pagination__ellipsis">...</span>}

        <button
          className="pagination__btn"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          aria-label="次のページ"
        >
          &rsaquo;
        </button>

        <button
          className="pagination__btn"
          onClick={() => onPageChange(totalPages)}
          disabled={page === totalPages}
          aria-label="最後のページ"
        >
          &raquo;
        </button>
      </div>
    </div>
  );
}
```

**ポイント:**
- `Math.max(1, page - range)` で開始ページが1未満にならないよう制限
- `Math.min(totalPages, page + range)` で終了ページが総ページ数を超えないよう制限
- `start > 1` のとき先頭に `...` を表示、`end < totalPages` のとき末尾に `...` を表示
- `disabled={page === 1}` で最初のページでは「前へ」ボタンを無効化
- `05-api-design/src/components/Pagination.tsx` と同一パターン

---

## Q8: SearchBar のデバウンス検索

**ファイル:** `src/components/SearchBar.tsx`

```typescript
export function SearchBar({ value, onSearch }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);
  const debouncedValue = useDebounce(localValue, 300);

  // デバウンス値が変わったら親に通知
  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  // 外部から value が変更されたら localValue を同期
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-bar__input"
        placeholder="社員名で検索..."
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
      />
      {localValue && (
        <button
          className="search-bar__clear"
          onClick={() => {
            setLocalValue("");
            onSearch("");
          }}
          aria-label="検索をクリア"
        >
          &times;
        </button>
      )}
    </div>
  );
}
```

**ポイント:**
- ローカル state (`localValue`) でキー入力をリアルタイム反映。ユーザーに遅延を感じさせない
- `useDebounce(localValue, 300)` で300ms デバウンスした値を取得
- `useEffect` で `debouncedValue` が変わったときだけ `onSearch` を呼ぶ（フィルタリング実行）
- クリアボタンでは即座に `onSearch("")` も呼ぶ（デバウンスを待たない）
- 外部から `value` が変わった場合も `localValue` を同期（リセットボタン対応）

---

## Q9: SortHeader のソート切替

**ファイル:** `src/components/SortHeader.tsx`

```typescript
export function SortHeader({
  label,
  field,
  currentSort,
  currentOrder,
  onSort,
}: SortHeaderProps) {
  const handleClick = () => {
    if (field === currentSort) {
      // 同じカラム: 順序を反転
      onSort(field, currentOrder === "asc" ? "desc" : "asc");
    } else {
      // 別のカラム: asc でソート開始
      onSort(field, "asc");
    }
  };

  // ソートインジケーター
  const indicator = field === currentSort
    ? (currentOrder === "asc" ? " \u25B2" : " \u25BC")
    : "";

  return (
    <th
      className={`employee-table__th employee-table__th--sortable ${
        field === currentSort ? "employee-table__th--active" : ""
      }`}
      onClick={handleClick}
    >
      {label}
      <span className="employee-table__sort-indicator">
        {indicator}
      </span>
    </th>
  );
}
```

**ポイント:**
- 同じカラムをクリックすると `asc ↔ desc` をトグル。三項演算子でシンプルに書ける
- 別のカラムをクリックすると、そのカラムの `"asc"` でソート開始
- `\u25B2`（▲）と `\u25BC`（▼）でソート方向を視覚的に表示
- `05-api-design/src/components/ProductTable.tsx` の `handleSortClick` と `getSortIndicator` と同一ロジック

---

## Q10: EmployeeListPage の統合

**ファイル:** `src/pages/EmployeeListPage.tsx`

```typescript
export function EmployeeListPage() {
  const {
    page, limit, query, department, sort, order,
    debouncedQuery, setPage, setQuery, setDepartment, setSort, reset,
  } = useEmployees();

  // データ加工: フィルタ・ソート → ページネーション
  const filteredEmployees = filterAndSort(employees, {
    page, limit, query: debouncedQuery, department, sort, order,
  });
  const result = paginate(filteredEmployees, page, limit);

  return (
    <div className="employee-list-page">
      <div className="employee-list-page__header">
        <h1 className="employee-list-page__title">社員一覧</h1>
        <button className="btn btn--secondary" onClick={reset}>
          リセット
        </button>
      </div>

      <div className="employee-list-page__toolbar">
        <SearchBar value={query} onSearch={setQuery} />
      </div>

      <DepartmentFilter current={department} onChange={setDepartment} />

      {result.items.length === 0 ? (
        <p className="empty-message">該当する社員が見つかりません</p>
      ) : (
        <>
          <EmployeeTable
            employees={result.items}
            sort={sort}
            order={order}
            onSort={setSort}
          />

          <Pagination
            page={result.page}
            totalPages={result.totalPages}
            total={result.total}
            limit={result.limit}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
```

**ポイント:**
- `useEmployees()` からデストラクチャリングで必要な値を取得。ロジックはフックに、表示はコンポーネントに分離
- `filterAndSort` → `paginate` の順でデータを加工。フィルタ・ソート後のデータをページネーションする
- `debouncedQuery` を `filterAndSort` に渡すことで、デバウンス後の値でフィルタリングされる
- 各コンポーネントに対応する props を渡して接続する
- `05-api-design/src/pages/ProductListPage.tsx` と同じ構造だが、こちらはクライアントサイドでデータ加工する点が異なる
