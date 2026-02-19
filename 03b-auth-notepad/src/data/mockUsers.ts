// 【このファイルで学べること】
// - アプリ初期化時にサンプルデータを localStorage に投入するパターン

import type { StoredUser } from '../types';

// サンプルユーザー（パスワードは平文 ― 学習用のため）
export const mockUsers: StoredUser[] = [
  {
    id: 'user-1',
    username: 'たろう',
    email: 'taro@example.com',
    password: 'password123',
    createdAt: '2025-01-10T09:00:00.000Z',
  },
  {
    id: 'user-2',
    username: 'はなこ',
    email: 'hanako@example.com',
    password: 'password123',
    createdAt: '2025-02-15T10:30:00.000Z',
  },
];

// localStorage にサンプルユーザーがなければ投入する
export function initMockUsers(): void {
  const key = 'auth-notepad-users';
  const existing = localStorage.getItem(key);
  if (!existing || JSON.parse(existing).length === 0) {
    localStorage.setItem(key, JSON.stringify(mockUsers));
  }
}
