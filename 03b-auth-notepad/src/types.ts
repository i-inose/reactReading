// 【このファイルで学べること】
// - TypeScript のインターフェース定義
// - localStorage ベースの認証で使う型の設計

// ユーザー情報
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

// localStorage に保存するユーザー（パスワード付き）
export interface StoredUser {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
}

// ログイン入力
export interface LoginInput {
  email: string;
  password: string;
}

// 登録入力
export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// メモの型
export interface Note {
  id: string;
  title: string;
  content: string;
  ownerId: string;
  ownerName: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// メモ作成時の入力
export interface NoteCreateInput {
  title: string;
  content: string;
  tags: string;
}

// メモ更新時の入力
export interface NoteUpdateInput {
  title?: string;
  content?: string;
  tags?: string;
}

// localStorage に保存する認証情報
export interface StoredAuth {
  token: string;
  user: User;
}

// AuthContext の型
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => void;
}
