// ============================================================
// RegisterPage.tsx ― ユーザー登録ページ
//
// 【このファイルで学べること】
// - RegisterForm コンポーネントの利用
// - 登録後の自動ログイン + リダイレクト
// - ログイン済みユーザーの自動リダイレクト
// ============================================================

import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RegisterForm } from '../components/RegisterForm';
import type { RegisterInput } from '../types';

export function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // 既にログイン済みならトップページにリダイレクトする
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (input: RegisterInput) => {
    setError(null);
    try {
      await register(input);
      // 登録成功後（自動ログイン済み）、トップページに遷移する
      navigate('/');
    } catch (e) {
      setError(e instanceof Error ? e.message : '登録に失敗しました');
    }
  };

  return (
    <div className="page page--narrow">
      <RegisterForm onSubmit={handleSubmit} error={error} />
      <p className="page__link-text">
        既にアカウントをお持ちの方は
        <Link to="/login" className="page__link"> こちらからログイン</Link>
      </p>
    </div>
  );
}
