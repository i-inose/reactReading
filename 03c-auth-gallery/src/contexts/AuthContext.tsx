// ============================================================
// AuthContext.tsx ― 認証状態を管理するコンテキスト
//
// 【このファイルで学べること】
// - React Context API による状態の共有
// - createContext + Provider パターン
// - localStorage からの認証状態の復元
// - ログイン/ログアウト/登録のロジック（バックエンドなし版）
// ============================================================

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { AuthState, LoginInput, RegisterInput, AuthContextType, User } from '../types';
import { STORAGE_KEYS } from '../api';

// --------------------------------------------------
// TODO(Q2): AuthContext の作成と AuthProvider コンポーネントを実装してください
//
// 【説明】
// 1. createContext で AuthContextType | null 型のコンテキストを作成
// 2. AuthProvider コンポーネント内で:
//    - useState で authState を管理（初期値: user=null, token=null, isAuthenticated=false）
//    - useEffect でアプリ起動時に localStorage から認証状態を復元
//    - login, register, logout 関数を実装
//    - Provider で children をラップして値を渡す
//
// 【ヒント】
// - createContext<AuthContextType | null>(null) で初期値 null のコンテキストを作成
// - login: localStorage の users 配列から username/password が一致するユーザーを検索
// - register: 新しいユーザーを作成して localStorage の users 配列に追加
// - token は `user-${user.id}-${Date.now()}` の形式で生成
// - logout: authState を初期値に戻し、localStorage からトークンを削除
// --------------------------------------------------

// ここにコンテキストを作成してください
export const AuthContext = undefined as any;

// AuthProvider コンポーネント
export function AuthProvider({ children }: { children: ReactNode }) {
  // 認証状態（user, token, isAuthenticated の3つを管理）
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  // TODO(Q2): useEffect でアプリ起動時に localStorage から認証状態を復元してください
  // ヒント: localStorage から token と user を取得し、両方存在すれば authState を更新

  // ログイン処理（localStorage のユーザー配列から検索）
  const login = useCallback(async (input: LoginInput) => {
    // localStorage からユーザー一覧を取得
    const usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];

    // ユーザー名とパスワードが一致するユーザーを検索
    const found = users.find(
      (u) => u.username === input.username && u.password === input.password
    );

    if (!found) {
      throw new Error('ユーザー名またはパスワードが正しくありません');
    }

    // トークンを生成して保存
    const token = `user-${found.id}-${Date.now()}`;
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(found));

    setAuthState({
      user: found,
      token,
      isAuthenticated: true,
    });
  }, []);

  // ユーザー登録処理
  const register = useCallback(async (input: RegisterInput) => {
    const usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];

    // 同じユーザー名が既に存在するかチェック
    if (users.some((u) => u.username === input.username)) {
      throw new Error('このユーザー名は既に使用されています');
    }

    // 新しいユーザーを作成
    const newUser: User = {
      id: `user-${Date.now()}`,
      username: input.username,
      password: input.password,
      displayName: input.displayName,
    };

    // ユーザー配列に追加して保存
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // 自動ログイン
    const token = `user-${newUser.id}-${Date.now()}`;
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));

    setAuthState({
      user: newUser,
      token,
      isAuthenticated: true,
    });
  }, []);

  // ログアウト処理
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  }, []);

  // TODO(Q2): Provider で children をラップし、value に authState, login, register, logout を渡してください
  // ヒント: <AuthContext.Provider value={{ authState, login, register, logout }}>{children}</AuthContext.Provider>
  return (
    // ここに Provider のラップを実装してください
    undefined as any
  );
}
