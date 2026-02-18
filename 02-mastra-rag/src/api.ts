// ============================================================
// src/api.ts - API クライアント関数
// ============================================================
// 【このファイルで学べること】
// - fetch API によるバックエンドとの通信
// - RESTful API のパターン（GET, POST, DELETE）
// - 型安全なレスポンス処理
// ============================================================

import type { Document } from "./types";

// --------------------------------------------------
// API のベース URL
// Vite のプロキシ設定により、/api は自動的に
// バックエンド（localhost:3001）に転送される
// --------------------------------------------------
const API_BASE = "/api";

// --------------------------------------------------
// ドキュメント一覧を取得
// GET /api/documents
// --------------------------------------------------
export async function fetchDocuments(): Promise<Document[]> {
  const res = await fetch(`${API_BASE}/documents`);
  if (!res.ok) throw new Error("ドキュメント一覧の取得に失敗しました");
  return res.json();
}

// --------------------------------------------------
// ドキュメントをアップロード
// POST /api/documents
// リクエストボディ: { title, text }
// --------------------------------------------------
export async function uploadDocument(
  title: string,
  text: string
): Promise<Document> {
  const res = await fetch(`${API_BASE}/documents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, text }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      (data as { error?: string }).error ||
        "ドキュメントのアップロードに失敗しました"
    );
  }
  return res.json();
}

// --------------------------------------------------
// ドキュメントを削除
// DELETE /api/documents/:id
// --------------------------------------------------
export async function deleteDocument(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/documents/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("ドキュメントの削除に失敗しました");
}

// --------------------------------------------------
// チャットメッセージを送信（SSE ストリーミング）
// POST /api/chat
// レスポンスは SSE 形式で返されるため、Response オブジェクトをそのまま返す
// --------------------------------------------------
export async function sendChatMessage(message: string): Promise<Response> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error("チャットの送信に失敗しました");
  return res;
}
