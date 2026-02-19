// ============================================================
// DepartmentFilter.tsx ― 部署フィルターコンポーネント
//
// 【このファイルで学べること】
// 1. リテラル型の配列を使ったボタン生成
// 2. 条件付きクラス名の適用（アクティブ状態）
// 3. Record 型を使った日本語マッピング
// ============================================================

import { DEPARTMENT_LABELS } from "../types";
import type { Department } from "../types";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface DepartmentFilterProps {
  current: Department | "all";
  onChange: (department: Department | "all") => void;
}

// --------------------------------------------------
// 部署の選択肢配列
//
// Object.keys で DEPARTMENT_LABELS のキー一覧を取得する。
// as Department[] でキャストすることで型安全にする。
// --------------------------------------------------
const departments = Object.keys(DEPARTMENT_LABELS) as Department[];

// --------------------------------------------------
// DepartmentFilter コンポーネント
//
// 「すべて」+ 各部署のボタンを横並びで表示する。
// 選択中の部署には --active クラスを付与してハイライトする。
// --------------------------------------------------
export function DepartmentFilter({ current, onChange }: DepartmentFilterProps) {
  return (
    <div className="department-filter">
      <span className="department-filter__title">部署:</span>
      <div className="department-filter__buttons">
        {/* 「すべて」ボタン */}
        <button
          className={`department-filter__btn ${
            current === "all" ? "department-filter__btn--active" : ""
          }`}
          onClick={() => onChange("all")}
        >
          すべて
        </button>

        {/* 各部署ボタン */}
        {departments.map((dept) => (
          <button
            key={dept}
            className={`department-filter__btn ${
              current === dept ? "department-filter__btn--active" : ""
            }`}
            onClick={() => onChange(dept)}
          >
            {DEPARTMENT_LABELS[dept]}
          </button>
        ))}
      </div>
    </div>
  );
}
