// ============================================================
// LoginPage.tsx ― ログインページ
//
// 【このファイルで学べること】
// - useLocation の state を使ったリダイレクト先の制御
// - ログイン後に「元いたページ」に戻す方法
// - 認証済みユーザーの自動リダイレクト
// ============================================================

import { useState } from 'react';
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/LoginForm';
import type { LoginInput } from '../types';

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // 【useLocation の state】
  // ProtectedRoute からリダイレクトされた場合、
  // state.from に「元いたページの URL」が入っている。
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/';

  // 既にログイン済みならトップページにリダイレクトする
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (input: LoginInput) => {
    setError(null);
    try {
      await login(input);
      // ログイン成功後、元いたページに遷移する
      navigate(from, { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'ログインに失敗しました');
    }
  };

  return (
    <div className="page page--narrow">
      <LoginForm onSubmit={handleSubmit} error={error} />
      <p className="page__link-text">
        アカウントをお持ちでない方は
        <Link to="/register" className="page__link"> こちらから登録</Link>
      </p>
    </div>
  );
}
