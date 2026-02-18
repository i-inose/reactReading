// ============================================================
// Header.tsx ― ナビゲーションヘッダーコンポーネント
//
// 【このファイルで学べること】
// 1. React Router の Link コンポーネントによるページ遷移
// 2. シンプルなレイアウトコンポーネントの設計
// ============================================================

import { Link } from "react-router-dom";

// --------------------------------------------------
// Header コンポーネント
// --------------------------------------------------
export function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        {/* ロゴ兼トップページリンク */}
        <Link to="/" className="header__logo">
          Product Manager
        </Link>

        {/* ナビゲーションリンク */}
        <nav className="header__nav">
          <Link to="/" className="header__link">
            商品一覧
          </Link>
        </nav>
      </div>
    </header>
  );
}
