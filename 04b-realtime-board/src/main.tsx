// ============================================================
// main.tsx ― アプリケーションのエントリーポイント
// 【このファイルで学べること】 createRoot による React アプリのマウント
// ============================================================

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
