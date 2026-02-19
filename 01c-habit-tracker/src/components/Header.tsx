import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

export function Header() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <header className={`header header--${theme}`}>
      <div className="header__logo">
        <Link to="/" className="header__title">
          Habit Tracker
        </Link>
      </div>

      <nav className="header__nav">
        <Link to="/" className="header__link">
          ホーム
        </Link>
        <Link to="/stats" className="header__link">
          統計
        </Link>
      </nav>

      <button
        className="header__theme-btn"
        onClick={toggleTheme}
        aria-label={`${isDark ? "ライト" : "ダーク"}モードに切り替え`}
      >
        {isDark ? "☀ ライト" : "☽ ダーク"}
      </button>
    </header>
  );
}
