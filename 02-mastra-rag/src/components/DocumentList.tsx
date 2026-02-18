// ============================================================
// src/components/DocumentList.tsx - ドキュメント一覧
// ============================================================
// 【このファイルで学べること】
// - useEffect + useState による非同期データ取得
// - リストの key 属性の重要性
// - 削除操作の確認ダイアログ
// - 条件付きレンダリング（空状態 vs データ有り）
// ============================================================

import { useEffect, useState } from "react";
import type { Document } from "../types";
import { fetchDocuments, deleteDocument } from "../api";

interface DocumentListProps {
  refreshKey: number; // 変更があるたびにインクリメントされる値
}

export function DocumentList({ refreshKey }: DocumentListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --------------------------------------------------
  // ドキュメント一覧の取得
  // refreshKey が変わるたびに再取得される
  // --------------------------------------------------
  useEffect(() => {
    setIsLoading(true);
    fetchDocuments()
      .then(setDocuments)
      .catch((err) => console.error("一覧取得エラー:", err))
      .finally(() => setIsLoading(false));
  }, [refreshKey]);

  // --------------------------------------------------
  // ドキュメント削除ハンドラ
  // 確認ダイアログで誤削除を防止
  // --------------------------------------------------
  const handleDelete = async (doc: Document) => {
    const confirmed = window.confirm(
      `「${doc.title}」を削除しますか？\nベクトル DB からもチャンクが削除されます。`
    );
    if (!confirmed) return;

    try {
      await deleteDocument(doc.id);
      // ローカル状態からも即座に削除（UX のため）
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
    } catch (err) {
      console.error("削除エラー:", err);
      alert("削除に失敗しました");
    }
  };

  // 日付を読みやすい形式に変換
  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString("ja-JP", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return <p className="doc-list__loading">読み込み中...</p>;
  }

  if (documents.length === 0) {
    return (
      <div className="doc-list__empty">
        <p>まだドキュメントがありません。</p>
        <p>上のフォームからドキュメントを追加してください。</p>
      </div>
    );
  }

  return (
    <div className="doc-list">
      <h2 className="doc-list__heading">
        アップロード済み ({documents.length}件)
      </h2>
      <ul className="doc-list__items">
        {documents.map((doc) => (
          <li key={doc.id} className="doc-list__item">
            <div className="doc-list__info">
              <span className="doc-list__title">{doc.title}</span>
              <span className="doc-list__meta">
                {doc.chunkCount} チャンク | {formatDate(doc.createdAt)}
              </span>
            </div>
            <button
              className="doc-list__delete"
              onClick={() => handleDelete(doc)}
              title="削除"
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
