// ============================================================
// server/routes/chat.ts - チャット API（ストリーミング SSE）
// ============================================================
// 【このファイルで学べること】
// - agent.stream() によるリアルタイムテキスト生成
// - Server-Sent Events (SSE) によるストリーミングレスポンス
// - ReadableStream と TextEncoder を使った SSE フォーマット
// - maxSteps の意味と使い方
// ============================================================

import { Hono } from "hono";
import { ragAgent } from "../mastra/agents/rag-agent.js";

const app = new Hono();

// --------------------------------------------------
// POST /api/chat - 質問に対するストリーミング回答
//
// 【SSE (Server-Sent Events) とは？】
// サーバーからクライアントへ一方向にデータを送り続ける仕組み。
// チャットの「文字が少しずつ表示される」効果を実現する。
// フォーマット: "data: テキスト\n\n" の繰り返し
// --------------------------------------------------
app.post("/", async (c) => {
  const { message } = await c.req.json<{ message: string }>();

  if (!message) {
    return c.json({ error: "message は必須です" }, 400);
  }

  try {
    // --------------------------------------------------
    // agent.stream() でストリーミング生成を開始
    // maxSteps: エージェントがツールを呼び出す最大回数
    // 質問 → ベクトル検索ツール → 回答生成 で通常 2-3 ステップ
    // --------------------------------------------------
    const result = await ragAgent.stream(message, {
      maxSteps: 10,
    });

    // --------------------------------------------------
    // ReadableStream を使って SSE フォーマットに変換
    // TextEncoder: 文字列を UTF-8 バイト列に変換する
    // --------------------------------------------------
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // textStream は AsyncIterable<string>
          // チャンク（文字列の断片）が到着するたびにループが回る
          for await (const chunk of result.textStream) {
            // SSE フォーマット: "data: " + JSON + "\n\n"
            const data = JSON.stringify({ type: "text", content: chunk });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }

          // 完了シグナルを送信
          const done = JSON.stringify({ type: "done" });
          controller.enqueue(encoder.encode(`data: ${done}\n\n`));
        } catch (err) {
          // エラーが発生した場合もクライアントに通知
          const error = JSON.stringify({
            type: "error",
            content: "回答の生成中にエラーが発生しました",
          });
          controller.enqueue(encoder.encode(`data: ${error}\n\n`));
        } finally {
          controller.close();
        }
      },
    });

    // --------------------------------------------------
    // SSE レスポンスヘッダー
    // - text/event-stream: SSE のコンテンツタイプ
    // - no-cache: キャッシュを無効化
    // - keep-alive: 接続を維持
    // --------------------------------------------------
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("[Chat] ストリーミングエラー:", err);
    return c.json({ error: "チャットの処理に失敗しました" }, 500);
  }
});

export default app;
