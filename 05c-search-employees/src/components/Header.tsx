// ============================================================
// Header.tsx ― ヘッダーコンポーネント
//
// 【このファイルで学べること】
// 1. React Router の Link コンポーネントによるナビゲーション
// 2. レイアウトコンポーネントの設計パターン
// ============================================================

import { Link } from "react-router-dom";

// --------------------------------------------------
// Header コンポーネント
//
// 全ページで共通表示されるヘッダー。
// Link コンポーネントを使うことで、ページ遷移時にリロードせず
// SPA（Single Page Application）として動作する。
// --------------------------------------------------
export function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo">
          社員検索
        </Link>
        <nav className="header__nav">
          <Link to="/" className="header__link">
            社員一覧
          </Link>
        </nav>
      </div>
    </header>
  );
}
