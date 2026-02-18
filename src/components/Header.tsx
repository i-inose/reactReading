// ============================================================
// Header.tsx ― ヘッダー（ナビゲーション）コンポーネント
//
// 【このファイルで学べること】
// - React Router の Link コンポーネント（SPA 内ページ遷移）
// - useContext を使ったグローバル状態の参照
// - イベントハンドラ（onClick）
// - 条件付きクラス名の適用
// ============================================================

// React Router の Link コンポーネントをインポートする
// Link: <a> タグの代わりに使う SPA 用のリンクコンポーネント
// <a> だとページ全体がリロードされるが、Link はリロードせずに画面を切り替える
import { Link } from "react-router-dom";

// テーマ管理のカスタムフックをインポートする
// useTheme の中で useContext(ThemeContext) を呼んでいる
import { useTheme } from "../contexts/ThemeContext";

// --------------------------------------------------
// Header コンポーネント
// Props なしのシンプルなコンポーネント
// --------------------------------------------------
export function Header() {
  // useTheme フックでテーマの状態と操作関数を取得する
  // これは Context API を使っているので、ThemeProvider の子孫ならどこでも使える
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    // className に変数を使ってテーマに応じたクラスを適用する
    // テンプレートリテラル `` を使うと文字列内に変数を埋め込める
    <header className={`header header--${theme}`}>
      {/* ロゴ・タイトル部分 */}
      <div className="header__logo">
        {/* Link コンポーネントで SPA 内遷移する */}
        {/* to="/" でトップページに遷移する */}
        <Link to="/" className="header__title">
          タスク管理アプリ
        </Link>
      </div>

      {/* ナビゲーション */}
      <nav className="header__nav">
        {/* Link は HTML の <a> タグに変換されるが、フルリロードはしない */}
        <Link to="/" className="header__link">
          ホーム
        </Link>
        <Link to="/about" className="header__link">
          このアプリについて
        </Link>
      </nav>

      {/* テーマ切り替えボタン */}
      {/* onClick: クリック時に実行されるイベントハンドラ */}
      <button
        className="header__theme-btn"
        onClick={toggleTheme}  // useCallback でメモ化された関数を直接渡す
        // aria-label: スクリーンリーダー向けのラベル（アクセシビリティ）
        aria-label={`${isDark ? "ライト" : "ダーク"}モードに切り替え`}
      >
        {/* 三項演算子で条件に応じた表示を切り替える */}
        {/* 条件 ? 真の場合 : 偽の場合 */}
        {isDark ? "☀️ ライト" : "🌙 ダーク"}
      </button>
    </header>
  );
}
