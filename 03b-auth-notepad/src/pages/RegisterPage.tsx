// 【このファイルで学べること】
// - 登録成功後に自動ログインしてリダイレクトするパターン

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { RegisterForm } from '../components/RegisterForm';
import type { RegisterInput } from '../types';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (input: RegisterInput) => {
    setError(null);
    try {
      await register(input);
      navigate('/', { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : '登録に失敗しました');
    }
  };

  return (
    <div className="page--narrow">
      <RegisterForm onSubmit={handleRegister} error={error} />
      <p className="page__link-text">
        既にアカウントをお持ちの方は <Link to="/login" className="page__link">ログイン</Link>
      </p>
    </div>
  );
}
