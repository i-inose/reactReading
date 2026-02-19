import { useState } from "react";
import type { FormEvent } from "react";

interface HabitFormProps {
  onAdd: (name: string, color: string) => void;
}

const COLORS = [
  "#4a90d9",
  "#27ae60",
  "#e74c3c",
  "#f39c12",
  "#8e44ad",
  "#1abc9c",
  "#e67e22",
  "#2c3e50",
];

// TODO(Q7): useState でフォームの状態管理と onSubmit ハンドラを実装してください
// 以下の3つを実装します:
//   1. useState で name（string, 初期値 ""）と color（string, 初期値 COLORS[0]）を管理する
//   2. handleSubmit 関数を作る:
//      - e.preventDefault() でフォームのデフォルト動作を防ぐ
//      - name.trim() が空なら return（空のまま追加しない）
//      - onAdd(name.trim(), color) を呼ぶ
//      - name を "" にリセットする
//   3. JSX 内の input と select に value と onChange を正しく接続する
//
// ヒント: useState<string>("") で文字列の状態を作る。
//         <input value={name} onChange={(e) => setName(e.target.value)} /> で接続する。
// 参考: 01-task-manager/src/components/TaskForm.tsx
export function HabitForm({ onAdd }: HabitFormProps) {
  // ここに useState で name と color の状態を定義してください
  let name = ""; // ← useState で置き換える
  let color = COLORS[0]; // ← useState で置き換える
  const setName = (_v: string) => {}; // ← useState の setter で置き換える
  const setColor = (_v: string) => {}; // ← useState の setter で置き換える

  void useState; // ← 正しく実装したらこの行を削除

  const handleSubmit = (_e: FormEvent) => {
    // ここに handleSubmit の処理を書いてください
    // e.preventDefault()
    // name.trim() が空なら return
    // onAdd(name.trim(), color)
    // setName("")
    void onAdd;
  };

  return (
    <form className="habit-form" onSubmit={handleSubmit}>
      <div className="habit-form__fields">
        <input
          className="habit-form__input"
          type="text"
          placeholder="新しい習慣を入力..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-label="習慣名"
        />
        <select
          className="habit-form__select"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          aria-label="色"
        >
          {COLORS.map((c) => (
            <option key={c} value={c} style={{ color: c }}>
              {c}
            </option>
          ))}
        </select>
        <button className="habit-form__btn" type="submit">
          追加
        </button>
      </div>
    </form>
  );
}
