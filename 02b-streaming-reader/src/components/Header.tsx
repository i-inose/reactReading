// ============================================================
// src/components/Header.tsx - ナビゲーションヘッダー
// ============================================================
// 【このファイルで学べること】
// - NavLink によるアクティブリンクのスタイリング
//   02-mastra-rag の Header.tsx と同一パターン
// ============================================================

import { NavLink } from "react-router-dom";

export function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <h1 className="header__title">
          Streaming Reader
          <span className="header__subtitle">AI Reading Notes</span>
        </h1>
        <nav className="header__nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `header__link ${isActive ? "header__link--active" : ""}`
            }
          >
            Reader
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              `header__link ${isActive ? "header__link--active" : ""}`
            }
          >
            History
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
