// ============================================================
// api.ts ― API クライアント（トークンインターセプターパターン）
//
// 【このファイルで学べること】
// - fetch API のラッパー関数の設計
// - Authorization ヘッダーによるトークン送信
// - 401 レスポンス時のトークン自動リフレッシュ
// - インターセプターパターン（リクエスト/レスポンスの前処理・後処理）
// ============================================================

import type { StoredAuth } from './types';

// --------------------------------------------------
// localStorage のキー定数
// --------------------------------------------------
const AUTH_STORAGE_KEY = 'blog_auth';

// --------------------------------------------------
// トークン管理ユーティリティ
// --------------------------------------------------

/** 保存済みの認証情報を取得する */
export function getStoredAuth(): StoredAuth | null {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

/** 認証情報を localStorage に保存する */
export function setStoredAuth(auth: StoredAuth): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

/** 保存済みの認証情報を削除する（ログアウト時） */
export function clearStoredAuth(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

// --------------------------------------------------
// API クライアント関数
//
// 【インターセプターパターンとは？】
// API リクエストの送信前・レスポンス受信後に共通処理を挟むパターン。
// - リクエスト前: Authorization ヘッダーを自動付与
// - レスポンス後: 401 エラー時にトークンリフレッシュを試みる
// --------------------------------------------------

/**
 * 認証付き API リクエストを送信する
 *
 * fetch のラッパー関数。以下の機能を自動で付与する:
 * 1. Content-Type: application/json ヘッダー
 * 2. Authorization: Bearer <token> ヘッダー（トークンがある場合）
 * 3. 401 レスポンス時のトークンリフレッシュ + リトライ
 */
export async function apiClient(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const auth = getStoredAuth();

  // リクエストヘッダーを構築する
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  // トークンがあれば Authorization ヘッダーを付与する
  if (auth?.access_token) {
    headers['Authorization'] = `Bearer ${auth.access_token}`;
  }

  // API リクエストを送信する
  const response = await fetch(path, { ...options, headers });

  // --------------------------------------------------
  // 401 Unauthorized の処理（トークン期限切れ対応）
  //
  // アクセストークンが期限切れの場合:
  // 1. リフレッシュトークンで新しいアクセストークンを取得
  // 2. 新しいトークンで元のリクエストをリトライ
  // 3. リフレッシュも失敗したらログアウト
  // --------------------------------------------------
  if (response.status === 401 && auth?.refresh_token) {
    const refreshRes = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: auth.refresh_token }),
    });

    if (refreshRes.ok) {
      // リフレッシュ成功: 新しいトークンを保存する
      const newAuth = await refreshRes.json();
      setStoredAuth({
        access_token: newAuth.access_token,
        refresh_token: newAuth.refresh_token,
        user: newAuth.user,
      });

      // 新しいトークンで元のリクエストをリトライする
      headers['Authorization'] = `Bearer ${newAuth.access_token}`;
      return fetch(path, { ...options, headers });
    }

    // リフレッシュ失敗: 保存済み認証情報を削除する
    clearStoredAuth();
  }

  return response;
}
