// ============================================================
// server/mastra/index.ts - Mastra インスタンス設定
// ============================================================
// 【このファイルで学べること】
// - LibSQLVector によるベクトルストアの初期化
// - ファイルベース DB（外部 DB 不要）の利便性
// - ベクトルインデックスの作成
// ============================================================

import { LibSQLVector } from "@mastra/libsql";

// --------------------------------------------------
// 【LibSQLVector とは？】
// SQLite 互換のベクトルデータベース。"file:local.db" を指定すると
// プロジェクトルートに local.db ファイルが自動生成される。
// 外部のデータベースサーバーが不要なので、開発・学習に最適。
// --------------------------------------------------
export const vectorStore = new LibSQLVector({
  url: "file:local.db",
});

// --------------------------------------------------
// ベクトルインデックスの初期化
// - dimension: 1536 は text-embedding-3-small の出力次元数
// - インデックスが既に存在する場合はスキップされる
// --------------------------------------------------
export async function initializeVectorStore(): Promise<void> {
  await vectorStore.createIndex({
    indexName: "embeddings",
    dimension: 1536,
  });
  console.log("[Mastra] ベクトルインデックス 'embeddings' を初期化しました");
}
