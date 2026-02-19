// ============================================================
// types.ts ― アプリ全体で使用する型定義
//
// 【このファイルで学べること】
// - TypeScript のインターフェース（interface）定義
// - 認証・ギャラリー両方の型を一箇所で管理する方法
// - Optional なプロパティ（?:）の使い方
// ============================================================

// --------------------------------------------------
// ユーザー関連の型
// --------------------------------------------------

/** ユーザー登録時の入力 */
export interface RegisterInput {
  username: string;
  password: string;
  displayName: string;
}

/** ログイン時の入力 */
export interface LoginInput {
  username: string;
  password: string;
}

// --------------------------------------------------
// TODO(Q1): User, GalleryImage, AuthState インターフェースを定義してください
//
// 【説明】
// アプリで使う3つの主要なインターフェースを定義します。
// - User: ユーザー情報（id, username, password, displayName）
// - GalleryImage: 画像情報（id, url, title, description, ownerId, ownerName, createdAt）
// - AuthState: 認証状態（user, token, isAuthenticated）
//
// 【ヒント】
// - User の id は string 型を使います（`user-${Date.now()}` 形式）
// - GalleryImage の createdAt は string 型（ISO 8601 形式の日時文字列）
// - AuthState の user は User | null（未ログインなら null）
// - AuthState の token は string | null（未認証なら null）
// --------------------------------------------------

export interface User {
  // TODO(Q1): ここに User のプロパティを定義してください
  id: undefined as any;
  username: undefined as any;
  password: undefined as any;
  displayName: undefined as any;
}

export interface GalleryImage {
  // TODO(Q1): ここに GalleryImage のプロパティを定義してください
  id: undefined as any;
  url: undefined as any;
  title: undefined as any;
  description: undefined as any;
  ownerId: undefined as any;
  ownerName: undefined as any;
  createdAt: undefined as any;
}

export interface AuthState {
  // TODO(Q1): ここに AuthState のプロパティを定義してください
  user: undefined as any;
  token: undefined as any;
  isAuthenticated: undefined as any;
}

// --------------------------------------------------
// 認証コンテキストの型
// --------------------------------------------------

/** AuthContext が提供する値の型 */
export interface AuthContextType {
  authState: AuthState;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}
