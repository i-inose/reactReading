// ============================================================
// server/lib/chunker.ts - ドキュメント分割 & Embedding 生成
// ============================================================
// 【このファイルで学べること】
// - MDocument.fromText() によるドキュメント作成
// - チャンク分割（recursive 戦略）の仕組み
// - embedMany() によるバッチ Embedding 生成
// - なぜ maxSize=512, overlap=50 が一般的なのか
// ============================================================

import { MDocument } from "@mastra/rag";
import { embedMany } from "ai";
import { ModelRouterEmbeddingModel } from "@mastra/core/llm";

// --------------------------------------------------
// Embedding モデルの初期化
// text-embedding-3-small: OpenAI の軽量 Embedding モデル（1536 次元）
// コスト効率が良く、多くの RAG アプリで使われている
// --------------------------------------------------
const embeddingModel = new ModelRouterEmbeddingModel(
  "openai/text-embedding-3-small"
);

// --------------------------------------------------
// 【チャンクとは？】
// 長いドキュメントを小さな断片（チャンク）に分割したもの。
// LLM のコンテキストウィンドウに収まるサイズにする必要がある。
// --------------------------------------------------

// チャンク分割結果の型
export interface ChunkResult {
  texts: string[];
  embeddings: number[][];
}

// --------------------------------------------------
// ドキュメントをチャンクに分割し、Embedding を生成する
//
// 処理フロー:
//   テキスト → MDocument → チャンク分割 → Embedding 生成
//
// パラメータの意味:
// - strategy: "recursive" = 段落 → 文 → 単語の順に再帰的に分割
// - maxSize: 512 = 1チャンクの最大トークン数（大きすぎると検索精度が落ちる）
// - overlap: 50 = チャンク間の重複トークン数（文脈の途切れを防ぐ）
// --------------------------------------------------
export async function chunkAndEmbed(text: string): Promise<ChunkResult> {
  // 1. テキストから MDocument を作成
  const doc = MDocument.fromText(text);

  // 2. recursive 戦略でチャンク分割
  const chunks = await doc.chunk({
    strategy: "recursive",
    size: 512,
    overlap: 50,
  });

  // チャンクからテキストを抽出
  const texts = chunks.map((c) => c.text);

  // 3. 全チャンクを一括で Embedding に変換
  // embedMany は複数テキストをバッチ処理するため効率が良い
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: texts,
  });

  return { texts, embeddings };
}
