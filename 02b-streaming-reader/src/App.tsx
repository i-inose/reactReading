// ============================================================
// src/App.tsx - ルーター設定（アプリのルート）
// ============================================================
// 【このファイルで学べること】
// - React Router の BrowserRouter + Routes + Route
// - Layout コンポーネントで Outlet を使う入れ子ルーティング
//   02-mastra-rag では Header を直置きしていたが、
//   ここでは Layout パターンで Outlet を使う別の書き方を紹介
// ============================================================

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ReaderPage } from "./pages/ReaderPage";
import { HistoryPage } from "./pages/HistoryPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout が Header + Outlet を描画 */}
        <Route element={<Layout />}>
          <Route path="/" element={<ReaderPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
