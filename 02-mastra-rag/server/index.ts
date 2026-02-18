// ============================================================
// server/index.ts - Hono HTTP サーバー（エントリーポイント）
// ============================================================
// 【このファイルで学べること】
// - Hono フレームワークの基本構成
// - CORS ミドルウェアの設定
// - ルートのマウント（モジュール分割）
// - @hono/node-server による Node.js サーバー起動
// ============================================================

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { initializeVectorStore } from "./mastra/index.js";
import documentRoutes from "./routes/documents.js";
import chatRoutes from "./routes/chat.js";

// --------------------------------------------------
// 【Hono とは？】
// 軽量・高速な Web フレームワーク。Express に似た API を持ちつつ、
// Edge Runtime（Cloudflare Workers 等）でも動作する。
// TypeScript ファーストで型安全なルーティングが特徴。
// --------------------------------------------------
const app = new Hono();

// --------------------------------------------------
// 【CORS ミドルウェアとは？】
// Cross-Origin Resource Sharing: 異なるオリジン（ドメイン:ポート）間の
// リクエストを許可する仕組み。開発時はフロントエンド（5173）と
// バックエンド（3001）が異なるポートなので必要。
// --------------------------------------------------
app.use(
  "/api/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "DELETE"],
    allowHeaders: ["Content-Type"],
  })
);

// --------------------------------------------------
// ルートのマウント
// /api/documents → ドキュメント管理 API
// /api/chat      → チャット API（ストリーミング）
// --------------------------------------------------
app.route("/api/documents", documentRoutes);
app.route("/api/chat", chatRoutes);

// --------------------------------------------------
// ヘルスチェック用エンドポイント
// --------------------------------------------------
app.get("/api/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// --------------------------------------------------
// サーバー起動
// 1. まずベクトルストアのインデックスを初期化
// 2. その後 HTTP サーバーを開始
// --------------------------------------------------
const PORT = 3001;

async function main() {
  // ベクトルストアの初期化（インデックス作成）
  await initializeVectorStore();

  // Hono アプリを Node.js HTTP サーバーとして起動
  serve({ fetch: app.fetch, port: PORT }, () => {
    console.log(`[Server] http://localhost:${PORT} で起動しました`);
    console.log(`[Server] API: http://localhost:${PORT}/api`);
  });
}

main().catch((err) => {
  console.error("[Server] 起動エラー:", err);
  process.exit(1);
});
