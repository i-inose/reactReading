// 【このファイルで学べること】
// - 作成/編集の両方に使える共通フォームパターン
// - 初期値を Props で受け取り、状態を初期化する方法

import { useState, type FormEvent } from 'react';

interface NoteFormProps {
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string;
  onSubmit: (data: { title: string; content: string; tags: string }) => Promise<void>;
  submitLabel: string;
  error: string | null;
}

export function NoteForm({
  initialTitle = '',
  initialContent = '',
  initialTags = '',
  onSubmit,
  submitLabel,
  error,
}: NoteFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState(initialTags);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (title.trim().length < 1) {
      setValidationError('タイトルを入力してください');
      return;
    }
    if (content.trim().length < 1) {
      setValidationError('本文を入力してください');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), content: content.trim(), tags });
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = validationError || error;

  return (
    <form onSubmit={handleSubmit} className="form">
      {displayError && <div className="form__error">{displayError}</div>}

      <div className="form__field">
        <label htmlFor="note-title" className="form__label">タイトル</label>
        <input
          id="note-title"
          type="text"
          className="form__input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="メモのタイトル"
        />
      </div>

      <div className="form__field">
        <label htmlFor="note-content" className="form__label">本文</label>
        <textarea
          id="note-content"
          className="form__textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder="メモの内容を入力..."
        />
      </div>

      <div className="form__field">
        <label htmlFor="note-tags" className="form__label">タグ（カンマ区切り）</label>
        <input
          id="note-tags"
          type="text"
          className="form__input"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="React, TypeScript, メモ"
        />
      </div>

      <button type="submit" className="form__submit" disabled={isSubmitting}>
        {isSubmitting ? '保存中...' : submitLabel}
      </button>
    </form>
  );
}
