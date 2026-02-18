// ============================================================
// Layout.tsx ― 共通レイアウトラッパー
//
// 【このファイルで学べること】
// - Outlet による子ルートのレンダリング
// - 共通レイアウト（Header + コンテンツエリア）の実装パターン
// ============================================================

import { Outlet } from 'react-router-dom';
import { Header } from './Header';

/**
 * 全ページ共通のレイアウト
 *
 * 【Outlet とは？】
 * React Router のコンポーネント。ネストされたルートの子コンポーネントを
 * この位置にレンダリングする。App.tsx のルート定義と連動する。
 */
export function Layout() {
  return (
    <div className="layout">
      <Header />
      <main className="layout__main">
        <Outlet />
      </main>
    </div>
  );
}
