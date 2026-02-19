// 【このファイルで学べること】
// - Outlet による子ルートのレンダリング
// - 共通レイアウト（Header + コンテンツ）パターン

import { Outlet } from 'react-router-dom';
import { Header } from './Header';

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
