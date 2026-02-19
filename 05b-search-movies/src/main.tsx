// ============================================================
// main.tsx ― エントリーポイント
//
// 【このファイルで学べること】
// - createRoot による React 19 の描画
// - BrowserRouter の設置位置（アプリ全体を囲む）
// ============================================================

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
