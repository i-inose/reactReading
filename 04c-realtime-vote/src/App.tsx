// ============================================================
// App.tsx ― アプリケーションのルートコンポーネント
//
// 【このファイルで学べること】
// - React Router によるページルーティング
// - カスタムフック（useVote）の状態をページに渡すパターン
// - BrowserRouter / Routes / Route の使い方
//
// 【04-realtime-chat との対応】
// chat の App.tsx と同じ構成。
// useChat → useVote に変わっただけで、パターンは同一。
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useVote } from "./hooks/useVote";
import { JoinPage } from "./pages/JoinPage";
import { VotePage } from "./pages/VotePage";

// CSS をインポートする
import "./App.css";

// --------------------------------------------------
// App コンポーネント
//
// 【状態のリフトアップ】
// useVote の状態をここで管理し、各ページに Props で渡す。
// これにより JoinPage と VotePage で同じ投票状態を共有できる。
// --------------------------------------------------
function App() {
  // 投票のロジックとデータを取得する
  const voteHook = useVote();

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          {/* ルート: 参加ページ */}
          <Route path="/" element={<JoinPage onJoin={voteHook.join} />} />

          {/* 投票ページ */}
          <Route
            path="/vote"
            element={<VotePage {...voteHook} />}
          />

          {/* 未定義のパスはルートにリダイレクトする */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
