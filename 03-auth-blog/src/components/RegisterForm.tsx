// ============================================================
// RegisterForm.tsx ― ユーザー登録フォームコンポーネント
//
// 【このファイルで学べること】
// - フォームバリデーション（パスワード一致チェック）
// - クライアントサイドとサーバーサイドのエラー表示の切り分け
// - 複数の入力フィールドの状態管理
// ============================================================

import { useState, type FormEvent } from 'react';
import type { RegisterInput } from '../types';

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface RegisterFormProps {
  onSubmit: (input: RegisterInput) => Promise<void>;
  error: string | null;
}

export function RegisterForm({ onSubmit, error }: RegisterFormProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // クライアントサイドのバリデーションエラー
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // --------------------------------------------------
    // クライアントサイドバリデーション
    // サーバーに送信する前に、フロントエンドでチェックする。
    // UX の向上（即座にエラー表示）とサーバー負荷の軽減が目的。
    // --------------------------------------------------
    if (password !== confirmPassword) {
      setValidationError('パスワードが一致しません');
      return;
    }
    if (password.length < 6) {
      setValidationError('パスワードは6文字以上で入力してください');
      return;
    }
    if (username.length < 2) {
      setValidationError('ユーザー名は2文字以上で入力してください');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ username, email, password, confirmPassword });
    } finally {
      setIsSubmitting(false);
    }
  };

  // バリデーションエラーまたはサーバーエラーを表示する
  const displayError = validationError || error;

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2 className="form__title">ユーザー登録</h2>

      {displayError && <div className="form__error">{displayError}</div>}

      <div className="form__field">
        <label htmlFor="username" className="form__label">ユーザー名</label>
        <input
          id="username"
          type="text"
          className="form__input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          minLength={2}
          maxLength={50}
          placeholder="myname"
        />
      </div>

      <div className="form__field">
        <label htmlFor="reg-email" className="form__label">メールアドレス</label>
        <input
          id="reg-email"
          type="email"
          className="form__input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="mail@example.com"
        />
      </div>

      <div className="form__field">
        <label htmlFor="reg-password" className="form__label">パスワード</label>
        <input
          id="reg-password"
          type="password"
          className="form__input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          placeholder="6文字以上"
        />
      </div>

      <div className="form__field">
        <label htmlFor="confirm-password" className="form__label">パスワード（確認）</label>
        <input
          id="confirm-password"
          type="password"
          className="form__input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="もう一度入力"
        />
      </div>

      <button type="submit" className="form__submit" disabled={isSubmitting}>
        {isSubmitting ? '登録中...' : '登録する'}
      </button>
    </form>
  );
}
