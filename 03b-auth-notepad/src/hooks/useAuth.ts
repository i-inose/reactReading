// 【このファイルで学べること】
// - カスタムフックによるコンテキストのラッパーパターン
// - Provider 外での使用を検出する null ガード

import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import type { AuthContextType } from '../types';

// useContext のラッパー: null チェックを1箇所で行う
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth は AuthProvider の内部で使用してください');
  }
  return context;
}
