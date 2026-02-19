// 【このファイルで学べること】
// - 認証ガードパターン（03-auth-blog と同じ）
// - Navigate によるリダイレクト
// - useLocation で現在の URL を保持し、ログイン後に戻す方法

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 認証状態の復元中はローディング表示
  if (isLoading) {
    return <div className="loading">認証状態を確認中...</div>;
  }

  // 未認証 → ログインページへリダイレクト（元の URL を state に保持）
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
