// ============================================================
// SearchBar.tsx ― デバウンス付き検索バーコンポーネント
//
// 【このファイルで学べること】
// 1. useDebounce フックを使ったデバウンス検索
// 2. ローカル state と親への通知の分離
// 3. useEffect で副作用（コールバック呼び出し）を管理する
// ============================================================

import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface SearchBarProps {
  value: string;
  onSearch: (value: string) => void;
}

// --------------------------------------------------
// TODO(Q8): デバウンス付き検索バーを実装してください
//
// 【デバウンス検索の仕組み】
// 1. ローカル state (localValue) でキー入力をリアルタイムに反映する
// 2. useDebounce でデバウンスされた値 (debouncedValue) を取得する
// 3. useEffect で debouncedValue が変わったら onSearch を呼ぶ
//
// これにより、ユーザーが入力中は即座に表示が更新されるが、
// 親コンポーネントへの通知（＝フィルタリング実行）はデバウンスされる。
//
// 以下の3つを実装します:
//   1. useState でローカル入力値を管理（初期値は props の value）
//   2. useDebounce(localValue, 300) でデバウンス値を取得
//   3. useEffect で debouncedValue が変わったら onSearch(debouncedValue) を呼ぶ
//
// また、クリアボタン（×）の onClick で:
//   - setLocalValue("") でローカル値をクリア
//   - onSearch("") で親にも即座に通知
//
// ヒント: 05-api-design では SearchBar 自体にデバウンスがなく、
//         useProducts フック側でデバウンスしていた。今回は SearchBar 内で
//         ローカル state + useDebounce を組み合わせるパターンを学ぶ。
// 参考: 05-api-design/src/components/SearchBar.tsx（構造の参考）
//       05-api-design/src/hooks/useDebounce.ts（デバウンスの参考）
// --------------------------------------------------
export function SearchBar({ value, onSearch }: SearchBarProps) {
  // ここに useState, useDebounce, useEffect を書いてください

  const _localValue = undefined as any as string; // ← useState で置き換える
  const _setLocalValue = undefined as any as React.Dispatch<React.SetStateAction<string>>; // ← useState で置き換える
  const _debouncedValue = undefined as any as string; // ← useDebounce で置き換える

  void _localValue;
  void _setLocalValue;
  void _debouncedValue;
  void value;
  void onSearch;
  void useState;
  void useEffect;
  void useDebounce;

  // useEffect: debouncedValue が変わったら onSearch を呼ぶ

  // useEffect: 外部から value が変更されたら localValue を同期する

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-bar__input"
        placeholder="社員名で検索..."
        value={""}        // ← localValue に置き換える
        onChange={() => {}} // ← (e) => setLocalValue(e.target.value) に置き換える
      />
      {/* 入力があるときだけクリアボタンを表示する */}
      {false && ( // ← localValue に置き換える
        <button
          className="search-bar__clear"
          onClick={() => {}} // ← setLocalValue("") + onSearch("") に置き換える
          aria-label="検索をクリア"
        >
          &times;
        </button>
      )}
    </div>
  );
}
