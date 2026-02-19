// 【このファイルで学べること】
// - useLocation の state からリダイレクト先を取得するパターン
// - ProtectedRoute と連携してログイン後に元のページへ戻す方法

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  // ProtectedRoute から渡された元の URL を取得する
  const from = (location.state as { from?: string })?.from || '/';

  const handleLogin = async (input: { email: string; password: string }) => {
    setError(null);
    try {
      await login(input);
      navigate(from, { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'ログインに失敗しました');
    }
  };

  return (
    <div className="page--narrow">
      <LoginForm onSubmit={handleLogin} error={error} />
      <p className="page__link-text">
        アカウントをお持ちでない方は <Link to="/register" className="page__link">こちらから登録</Link>
      </p>
    </div>
  );
}
