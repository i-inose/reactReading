// ============================================================
// ArticleForm.tsx ― 記事の作成・編集フォームコンポーネント
//
// 【このファイルで学べること】
// - 作成と編集で共通のフォームを使い回すパターン
// - initialValues による初期値の設定
// - textarea の制御コンポーネント
// ============================================================

import { useState, type FormEvent } from 'react';

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface ArticleFormProps {
  /** 編集時の初期値（新規作成時は undefined） */
  initialValues?: { title: string; body: string };
  /** フォーム送信時のコールバック */
  onSubmit: (data: { title: string; body: string }) => Promise<void>;
  /** 送信ボタンのラベル */
  submitLabel: string;
}

export function ArticleForm({ initialValues, onSubmit, submitLabel }: ArticleFormProps) {
  // 初期値がある場合（編集モード）はそれを使う
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [body, setBody] = useState(initialValues?.body ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // バリデーション
    if (!title.trim()) {
      setError('タイトルを入力してください');
      return;
    }
    if (!body.trim()) {
      setError('本文を入力してください');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), body: body.trim() });
    } catch (e) {
      setError(e instanceof Error ? e.message : '保存に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {error && <div className="form__error">{error}</div>}

      <div className="form__field">
        <label htmlFor="title" className="form__label">タイトル</label>
        <input
          id="title"
          type="text"
          className="form__input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
          placeholder="記事のタイトル"
        />
      </div>

      <div className="form__field">
        <label htmlFor="body" className="form__label">本文</label>
        <textarea
          id="body"
          className="form__textarea"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={12}
          placeholder="記事の内容を書いてください..."
        />
      </div>

      <button type="submit" className="form__submit" disabled={isSubmitting}>
        {isSubmitting ? '保存中...' : submitLabel}
      </button>
    </form>
  );
}
