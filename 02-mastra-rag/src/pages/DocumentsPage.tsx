// ============================================================
// src/pages/DocumentsPage.tsx - ドキュメント管理ページ
// ============================================================
// 【このファイルで学べること】
// - 状態のリフトアップ（子コンポーネント間の連携）
// - refreshKey パターン（リスト再取得のトリガー）
// - ページコンポーネントの責務（レイアウトと状態の橋渡し）
// ============================================================

import { useState } from "react";
import { DocumentUpload } from "../components/DocumentUpload";
import { DocumentList } from "../components/DocumentList";

// --------------------------------------------------
// 【状態のリフトアップとは？】
// 2つの子コンポーネント（Upload と List）が連携する必要がある場合、
// 共通の親（このページ）に状態を持たせるパターン。
// ここでは refreshKey を使い、Upload 成功時に List を再取得する。
// --------------------------------------------------

export function DocumentsPage() {
  // refreshKey: アップロード成功のたびにインクリメント
  // DocumentList はこの値が変わると一覧を再取得する
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploaded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="documents-page">
      <h2 className="documents-page__title">ドキュメント管理</h2>

      {/* アップロードフォーム */}
      <DocumentUpload onUploaded={handleUploaded} />

      {/* ドキュメント一覧 */}
      <DocumentList refreshKey={refreshKey} />
    </div>
  );
}
