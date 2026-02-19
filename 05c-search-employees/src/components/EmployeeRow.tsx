// ============================================================
// EmployeeRow.tsx ― 社員テーブル行コンポーネント
//
// 【このファイルで学べること】
// 1. Link コンポーネントでテーブル行からページ遷移
// 2. 数値のフォーマット（toLocaleString, toLocaleDateString）
// 3. Record 型マッピングによる日本語表示
// ============================================================

import { Link } from "react-router-dom";
import { DEPARTMENT_LABELS } from "../types";
import type { Employee } from "../types";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface EmployeeRowProps {
  employee: Employee;
}

// --------------------------------------------------
// EmployeeRow コンポーネント
//
// 1行分の社員データをテーブル行として描画する。
// 社員名をクリックすると詳細ページに遷移する。
// --------------------------------------------------
export function EmployeeRow({ employee }: EmployeeRowProps) {
  return (
    <tr className="employee-table__row">
      {/* 社員名（詳細ページへのリンク） */}
      <td className="employee-table__td">
        <Link
          to={`/employees/${employee.id}`}
          className="employee-table__link"
        >
          {employee.name}
        </Link>
      </td>

      {/* 部署（日本語表示） */}
      <td className="employee-table__td">
        <span className="employee-table__department-badge">
          {DEPARTMENT_LABELS[employee.department]}
        </span>
      </td>

      {/* 入社日 */}
      <td className="employee-table__td employee-table__td--date">
        {new Date(employee.hireDate).toLocaleDateString("ja-JP")}
      </td>

      {/* 年収（カンマ区切り） */}
      <td className="employee-table__td employee-table__td--salary">
        &yen;{employee.salary.toLocaleString()}
      </td>

      {/* 役職 */}
      <td className="employee-table__td">
        {employee.position}
      </td>
    </tr>
  );
}
