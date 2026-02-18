// ============================================================
// AuthContext.tsx ― 認証状態を管理するコンテキスト
//
// 【このファイルで学べること】
// - React Context API による状態の共有
// - createContext + Provider パターン
// - localStorage からの認証状態の復元
// - ログイン/ログアウト/登録のロジック
// ============================================================

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { User, LoginInput, RegisterInput, AuthContextType } from '../types';
import { getStoredAuth, setStoredAuth, clearStoredAuth } from '../api';

// --------------------------------------------------
// コンテキストの作成
//
// 【createContext とは？】
// コンポーネントツリー全体で値を共有するための仕組み。
// Props のバケツリレー（prop drilling）を避けられる。
// null を初期値にし、Provider でラップして実際の値を渡す。
// --------------------------------------------------
export const AuthContext = createContext<AuthContextType | null>(null);

// --------------------------------------------------
// AuthProvider コンポーネント
// --------------------------------------------------
export function AuthProvider({ children }: { children: ReactNode }) {
  // ユーザー情報（null = 未ログイン）
  const [user, setUser] = useState<User | null>(null);

  // 認証状態の復元中フラグ（初回ロード時に true）
  const [isLoading, setIsLoading] = useState(true);

  // --------------------------------------------------
  // アプリ起動時に localStorage から認証状態を復元する
  //
  // 【なぜ復元が必要？】
  // ページをリロードすると React の状態は消える。
  // localStorage にトークンを保存しておけば、
  // リロード後も自動でログイン状態を復元できる。
  // --------------------------------------------------
  useEffect(() => {
    const stored = getStoredAuth();
    if (stored?.user && stored?.access_token) {
      setUser(stored.user);
    }
    setIsLoading(false);
  }, []);

  // --------------------------------------------------
  // ログイン処理
  // --------------------------------------------------
  const login = useCallback(async (input: LoginInput) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || 'ログインに失敗しました');
    }

    const data = await res.json();

    // トークンとユーザー情報を保存する
    setStoredAuth({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user: data.user,
    });
    setUser(data.user);
  }, []);

  // --------------------------------------------------
  // ユーザー登録処理
  // --------------------------------------------------
  const register = useCallback(async (input: RegisterInput) => {
    // confirmPassword はフロントエンドのバリデーション用なので API には送らない
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: input.username,
        email: input.email,
        password: input.password,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || '登録に失敗しました');
    }

    const data = await res.json();

    // 登録成功後、自動でログイン状態にする
    setStoredAuth({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user: data.user,
    });
    setUser(data.user);
  }, []);

  // --------------------------------------------------
  // ログアウト処理
  // --------------------------------------------------
  const logout = useCallback(() => {
    clearStoredAuth();
    setUser(null);
  }, []);

  // --------------------------------------------------
  // Provider で子コンポーネントに値を渡す
  // --------------------------------------------------
  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
