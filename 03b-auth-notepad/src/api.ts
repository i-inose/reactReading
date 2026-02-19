// 【このファイルで学べること】
// - localStorage を使った擬似認証 API の実装
// - トークン管理のユーティリティ関数
// - 03-auth-blog では fetch + JWT だった部分を localStorage で代替する方法

import type { StoredAuth, StoredUser, User, LoginInput, RegisterInput } from './types';

const AUTH_KEY = 'auth-notepad-auth';
const USERS_KEY = 'auth-notepad-users';

// トークン管理ユーティリティ（03-auth-blog の getStoredAuth 等と同じパターン）
export function getStoredAuth(): StoredAuth | null {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

export function setStoredAuth(auth: StoredAuth): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

export function clearStoredAuth(): void {
  localStorage.removeItem(AUTH_KEY);
}

// ユーザー一覧の取得・保存
function getUsers(): StoredUser[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// トークン生成（擬似 JWT）
function generateToken(userId: string): string {
  return `token-${userId}-${Date.now()}`;
}

// トークンからユーザーを検証する
export function checkToken(token: string): User | null {
  const match = token.match(/^token-(.+)-\d+$/);
  if (!match) return null;
  const userId = match[1];
  const users = getUsers();
  const found = users.find((u) => u.id === userId);
  if (!found) return null;
  return { id: found.id, username: found.username, email: found.email, createdAt: found.createdAt };
}

// 擬似ログイン関数
export async function simulateLogin(input: LoginInput): Promise<{ token: string; user: User }> {
  // 非同期を模倣するため少し待つ
  await new Promise((r) => setTimeout(r, 300));

  const users = getUsers();
  const found = users.find((u) => u.email === input.email && u.password === input.password);
  if (!found) {
    throw new Error('メールアドレスまたはパスワードが正しくありません');
  }

  const user: User = { id: found.id, username: found.username, email: found.email, createdAt: found.createdAt };
  const token = generateToken(user.id);
  return { token, user };
}

// 擬似登録関数
export async function simulateRegister(input: RegisterInput): Promise<{ token: string; user: User }> {
  await new Promise((r) => setTimeout(r, 300));

  const users = getUsers();
  if (users.some((u) => u.email === input.email)) {
    throw new Error('このメールアドレスは既に登録されています');
  }

  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    username: input.username,
    email: input.email,
    password: input.password,
    createdAt: new Date().toISOString(),
  };
  saveUsers([...users, newUser]);

  const user: User = { id: newUser.id, username: newUser.username, email: newUser.email, createdAt: newUser.createdAt };
  const token = generateToken(user.id);
  return { token, user };
}

// 認証ヘッダー取得（将来的な拡張用のユーティリティ）
export function getAuthHeader(): Record<string, string> {
  const auth = getStoredAuth();
  if (!auth) return {};
  return { Authorization: `Bearer ${auth.token}` };
}
