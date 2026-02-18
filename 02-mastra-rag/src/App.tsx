// ============================================================
// src/App.tsx - ルーター設定（アプリのルート）
// ============================================================
// 【このファイルで学べること】
// - React Router の BrowserRouter によるルーティング
// - Routes / Route による URL とコンポーネントの対応付け
// - 共通レイアウト（Header）の配置
// ============================================================

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { ChatPage } from "./pages/ChatPage";
import { DocumentsPage } from "./pages/DocumentsPage";

// --------------------------------------------------
// 【BrowserRouter とは？】
// HTML5 History API を使ったクライアントサイドルーティング。
// URL が変わってもサーバーにリクエストせず、
// React 内でページを切り替える（SPA の基本動作）。
// --------------------------------------------------

export default function App() {
  return (
    <BrowserRouter>
      {/* Header は全ページ共通で表示 */}
      <Header />
      <main className="main">
        <Routes>
          {/* "/" → チャットページ */}
          <Route path="/" element={<ChatPage />} />
          {/* "/documents" → ドキュメント管理ページ */}
          <Route path="/documents" element={<DocumentsPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
