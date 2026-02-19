// ============================================================
// useDebounce.ts ― 汎用デバウンスフック
//
// 【このファイルで学べること】
// 1. ジェネリクスを使ったカスタムフック（useDebounce<T>）
// 2. useEffect のクリーンアップによるタイマー管理
// ============================================================

import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // value が変わるたびに前回のタイマーをキャンセルする
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
