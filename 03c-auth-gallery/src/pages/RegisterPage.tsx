// ============================================================
// RegisterPage.tsx ― ユーザー登録ページ
//
// 【このファイルで学べること】
// - フォーム状態管理（複数の useState）
// - 入力バリデーション（パスワード確認）
// - 登録後の自動ログイン + リダイレクト
// ============================================================

import { useState, type FormEvent } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function RegisterPage() {
  const { authState, register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 既にログイン済みならトップページにリダイレクトする
  if (authState.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // パスワード確認のバリデーション
    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    if (password.length < 4) {
      setError('パスワードは4文字以上で入力してください');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ username, password, displayName });
      navigate('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : '登録に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page page--narrow">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="form__title">ユーザー登録</h2>

        {error && <div className="form__error">{error}</div>}

        <div className="form__field">
          <label htmlFor="username" className="form__label">ユーザー名</label>
          <input
            id="username"
            type="text"
            className="form__input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="myusername"
          />
        </div>

        <div className="form__field">
          <label htmlFor="displayName" className="form__label">表示名</label>
          <input
            id="displayName"
            type="text"
            className="form__input"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            placeholder="山田太郎"
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
            placeholder="4文字以上"
          />
        </div>

        <div className="form__field">
          <label htmlFor="confirmPassword" className="form__label">パスワード（確認）</label>
          <input
            id="confirmPassword"
            type="password"
            className="form__input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="もう一度入力"
          />
        </div>

        <button
          type="submit"
          className="form__submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? '登録中...' : '登録'}
        </button>

        <p className="page__link-text">
          既にアカウントをお持ちの方は
          <Link to="/login" className="page__link"> こちらからログイン</Link>
        </p>
      </form>
    </div>
  );
}
