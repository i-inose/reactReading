// ============================================================
// src/main.tsx - アプリケーションのエントリーポイント
// ============================================================
// 【このファイルで学べること】
// - React 19 の createRoot API（02-mastra-rag と同一）
// - StrictMode による開発時の二重レンダリング検知
// ============================================================

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./App.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
