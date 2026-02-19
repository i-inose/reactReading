// ============================================================
// fakeUsers.ts ― シミュレーション用の仮ユーザー
// 【このファイルで学べること】 as const による読み取り専用配列
// ============================================================

export const FAKE_USERS = [
  "Tanaka",
  "Suzuki",
  "Yamada",
  "Sato",
  "Takahashi",
] as const;

// 配列の要素型を取得するユーティリティ型
export type FakeUser = (typeof FAKE_USERS)[number];
