// ============================================================
// LoginForm.tsx ― ログインフォームコンポーネント
//
// 【このファイルで学べること】
// - フォームの状態管理（useState）
// - onSubmit イベントハンドラと preventDefault
// - バリデーションエラーの表示
// - 非同期処理中の UI フィードバック（ボタンの無効化）
// ============================================================

import { useState, type FormEvent } from 'react';
import type { LoginInput } from '../types';

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface LoginFormProps {
  onSubmit: (input: LoginInput) => Promise<void>;
  error: string | null;
}

export function LoginForm({ onSubmit, error }: LoginFormProps) {
  // フォーム入力の状態
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // フォーム送信ハンドラ
  const handleSubmit = async (e: FormEvent) => {
    // 【preventDefault とは？】
    // フォームのデフォルト動作（ページ遷移）を防止する。
    // SPA ではページ全体のリロードを避けるために必須。
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({ email, password });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2 className="form__title">ログイン</h2>

      {/* エラーメッセージの表示 */}
      {error && <div className="form__error">{error}</div>}

      <div className="form__field">
        <label htmlFor="email" className="form__label">メールアドレス</label>
        <input
          id="email"
          type="email"
          className="form__input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="user1@example.com"
        />
      </div>

      <div className="form__field">
        <label htmlFor="password" className="form__label">パスワード</label>
        <input
          id="password"
          type="password"
          className="form__input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="password123"
        />
      </div>

      <button
        type="submit"
        className="form__submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'ログイン中...' : 'ログイン'}
      </button>
    </form>
  );
}
