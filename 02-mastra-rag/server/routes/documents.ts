// ============================================================
// server/routes/documents.ts - ドキュメント管理 API
// ============================================================
// 【このファイルで学べること】
// - ドキュメント取り込みパイプライン（テキスト→チャンク→Embedding→ベクトルDB）
// - メタデータによるドキュメント管理
// - Hono のルーティング
// ============================================================

import { Hono } from "hono";
import { vectorStore } from "../mastra/index.js";
import { chunkAndEmbed } from "../lib/chunker.js";

// --------------------------------------------------
// 【インメモリ管理とは？】
// ドキュメントの一覧情報をサーバーのメモリ上に保持する。
// サーバー再起動で消えるが、学習用アプリでは十分な方法。
// 本番では DB にメタデータも保存するのが一般的。
// --------------------------------------------------
interface DocumentMeta {
  id: string;
  title: string;
  chunkCount: number;
  createdAt: string;
}

// ドキュメント一覧（インメモリ）
const documents: DocumentMeta[] = [];

const app = new Hono();

// --------------------------------------------------
// POST /api/documents - ドキュメントのアップロード
// 処理フロー:
//   1. テキストとタイトルを受け取る
//   2. チャンク分割 + Embedding 生成
//   3. ベクトル DB に保存（メタデータ付き）
//   4. ドキュメント一覧に追加
// --------------------------------------------------
app.post("/", async (c) => {
  const { title, text } = await c.req.json<{ title: string; text: string }>();

  // バリデーション
  if (!title || !text) {
    return c.json({ error: "title と text は必須です" }, 400);
  }

  // 一意な ID を生成
  const docId = crypto.randomUUID();

  try {
    // チャンク分割 + Embedding 生成
    const { texts, embeddings } = await chunkAndEmbed(text);

    // ベクトル DB に保存
    // metadata にドキュメント ID とタイトルを含めることで、
    // 後から検索結果がどのドキュメント由来か判別できる
    await vectorStore.upsert({
      indexName: "embeddings",
      vectors: embeddings,
      metadata: texts.map((t) => ({
        text: t,
        documentId: docId,
        documentTitle: title,
      })),
    });

    // インメモリ一覧に追加
    const meta: DocumentMeta = {
      id: docId,
      title,
      chunkCount: texts.length,
      createdAt: new Date().toISOString(),
    };
    documents.push(meta);

    console.log(`[Documents] "${title}" を保存 (${texts.length} チャンク)`);
    return c.json(meta, 201);
  } catch (err) {
    console.error("[Documents] アップロードエラー:", err);
    return c.json({ error: "ドキュメントの処理に失敗しました" }, 500);
  }
});

// --------------------------------------------------
// GET /api/documents - ドキュメント一覧の取得
// --------------------------------------------------
app.get("/", (c) => {
  // 新しい順に返す
  const sorted = [...documents].reverse();
  return c.json(sorted);
});

// --------------------------------------------------
// DELETE /api/documents/:id - ドキュメントの削除
// ベクトル DB からも該当チャンクを削除する
// --------------------------------------------------
app.delete("/:id", async (c) => {
  const docId = c.req.param("id");
  const index = documents.findIndex((d) => d.id === docId);

  if (index === -1) {
    return c.json({ error: "ドキュメントが見つかりません" }, 404);
  }

  try {
    // ベクトル DB からメタデータ条件で削除
    await vectorStore.deleteIndexByFilter({
      indexName: "embeddings",
      filter: { documentId: docId },
    });

    // インメモリ一覧から削除
    documents.splice(index, 1);

    console.log(`[Documents] ドキュメント ${docId} を削除しました`);
    return c.json({ success: true });
  } catch (err) {
    console.error("[Documents] 削除エラー:", err);
    return c.json({ error: "削除に失敗しました" }, 500);
  }
});

export default app;
