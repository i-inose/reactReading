// ============================================================
// Header.tsx ― ナビゲーションヘッダー
//
// 【このファイルで学べること】
// - Link コンポーネントでページ遷移する
// ============================================================

import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo">
          Movie Search
        </Link>
        <nav className="header__nav">
          <Link to="/" className="header__link">
            映画一覧
          </Link>
        </nav>
      </div>
    </header>
  );
}
