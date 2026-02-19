import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import type { ThemeMode } from "../types";

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

// TODO(Q4): ThemeProvider コンポーネントを完成させてください
// 以下の3つを実装します:
//   1. useState でテーマ状態を管理する（初期値は localStorage から取得、なければ "light"）
//   2. useCallback で toggleTheme 関数を作る（light ↔ dark を切り替え、localStorage に保存）
//   3. ThemeContext.Provider の value に { theme, toggleTheme, isDark } を渡して children を描画する
//
// ヒント: useState の遅延初期化（引数に関数を渡す）を使うと、
//         localStorage の読み込みは初回レンダリング時だけ実行される
// 参考: 01-task-manager/src/contexts/ThemeContext.tsx の ThemeProvider
export function ThemeProvider({ children }: ThemeProviderProps) {
  // ここに useState, useCallback, isDark の計算、return 文を書いてください

  const _theme = undefined as any as ThemeMode; // ← useState で置き換える
  const _toggleTheme = undefined as any as () => void; // ← useCallback で置き換える
  const _isDark = false; // ← theme === "dark" で置き換える

  void useState; // ← 正しく実装したらこの行を削除
  void useCallback; // ← 正しく実装したらこの行を削除
  void _theme;
  void _toggleTheme;
  void _isDark;

  // Provider の return 文を書いてください
  // <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
  //   {children}
  // </ThemeContext.Provider>
  return children as React.JSX.Element; // ← 上のコメントの内容に置き換える
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useTheme は ThemeProvider の中で使ってください");
  }
  return context;
}
