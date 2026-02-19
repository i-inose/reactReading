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
// TODO(Q3): useDebounce フックを実装してください
//
// 【デバウンスとは？】
// 連続する操作（キー入力など）を一定時間の沈黙後にまとめて実行する技法。
// 例: 検索バーでキー入力のたびにフィルタリングすると負荷がかかるため、
// 入力が止まって 300ms 後にまとめて1回だけフィルタリングする。
//
// 【ジェネリクスとは？】
// <T> は型パラメータ。useDebounce<string>("hello", 300) のように
// 呼ぶと T = string に確定する。どんな型の値でもデバウンスできる。
//
// 以下の3つを実装します:
//   1. useState<T>(value) でデバウンス後の値を管理する
//   2. useEffect で setTimeout を使い、delay ミリ秒後に値を更新する
//   3. useEffect のクリーンアップ関数で clearTimeout する
//      （value が変わるたびに前回のタイマーをキャンセルする）
//
// ヒント: 05-api-design/src/hooks/useDebounce.ts とほぼ同じ構造です。
//         useState → useEffect（setTimeout + cleanup）→ return の3ステップ。
// 参考: 05-api-design/src/hooks/useDebounce.ts
// --------------------------------------------------

export function useDebounce<T>(value: T, delay: number): T {
  // ここに useState, useEffect, return を書いてください

  const _debouncedValue = undefined as any as T; // ← useState で置き換える

  void _debouncedValue;
  void delay;
  void useState;
  void useEffect;

  // useEffect を書いてください
  // - setTimeout で delay ミリ秒後に setDebouncedValue(value) を呼ぶ
  // - クリーンアップ関数で clearTimeout する
  // - 依存配列は [value, delay]

  return value; // ← debouncedValue に置き換える
}
