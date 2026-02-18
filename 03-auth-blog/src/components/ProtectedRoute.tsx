// ============================================================
// ProtectedRoute.tsx ― 認証ガードコンポーネント
//
// 【このファイルで学べること】
// - 認証状態に応じたルートの保護パターン
// - Navigate コンポーネントによるリダイレクト
// - useLocation で現在の URL を取得し、ログイン後に戻す方法
// ============================================================

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { ReactNode } from 'react';

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface ProtectedRouteProps {
  children: ReactNode;  // 保護対象のコンポーネント
}

/**
 * 認証が必要なルートを保護するコンポーネント
 *
 * 【ProtectedRoute パターンとは？】
 * 未認証ユーザーがアクセスしたとき、自動的にログインページへ
 * リダイレクトする。ログイン後は元のページに戻す。
 *
 * 使い方: <ProtectedRoute><WritePage /></ProtectedRoute>
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // 【useLocation とは？】
  // 現在の URL 情報（pathname, search, state など）を取得するフック。
  // ここでは「元のページの URL」をログインページに渡すために使う。
  const location = useLocation();

  // 認証状態の復元中はローディングを表示する
  if (isLoading) {
    return <div className="loading">認証状態を確認中...</div>;
  }

  // 未認証の場合はログインページにリダイレクトする
  // state に現在の pathname を渡し、ログイン後に戻れるようにする
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 認証済みの場合は子コンポーネントをそのまま表示する
  return <>{children}</>;
}
