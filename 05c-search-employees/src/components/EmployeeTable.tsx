// ============================================================
// EmployeeTable.tsx ― ソート機能付き社員テーブルコンポーネント
//
// 【このファイルで学べること】
// 1. SortHeader コンポーネントの使い方
// 2. テーブル構造（thead + tbody）の設計
// 3. コンポーネント分割（ヘッダーと行を分離）
// ============================================================

import { SortHeader } from "./SortHeader";
import { EmployeeRow } from "./EmployeeRow";
import type { Employee, SortField, SortOrder } from "../types";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface EmployeeTableProps {
  employees: Employee[];
  sort: SortField;
  order: SortOrder;
  onSort: (sort: SortField, order: SortOrder) => void;
}

// --------------------------------------------------
// ソート可能なカラムの定義
//
// { key: SortField, label: string } の配列でカラムを定義する。
// SortHeader に渡すことで、ソート機能付きヘッダーを生成する。
// --------------------------------------------------
const SORTABLE_COLUMNS: { key: SortField; label: string }[] = [
  { key: "name", label: "氏名" },
  { key: "department", label: "部署" },
  { key: "hireDate", label: "入社日" },
  { key: "salary", label: "年収" },
];

// --------------------------------------------------
// EmployeeTable コンポーネント
//
// SortHeader で各カラムヘッダーを描画し、
// EmployeeRow で各行を描画する。
// --------------------------------------------------
export function EmployeeTable({ employees, sort, order, onSort }: EmployeeTableProps) {
  return (
    <div className="employee-table-wrapper">
      <table className="employee-table">
        <thead>
          <tr>
            {/* ソート可能なカラムヘッダー */}
            {SORTABLE_COLUMNS.map((col) => (
              <SortHeader
                key={col.key}
                label={col.label}
                field={col.key}
                currentSort={sort}
                currentOrder={order}
                onSort={onSort}
              />
            ))}
            {/* 役職列はソート対象外 */}
            <th className="employee-table__th">役職</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <EmployeeRow key={employee.id} employee={employee} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
