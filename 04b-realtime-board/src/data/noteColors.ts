// ============================================================
// noteColors.ts ― 付箋の色定義
// 【このファイルで学べること】 定数オブジェクト配列の型定義
// ============================================================

export interface NoteColor {
  value: string;   // CSS カラー値
  label: string;   // 表示名
}

export const NOTE_COLORS: NoteColor[] = [
  { value: "#fff9c4", label: "イエロー" },
  { value: "#f8bbd0", label: "ピンク" },
  { value: "#bbdefb", label: "ブルー" },
  { value: "#c8e6c9", label: "グリーン" },
  { value: "#ffe0b2", label: "オレンジ" },
  { value: "#e1bee7", label: "パープル" },
];
