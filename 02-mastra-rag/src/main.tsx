// ============================================================
// src/main.tsx - アプリケーションのエントリーポイント
// ============================================================
// 【このファイルで学べること】
// - React 19 の createRoot API
// - StrictMode の役割（開発時の二重レンダリング検知）
// - CSS のインポート順序
// ============================================================

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./App.css";

// --------------------------------------------------
// 【createRoot とは？】
// React 18 以降の新しいレンダリング API。
// Concurrent Features（並行レンダリング）を有効にする。
// document.getElementById("root")! の "!" は TypeScript の
// Non-null Assertion（null でないことをコンパイラに伝える）。
// --------------------------------------------------
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
