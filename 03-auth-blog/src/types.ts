// ============================================================
// types.ts ― アプリ全体で使用する型定義
//
// 【このファイルで学べること】
// - TypeScript のインターフェース（interface）定義
// - バックエンド API とフロントエンドの型の対応関係
// - Optional なプロパティ（?:）の使い方
// ============================================================

// --------------------------------------------------
// ユーザー関連の型
// --------------------------------------------------

/** ユーザー情報（API レスポンスの形） */
export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;   // ISO 8601 形式の日時文字列
}

/** ユーザー登録時の入力 */
export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;  // フロントエンドのみ（API には送らない）
}

/** ログイン時の入力 */
export interface LoginInput {
  email: string;
  password: string;
}

// --------------------------------------------------
// 認証トークン関連の型
// --------------------------------------------------

/** 認証 API のレスポンス */
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

/** localStorage に保存する認証情報 */
export interface StoredAuth {
  access_token: string;
  refresh_token: string;
  user: User;
}

// --------------------------------------------------
// 記事関連の型
// --------------------------------------------------

/** 記事の著者情報（記事レスポンスに含まれる簡易版） */
export interface AuthorInfo {
  id: number;
  username: string;
}

/** 記事情報（API レスポンスの形） */
export interface Article {
  id: number;
  title: string;
  body: string;
  author: AuthorInfo;
  created_at: string;
  updated_at: string;
}

/** 記事作成時の入力 */
export interface ArticleCreateInput {
  title: string;
  body: string;
}

/** 記事更新時の入力（部分更新） */
export interface ArticleUpdateInput {
  title?: string;
  body?: string;
}

// --------------------------------------------------
// 認証コンテキストの型
// --------------------------------------------------

/** AuthContext が提供する値の型 */
export interface AuthContextType {
  user: User | null;             // ログイン中のユーザー（未ログインなら null）
  isAuthenticated: boolean;      // ログイン済みかどうか
  isLoading: boolean;            // 認証状態の復元中かどうか
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}
