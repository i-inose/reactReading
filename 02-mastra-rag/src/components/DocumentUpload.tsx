// ============================================================
// src/components/DocumentUpload.tsx - ドキュメントアップロード
// ============================================================
// 【このファイルで学べること】
// - textarea による複数行テキスト入力
// - ローディング状態の管理
// - エラーハンドリングと表示
// - 非同期フォーム送信
// ============================================================

import { useState, type FormEvent } from "react";
import { uploadDocument } from "../api";

interface DocumentUploadProps {
  onUploaded: () => void; // アップロード成功後のコールバック
}

export function DocumentUpload({ onUploaded }: DocumentUploadProps) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !text.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // API 呼び出し（チャンク分割 + Embedding 生成 + 保存）
      await uploadDocument(title.trim(), text.trim());

      // 成功: フォームをリセット
      setTitle("");
      setText("");
      onUploaded(); // 親コンポーネントに通知（一覧を再取得）
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "アップロードに失敗しました";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="doc-upload" onSubmit={handleSubmit}>
      <h2 className="doc-upload__heading">ドキュメントを追加</h2>

      {/* エラー表示 */}
      {error && <div className="doc-upload__error">{error}</div>}

      {/* タイトル入力 */}
      <input
        type="text"
        className="doc-upload__title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="ドキュメントのタイトル"
        disabled={isLoading}
      />

      {/* テキスト入力（複数行） */}
      <textarea
        className="doc-upload__text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="ドキュメントの内容をここに貼り付けてください..."
        rows={10}
        disabled={isLoading}
      />

      <button
        type="submit"
        className="doc-upload__button"
        disabled={isLoading || !title.trim() || !text.trim()}
      >
        {isLoading ? "処理中...（Embedding 生成に時間がかかります）" : "アップロード"}
      </button>
    </form>
  );
}
