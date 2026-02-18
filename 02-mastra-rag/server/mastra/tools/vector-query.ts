// ============================================================
// server/mastra/tools/vector-query.ts - ベクトル検索ツール
// ============================================================
// 【このファイルで学べること】
// - createVectorQueryTool によるベクトル検索ツールの作成
// - ベクトル類似度検索の仕組み
// - Embedding モデルの指定方法
// ============================================================

import { createVectorQueryTool } from "@mastra/rag";
import { ModelRouterEmbeddingModel } from "@mastra/core/llm";
import { vectorStore } from "../index.js";

// --------------------------------------------------
// 【ベクトル検索ツールとは？】
// AI エージェントが「質問に関連するドキュメントを探す」ために使うツール。
// 質問文を Embedding に変換し、保存済みベクトルと類似度を比較して
// 関連性の高いチャンクを返す。
// --------------------------------------------------

// --------------------------------------------------
// 【ModelRouterEmbeddingModel とは？】
// Mastra が提供するモデルルーター。"openai/text-embedding-3-small" のように
// "プロバイダ/モデル名" の形式で指定すると、適切な SDK を自動選択する。
// Anthropic には Embedding モデルがないため、OpenAI を使用する。
// --------------------------------------------------
const embeddingModel = new ModelRouterEmbeddingModel(
  "openai/text-embedding-3-small"
);

// --------------------------------------------------
// ベクトル検索ツールの作成
// - vectorStoreName: Mastra 内部でベクトルストアを識別する名前
// - indexName: ベクトルインデックスの名前（upsert 時と一致させる）
// - model: 質問文を Embedding に変換するモデル
// --------------------------------------------------
export const vectorQueryTool = createVectorQueryTool({
  vectorStoreName: "libsqlVector",
  vectorStore,
  indexName: "embeddings",
  model: embeddingModel,
});
