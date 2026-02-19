// ============================================================
// LoginPage.tsx ― ログインページ
//
// 【このファイルで学べること】
// - useLocation の state を使ったリダイレクト先の制御
// - ログイン後に「元いたページ」に戻す方法
// - 認証済みユーザーの自動リダイレクト
// ============================================================

import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  const { authState, login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // ProtectedRoute からリダイレクトされた場合、
  // state.from に「元いたページの URL」が入っている。
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/';

  // 既にログイン済みならトップページにリダイレクトする
  if (authState.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (username: string, password: string) => {
    setError(null);
    try {
      await login({ username, password });
      // ログイン成功後、元いたページに遷移する
      navigate(from, { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'ログインに失敗しました');
    }
  };

  return (
    <div className="page page--narrow">
      <LoginForm onSubmit={handleSubmit} error={error} />
    </div>
  );
}
