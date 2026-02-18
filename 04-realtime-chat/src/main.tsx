// ============================================================
// main.tsx ― アプリケーションのエントリーポイント
//
// 【エントリーポイントとは？】
// アプリケーションの実行が開始される最初のファイル。
// index.html の <div id="root"></div> に React アプリをマウントする。
// ============================================================

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// グローバルスタイルをインポートする
import "./index.css";

// ルートコンポーネントをインポートする
import App from "./App";

// --------------------------------------------------
// React アプリのマウント
//
// document.getElementById("root")! の末尾の ! は
// 非 null アサーション演算子。この要素が必ず存在することを保証する。
// --------------------------------------------------
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
