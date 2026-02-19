// ============================================================
// ProtectedRoute.tsx ― 認証ガードコンポーネント
//
// 【このファイルで学べること】
// - 認証状態に応じたルートの保護パターン
// - Navigate コンポーネントによるリダイレクト
// - useLocation で現在の URL を取得し、ログイン後に戻す方法
// - 03-auth-blog の ProtectedRoute.tsx と同じパターン
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

// --------------------------------------------------
// TODO(Q5): 認証ガードコンポーネントを実装してください
//
// 【説明】
// 未認証ユーザーがアクセスしたとき、ログインページにリダイレクトする。
// リダイレクト時に現在のパスを state として渡し、
// ログイン後に元のページに戻れるようにする。
//
// 【実装手順】
// 1. useAuth() から authState を取得
// 2. useLocation() で現在の URL 情報を取得
// 3. authState.isAuthenticated が false なら Navigate でリダイレクト
//    - to="/login" で遷移先を指定
//    - state={{ from: location.pathname }} で元のパスを渡す
//    - replace プロパティで履歴を置換
// 4. 認証済みなら children をそのまま返す
//
// 【ヒント】
// - 03-auth-blog の ProtectedRoute.tsx とほぼ同じ構造
// - Navigate は react-router-dom からインポート済み
// - <>{children}</> で children をラップして返す
// --------------------------------------------------

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { authState } = useAuth();
  const location = useLocation();

  // TODO(Q5): 未認証の場合のリダイレクトと、認証済みの場合の children 表示を実装してください
  if (!authState.isAuthenticated) {
    return undefined as any;
  }

  return undefined as any;
}
