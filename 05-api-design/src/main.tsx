// ============================================================
// main.tsx ― アプリケーションのエントリーポイント
//
// 【このファイルで学べること】
// 1. React 19 の createRoot による描画
// 2. StrictMode による開発時のチェック
// 3. BrowserRouter の設置位置
// ============================================================

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// --------------------------------------------------
// アプリケーションの描画
//
// 【BrowserRouter とは？】
// React Router が URL を監視するための Provider コンポーネント。
// アプリ全体を囲むことで、子孫コンポーネントで
// useNavigate, useParams, useSearchParams などが使えるようになる。
// --------------------------------------------------
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
