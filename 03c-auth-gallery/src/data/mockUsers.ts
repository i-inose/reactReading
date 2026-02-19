// ============================================================
// mockUsers.ts ― 初期ユーザーデータ
//
// 【説明】
// アプリ初回起動時に localStorage にセットするサンプルユーザー。
// 実際のアプリではパスワードはハッシュ化すべきだが、
// 学習用のため平文で保存している。
// ============================================================

import type { User } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    username: 'user1',
    password: 'password1',
    displayName: '田中太郎',
  },
  {
    id: 'user-2',
    username: 'user2',
    password: 'password2',
    displayName: '鈴木花子',
  },
];
