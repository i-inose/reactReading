// ============================================================
// src/components/Layout.tsx - 共通レイアウト
// ============================================================
// 【このファイルで学べること】
// - Outlet による子ルートのレンダリング
// - レイアウトコンポーネントパターン（Header + コンテンツ領域）
// ============================================================

import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function Layout() {
  return (
    <>
      <Header />
      <main className="main">
        <Outlet />
      </main>
    </>
  );
}
