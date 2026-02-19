// ============================================================
// EmployeeListPage.tsx ― 社員一覧ページ
//
// 【このファイルで学べること】
// 1. カスタムフック（useEmployees）で状態管理を分離する設計
// 2. 検索・フィルタ・ソート・ページネーションの統合
// 3. 複数コンポーネントを組み合わせたページ構築
// ============================================================

import { useEmployees } from "../hooks/useEmployees";
import { employees } from "../data/employees";
import { filterAndSort, paginate } from "../utils/paginate";
import { SearchBar } from "../components/SearchBar";
import { DepartmentFilter } from "../components/DepartmentFilter";
import { EmployeeTable } from "../components/EmployeeTable";
import { Pagination } from "../components/Pagination";

// --------------------------------------------------
// TODO(Q10): EmployeeListPage を完成させてください
//
// 【このページの構造】
// useEmployees フックから検索パラメータと操作関数を取得し、
// filterAndSort → paginate の順でデータを加工して表示する。
//
// 以下を実装します:
//   1. useEmployees() からデストラクチャリングで必要な値を取得する
//      必要な値: page, limit, query, department, sort, order,
//               debouncedQuery, setPage, setQuery, setDepartment, setSort, reset
//
//   2. filterAndSort で社員データをフィルタ・ソートする
//      filteredEmployees = filterAndSort(employees, { page, limit, query: debouncedQuery, department, sort, order })
//
//   3. paginate でページネーションする
//      result = paginate(filteredEmployees, page, limit)
//
//   4. 各コンポーネントに適切な props を渡す:
//      - SearchBar: value={query}, onSearch={setQuery}
//      - DepartmentFilter: current={department}, onChange={setDepartment}
//      - EmployeeTable: employees={result.items}, sort, order, onSort={setSort}
//      - Pagination: page={result.page}, totalPages={result.totalPages},
//                     total={result.total}, limit={result.limit}, onPageChange={setPage}
//
// ヒント: 05-api-design/src/pages/ProductListPage.tsx を参考に、
//         フックから値を取得 → データ加工 → JSX で描画 の流れで書く。
// 参考: 05-api-design/src/pages/ProductListPage.tsx
// --------------------------------------------------
export function EmployeeListPage() {
  // ここで useEmployees() を呼び出してください
  void useEmployees;
  void employees;
  void filterAndSort;
  void paginate;

  return (
    <div className="employee-list-page">
      {/* ページヘッダー */}
      <div className="employee-list-page__header">
        <h1 className="employee-list-page__title">社員一覧</h1>
        <button
          className="btn btn--secondary"
          onClick={() => {}} // ← reset に置き換える
        >
          リセット
        </button>
      </div>

      {/* 検索バー + 部署フィルター */}
      <div className="employee-list-page__toolbar">
        <SearchBar
          value={""}           // ← query に置き換える
          onSearch={() => {}}  // ← setQuery に置き換える
        />
      </div>

      <DepartmentFilter
        current={"all"}        // ← department に置き換える
        onChange={() => {}}     // ← setDepartment に置き換える
      />

      {/* 社員テーブル: EmployeeTable に適切な props を渡してください */}
      <EmployeeTable
        employees={[]}         // ← result.items に置き換える
        sort={"name"}          // ← sort に置き換える
        order={"asc"}          // ← order に置き換える
        onSort={() => {}}      // ← setSort に置き換える
      />

      {/* ページネーション: Pagination に適切な props を渡してください */}
      <Pagination
        page={1}               // ← result.page に置き換える
        totalPages={1}         // ← result.totalPages に置き換える
        total={0}              // ← result.total に置き換える
        limit={10}             // ← result.limit に置き換える
        onPageChange={() => {}} // ← setPage に置き換える
      />
    </div>
  );
}
