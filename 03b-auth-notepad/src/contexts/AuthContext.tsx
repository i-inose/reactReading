// 【このファイルで学べること】
// - Context API による認証状態の共有（03-auth-blog と同じパターン）
// - localStorage からの認証状態の復元（useEffect）
// - ログイン/登録/ログアウトのロジック

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { User, LoginInput, RegisterInput, AuthContextType } from '../types';
import {
  getStoredAuth,
  setStoredAuth,
  clearStoredAuth,
  checkToken,
  simulateLogin,
  simulateRegister,
} from '../api';

// createContext: コンポーネントツリー全体で値を共有する仕組み
// null を初期値にし、Provider で実際の値を渡す
export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // アプリ起動時に localStorage から認証状態を復元する
  // リロードしても React の状態は消えるが、localStorage のトークンで復元できる
  useEffect(() => {
    const stored = getStoredAuth();
    if (stored?.token) {
      const restored = checkToken(stored.token);
      if (restored) {
        setUser(restored);
      } else {
        clearStoredAuth();
      }
    }
    setIsLoading(false);
  }, []);

  // ログイン処理（simulateLogin は擬似 API）
  const login = useCallback(async (input: LoginInput) => {
    const { token, user: loggedInUser } = await simulateLogin(input);
    setStoredAuth({ token, user: loggedInUser });
    setUser(loggedInUser);
  }, []);

  // 登録処理（登録後に自動ログイン）
  const register = useCallback(async (input: RegisterInput) => {
    const { token, user: newUser } = await simulateRegister(input);
    setStoredAuth({ token, user: newUser });
    setUser(newUser);
  }, []);

  // ログアウト処理
  const logout = useCallback(() => {
    clearStoredAuth();
    setUser(null);
  }, []);

  // Provider で子コンポーネントに値を渡す
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
