// ============================================================
// api.ts ― localStorage ベースの擬似 API ユーティリティ
//
// 【このファイルで学べること】
// - localStorage を使ったデータの永続化
// - トークンベース認証のシミュレーション
// - 認証ヘッダーパターン（Authorization: Bearer <token>）
// - 03-auth-blog の api.ts との対比（実際の HTTP vs localStorage）
// ============================================================

import type { User } from './types';

// --------------------------------------------------
// localStorage のキー定数
// --------------------------------------------------
export const STORAGE_KEYS = {
  USERS: 'gallery_users',
  TOKEN: 'gallery_token',
  CURRENT_USER: 'gallery_current_user',
  IMAGES: 'gallery_images',
} as const;

// --------------------------------------------------
// TODO(Q4): 擬似認証 API ユーティリティ関数を実装してください
//
// 【説明】
// 03-auth-blog では fetch() で実際の HTTP リクエストを送信していましたが、
// このアプリではバックエンドを使わず localStorage で認証をシミュレートします。
// 2つの関数を実装してください:
//
// 1. checkAuth(token): トークンが有効かどうかを検証する関数
//    - localStorage の USERS 配列を取得
//    - token に含まれる userId を抽出（token は `user-${userId}-${timestamp}` 形式）
//    - userId に一致するユーザーが存在すれば User を返す、なければ null を返す
//
// 2. getAuthHeader(): 認証ヘッダーを生成する関数
//    - localStorage から TOKEN を取得
//    - トークンがあれば { Authorization: `Bearer ${token}` } を返す
//    - なければ空オブジェクト {} を返す
//
// 【ヒント】
// - checkAuth: token.startsWith('user-') で形式チェック可能
//   token の例: "user-user-1717000000000-1717000001000"
//   split して userId 部分を取り出す → users.find(u => u.id === userId)
// - getAuthHeader: localStorage.getItem(STORAGE_KEYS.TOKEN) で取得
// --------------------------------------------------

/** トークンが有効かどうかを検証し、ユーザー情報を返す */
export function checkAuth(token: string): User | null {
  // TODO(Q4): ここに実装してください
  return undefined as any;
}

/** 認証ヘッダーを生成する（トークンがあれば Bearer ヘッダーを返す） */
export function getAuthHeader(): Record<string, string> {
  // TODO(Q4): ここに実装してください
  return undefined as any;
}

// --------------------------------------------------
// 初期データの投入
//
// 【説明】
// アプリ初回起動時に、モックユーザーとモック画像を localStorage に保存する。
// 既にデータがある場合はスキップする。
// --------------------------------------------------
export function initializeData(
  mockUsers: User[],
  mockImages: import('./types').GalleryImage[]
): void {
  // ユーザーデータの初期化
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }

  // 画像データの初期化
  if (!localStorage.getItem(STORAGE_KEYS.IMAGES)) {
    localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(mockImages));
  }
}
