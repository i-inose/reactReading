// ============================================================
// App.tsx ― アプリケーションのルートコンポーネント
//
// 【このファイルで学べること】
// - React Router によるページルーティング（チャットの App.tsx と同じ）
// - カスタムフック（useBoard）の状態をページに渡すパターン
// - BrowserRouter / Routes / Route の使い方
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useBoard } from "./hooks/useBoard.ts";
import { JoinPage } from "./pages/JoinPage.tsx";
import { BoardPage } from "./pages/BoardPage.tsx";

import "./App.css";

// 【状態のリフトアップ】
// useBoard の状態をここで管理し、各ページに Props で渡す。
// チャットアプリで useChat を App に置いたのと同じパターン。
function App() {
  const board = useBoard();

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<JoinPage onJoin={board.join} />} />
          <Route path="/board" element={<BoardPage {...board} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
