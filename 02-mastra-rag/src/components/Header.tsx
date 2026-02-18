// ============================================================
// src/components/Header.tsx - ナビゲーションヘッダー
// ============================================================
// 【このファイルで学べること】
// - React Router の NavLink によるナビゲーション
// - アクティブリンクのスタイリング
// ============================================================

import { NavLink } from "react-router-dom";

// --------------------------------------------------
// 【NavLink とは？】
// React Router が提供するリンクコンポーネント。
// 通常の <a> タグと異なり、ページ全体を再読み込みせずに
// SPA 内でページを切り替える。現在のパスと一致する場合に
// className に "active" が追加される。
// --------------------------------------------------

export function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <h1 className="header__title">
          Mastra RAG
          <span className="header__subtitle">Document Q&amp;A</span>
        </h1>
        <nav className="header__nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `header__link ${isActive ? "header__link--active" : ""}`
            }
          >
            Chat
          </NavLink>
          <NavLink
            to="/documents"
            className={({ isActive }) =>
              `header__link ${isActive ? "header__link--active" : ""}`
            }
          >
            Documents
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
