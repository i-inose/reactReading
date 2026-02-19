// ============================================================
// EmployeeDetailPage.tsx ― 社員詳細ページ
//
// 【このファイルで学べること】
// 1. useParams で URL パラメータを取得する方法
// 2. 配列の find メソッドでデータを検索する方法
// 3. 条件分岐による「見つからない」ケースの処理
// ============================================================

import { useParams, Link } from "react-router-dom";
import { employees } from "../data/employees";
import { DEPARTMENT_LABELS } from "../types";

// --------------------------------------------------
// EmployeeDetailPage コンポーネント
//
// URL のパスパラメータ（:id）から社員IDを取得し、
// employees 配列から該当する社員を検索して表示する。
// --------------------------------------------------
export function EmployeeDetailPage() {
  // 【useParams とは？】
  // URL のパスパラメータ（:id 部分）を取得するフック。
  // /employees/42 → { id: "42" } が返る。
  const { id } = useParams<{ id: string }>();

  // employees 配列から ID で社員を検索する
  const employee = employees.find((e) => e.id === Number(id));

  // 社員が見つからない場合
  if (!employee) {
    return (
      <div className="employee-detail">
        <nav className="breadcrumb">
          <Link to="/">社員一覧</Link>
          <span className="breadcrumb__separator">/</span>
          <span>不明</span>
        </nav>
        <p className="error-message">社員が見つかりません（ID: {id}）</p>
      </div>
    );
  }

  return (
    <div className="employee-detail">
      {/* パンくずリスト */}
      <nav className="breadcrumb">
        <Link to="/">社員一覧</Link>
        <span className="breadcrumb__separator">/</span>
        <span>{employee.name}</span>
      </nav>

      {/* 社員情報ヘッダー */}
      <div className="employee-detail__header">
        <div>
          <h1 className="employee-detail__name">{employee.name}</h1>
          <span className="employee-detail__department">
            {DEPARTMENT_LABELS[employee.department]}
          </span>
        </div>
      </div>

      {/* 社員情報詳細 */}
      <div className="employee-detail__body">
        <div className="employee-detail__avatar">
          <span className="employee-detail__initial">
            {employee.name.charAt(0)}
          </span>
        </div>
        <div className="employee-detail__info">
          <dl className="employee-detail__specs">
            <dt>氏名</dt>
            <dd>{employee.name}</dd>
            <dt>部署</dt>
            <dd>{DEPARTMENT_LABELS[employee.department]}</dd>
            <dt>役職</dt>
            <dd>{employee.position}</dd>
            <dt>メール</dt>
            <dd>
              <a href={`mailto:${employee.email}`}>{employee.email}</a>
            </dd>
            <dt>入社日</dt>
            <dd>{new Date(employee.hireDate).toLocaleDateString("ja-JP")}</dd>
            <dt>年収</dt>
            <dd>&yen;{employee.salary.toLocaleString()}</dd>
          </dl>
        </div>
      </div>

      {/* 戻るリンク */}
      <div className="employee-detail__footer">
        <Link to="/" className="btn btn--secondary">
          &larr; 社員一覧に戻る
        </Link>
      </div>
    </div>
  );
}
