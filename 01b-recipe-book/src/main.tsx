// 【このファイルで学べること】
// - アプリのエントリーポイント（index.html の #root にマウントする）

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
