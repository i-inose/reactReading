// ============================================================
// Layout.tsx ― アプリ全体のレイアウトコンポーネント
//
// 【レイアウトコンポーネントとは？】
// ヘッダー・フッター・サイドバーなど「全ページ共通の構造」を定義する。
// children Props を使って、ページごとに変わる部分だけ差し替える。
// ============================================================

// React の Fragment をインポートする
// Fragment: 余分な DOM 要素を追加せずに複数要素をまとめるコンポーネント
import { Fragment } from "react";

// 型だけのインポートには type キーワードを使う（バンドルサイズ最適化）
import type { ReactNode } from "react";

// 同じプロジェクトのコンポーネントをインポートする
import { Header } from "./Header";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface LayoutProps {
  children: ReactNode;  // ReactNode: JSX, 文字列, 数値, null など描画可能なもの全て
}

// --------------------------------------------------
// Layout コンポーネント
// 関数コンポーネントの基本形: Props を受け取り JSX を返す
// --------------------------------------------------
export function Layout({ children }: LayoutProps) {
  // 分割代入（Destructuring）で Props から children を取り出す
  // { children } は { children: children } の省略形

  return (
    // Fragment (<> </> でも書ける) は余分な div を作らずにまとめる
    // <Fragment> と <> は同じ。key が必要な場合は <Fragment key={...}> を使う
    <Fragment>
      {/* ヘッダーコンポーネントを配置する */}
      <Header />

      {/* メインコンテンツ領域 */}
      {/* children にはこのコンポーネントの子要素が入る */}
      <main className="main-content">
        {children}
      </main>

      {/* フッター */}
      <footer className="footer">
        {/* JSX 内で JavaScript 式を使うには {} で囲む */}
        <p>React + TypeScript 学習アプリ &copy; {new Date().getFullYear()}</p>
      </footer>
    </Fragment>
  );
}
