// 【このファイルで学べること】
// - Context API で「単位系（メトリック/インペリアル）」をアプリ全体に配信する
// - 01-task-manager の ThemeContext と同じ Provider パターン

import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import type { UnitSystem } from "../types";

// 単位変換の定数
const G_TO_OZ = 0.03527396;
const ML_TO_CUP = 0.00422675;

interface UnitContextType {
  unitSystem: UnitSystem;
  toggleUnit: () => void;
  convertAmount: (amount: number, unit: string) => { amount: number; unit: string };
  isMetric: boolean;
}

// Context を null 初期値で作成し、Provider 外での使用をエラーにする
const UnitContext = createContext<UnitContextType | null>(null);

interface UnitProviderProps {
  children: ReactNode;
}

export function UnitProvider({ children }: UnitProviderProps) {
  // localStorage から初期値を取得（遅延初期化）
  const [unitSystem, setUnitSystem] = useState<UnitSystem>(() => {
    const saved = localStorage.getItem("recipe-book-unit");
    return saved === "imperial" ? "imperial" : "metric";
  });

  const toggleUnit = useCallback(() => {
    setUnitSystem((prev) => {
      const next = prev === "metric" ? "imperial" : "metric";
      localStorage.setItem("recipe-book-unit", next);
      return next;
    });
  }, []);

  // 単位変換関数: g→oz, ml→cup に変換する
  const convertAmount = useCallback(
    (amount: number, unit: string): { amount: number; unit: string } => {
      if (unitSystem === "metric") return { amount, unit };

      switch (unit) {
        case "g":
          return { amount: Math.round(amount * G_TO_OZ * 10) / 10, unit: "oz" };
        case "ml":
          return { amount: Math.round(amount * ML_TO_CUP * 10) / 10, unit: "cup" };
        default:
          return { amount, unit };
      }
    },
    [unitSystem]
  );

  const isMetric = unitSystem === "metric";

  return (
    <UnitContext.Provider value={{ unitSystem, toggleUnit, convertAmount, isMetric }}>
      {children}
    </UnitContext.Provider>
  );
}

// カスタムフック: Provider 外で使われたらエラーにする
export function useUnit(): UnitContextType {
  const context = useContext(UnitContext);
  if (context === null) {
    throw new Error("useUnit は UnitProvider の中で使ってください");
  }
  return context;
}
