// ============================================================
// useDebounce.ts ― 汎用デバウンスフック
//
// 【このファイルで学べること】
// 1. ジェネリクスを使ったカスタムフック（useDebounce<T>）
// 2. デバウンスの仕組み（連続入力を遅延させる技法）
// 3. useEffect のクリーンアップ関数
// ============================================================

import { useState, useEffect } from "react";

// --------------------------------------------------
// useDebounce フック
//
// 【デバウンスとは？】
// 連続する操作（キー入力など）を一定時間の沈黙後にまとめて実行する技法。
// 例: 検索バーでキー入力のたびに API を呼ぶと負荷がかかるため、
// 入力が止まって 300ms 後にまとめて1回だけ API を呼ぶ。
//
// 【ジェネリクスとは？】
// <T> は型パラメータ。useDebounce<string>("hello", 300) のように
// 呼ぶと T = string に確定する。どんな型の値でもデバウンスできる。
// --------------------------------------------------

export function useDebounce<T>(value: T, delay: number): T {
  // デバウンス後の値を state で管理する
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // タイマーをセットする（delay ミリ秒後に値を更新）
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 【クリーンアップ関数】
    // value が変わるたびに前回のタイマーをキャンセルする。
    // これにより「最後の変更から delay ミリ秒後」にだけ発火する。
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
