// 【このファイルで学べること】
// - React Router v7 の Outlet で子ルートを描画する
// - レイアウトコンポーネントで共通 UI を定義する

import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function Layout() {
  return (
    <>
      <Header />
      <main className="main-content">
        {/* Outlet: React Router が現在の URL に対応する子ルートをここに描画する */}
        <Outlet />
      </main>
      <footer className="footer">
        <p>React + TypeScript 学習アプリ (2nd Reading) &copy; {new Date().getFullYear()}</p>
      </footer>
    </>
  );
}
