// ============================================================
// ThemeContext.tsx ― Context API によるテーマ管理
//
// 【Context API とは？】
// 親 → 子 → 孫 と Props を何段も渡す（Props のバケツリレー）を
// 避けるために、コンポーネントツリー全体にデータを配信する仕組み。
// テーマ、認証情報、言語設定など「どこからでも参照したいデータ」に使う。
// ============================================================

// React から必要なものをインポートする
import {
  createContext, // Context オブジェクトを作成する関数
  useContext,    // Context の値を取得するフック
  useState,      // 状態管理フック
  useCallback,   // 関数をメモ化するフック（不要な再生成を防ぐ）
} from "react";

// 型定義をインポートする
import type { ReactNode } from "react";    // children の型
import type { ThemeMode } from "../types"; // "light" | "dark"

// --------------------------------------------------
// Context に入れる値の型を定義する
// この型が、useContext で取り出せる値の構造になる
// --------------------------------------------------
interface ThemeContextType {
  theme: ThemeMode;              // 現在のテーマ（"light" | "dark"）
  toggleTheme: () => void;       // テーマを切り替える関数
  isDark: boolean;               // ダークモードかどうか（便利なヘルパー）
}

// --------------------------------------------------
// 1. Context オブジェクトを作成する
// createContext の引数はデフォルト値（Provider の外で使われた場合の値）
// 通常は null にして、Provider 内でのみ使う設計にする
// --------------------------------------------------
const ThemeContext = createContext<ThemeContextType | null>(null);

// --------------------------------------------------
// 2. Provider コンポーネントを作成する
// Provider はデータを「配信する」側のコンポーネント
// App のルート近くに配置して、アプリ全体にテーマ情報を配信する
// --------------------------------------------------

// Provider の Props 型（children だけを受け取る）
interface ThemeProviderProps {
  children: ReactNode;  // ReactNode: JSX 要素、文字列、配列など全て含む型
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // テーマの状態を useState で管理する
  // 初期値は localStorage から取得し、なければ "light" にする
  const [theme, setTheme] = useState<ThemeMode>(() => {
    // useState の引数に関数を渡すと「遅延初期化」になる
    // 初回レンダリング時にだけ実行され、パフォーマンスが良い
    const saved = localStorage.getItem("theme");
    return (saved === "light" || saved === "dark") ? saved : "light";
  });

  // テーマを切り替える関数
  // useCallback でメモ化して、不要な再生成を防ぐ
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      // prev: 現在の値。関数型更新で最新値を安全に参照する
      const next = prev === "light" ? "dark" : "light";
      // localStorage に保存して、リロード後も維持する
      localStorage.setItem("theme", next);
      return next;
    });
  }, []); // 依存配列が空 → この関数は一度だけ作られる

  // ダークモードかどうかの便利なフラグ
  const isDark = theme === "dark";

  // Provider コンポーネントを返す
  // value に渡したオブジェクトが、子孫コンポーネントで useContext で取得できる
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

// --------------------------------------------------
// 3. Context を簡単に使えるカスタムフックを作る
// 毎回 useContext(ThemeContext) + null チェックを書くのは面倒なので、
// フックとして切り出して再利用しやすくする
// --------------------------------------------------
export function useTheme(): ThemeContextType {
  // useContext で Context の現在の値を取得する
  const context = useContext(ThemeContext);

  // Provider の外で使われた場合はエラーにする（開発時のバグ防止）
  if (context === null) {
    throw new Error("useTheme は ThemeProvider の中で使ってください");
  }

  return context;
}
