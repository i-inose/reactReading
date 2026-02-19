// ============================================================
// useAuth.ts ― 認証コンテキストを利用するカスタムフック
//
// 【このファイルで学べること】
// - カスタムフックによるコンテキストのラッパーパターン
// - useContext の安全な使い方（Provider 外での使用を検出）
// - null チェックによる型の絞り込み
// ============================================================

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import type { AuthContextType } from '../types';

// --------------------------------------------------
// TODO(Q3): useAuth カスタムフックを実装してください
//
// 【説明】
// AuthContext から値を取得し、安全に返すカスタムフック。
// Provider の外で使われた場合（context が null の場合）はエラーを投げる。
//
// 【実装手順】
// 1. useContext(AuthContext) でコンテキストの値を取得
// 2. 値が null の場合はエラーを投げる（AuthProvider の外で使われた場合）
// 3. AuthContextType 型の値を返す
//
// 【ヒント】
// - useContext の引数には AuthContext を渡す
// - null チェックで「AuthProvider の内部で使用してください」というエラーメッセージを投げる
// - 03-auth-blog の useAuth.ts と同じパターン
// --------------------------------------------------

export function useAuth(): AuthContextType {
  // TODO(Q3): ここに実装してください
  const context = undefined as any;

  return context;
}
