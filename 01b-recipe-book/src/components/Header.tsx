// 【このファイルで学べること】
// - React Router の Link でページ遷移する
// - Context から取得した toggleUnit で単位を切り替える

import { Link } from "react-router-dom";
import { useUnit } from "../contexts/UnitContext";

export function Header() {
  const { isMetric, toggleUnit } = useUnit();

  return (
    <header className="header">
      <div className="header__logo">
        <Link to="/" className="header__title">
          レシピブック
        </Link>
      </div>

      <nav className="header__nav">
        <Link to="/" className="header__link">ホーム</Link>
        <Link to="/favorites" className="header__link">お気に入り</Link>
        <Link to="/about" className="header__link">このアプリについて</Link>
      </nav>

      {/* 単位切り替えボタン（ThemeContext のテーマ切替と同じパターン） */}
      <button
        className="header__unit-btn"
        onClick={toggleUnit}
        aria-label={`${isMetric ? "インペリアル" : "メトリック"}に切り替え`}
      >
        {isMetric ? "g/ml" : "oz/cup"}
      </button>
    </header>
  );
}
