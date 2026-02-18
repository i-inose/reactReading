// ============================================================
// App.tsx ― アプリケーションのルートコンポーネント
//
// 【このファイルで学べること】
// - React Router によるページルーティング
// - カスタムフック（useChat）の状態をページに渡すパターン
// - BrowserRouter / Routes / Route の使い方
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useChat } from "./hooks/useChat";
import { JoinPage } from "./pages/JoinPage";
import { ChatPage } from "./pages/ChatPage";

// CSS をインポートする
import "./App.css";

// --------------------------------------------------
// App コンポーネント
//
// 【状態のリフトアップ】
// useChat の状態をここで管理し、各ページに Props で渡す。
// これにより JoinPage と ChatPage で同じチャット状態を共有できる。
// --------------------------------------------------
function App() {
  // チャットのロジックとデータを取得する
  const chat = useChat();

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          {/* ルート: 参加ページ */}
          <Route path="/" element={<JoinPage onJoin={chat.join} />} />

          {/* チャットページ */}
          <Route
            path="/chat"
            element={<ChatPage {...chat} />}
          />

          {/* 未定義のパスはルートにリダイレクトする */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
