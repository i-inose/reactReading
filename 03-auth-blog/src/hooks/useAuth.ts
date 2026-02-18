// ============================================================
// useAuth.ts ― 認証コンテキストを利用するカスタムフック
//
// 【このファイルで学べること】
// - カスタムフックによるコンテキストのラッパーパターン
// - useContext の安全な使い方（Provider 外での使用を検出）
// ============================================================

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import type { AuthContextType } from '../types';

/**
 * 認証コンテキストにアクセスするカスタムフック
 *
 * 【なぜラッパーフックが必要？】
 * 1. useContext(AuthContext) を毎回書かなくて済む
 * 2. Provider の外で使われた場合にエラーを投げられる
 * 3. 型の絞り込みを1箇所で行える（null チェック）
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  // AuthProvider の外で useAuth() を使うと context が null になる
  // 開発時のミスを早期発見するために例外を投げる
  if (context === null) {
    throw new Error('useAuth は AuthProvider の内部で使用してください');
  }

  return context;
}
