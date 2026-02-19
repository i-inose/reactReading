// ============================================================
// AddNoteForm.tsx ― 付箋追加フォーム
//
// 【このファイルで学べること】
// - useState でフォームの入力値を管理する
// - フォーム送信ハンドラのパターン（preventDefault）
// - Props のコールバックで親に値を渡す
// ============================================================

import { useState, useCallback } from "react";
import { NOTE_COLORS } from "../data/noteColors.ts";

interface AddNoteFormProps {
  onAdd: (text: string, color: string) => void;
  disabled: boolean;
}

export function AddNoteForm({ onAdd, disabled }: AddNoteFormProps) {
  const [text, setText] = useState("");
  const [color, setColor] = useState(NOTE_COLORS[0].value);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!text.trim()) return;
      onAdd(text, color);
      setText("");
    },
    [text, color, onAdd]
  );

  return (
    <form className="add-note-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="add-note-form__input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="付箋のテキストを入力..."
        disabled={disabled}
        maxLength={100}
      />

      <div className="add-note-form__colors">
        {NOTE_COLORS.map((c) => (
          <button
            key={c.value}
            type="button"
            className={`add-note-form__color-btn ${
              color === c.value ? "add-note-form__color-btn--selected" : ""
            }`}
            style={{ backgroundColor: c.value }}
            onClick={() => setColor(c.value)}
            aria-label={c.label}
            title={c.label}
          />
        ))}
      </div>

      <button
        type="submit"
        className="add-note-form__submit"
        disabled={disabled || !text.trim()}
      >
        追加
      </button>
    </form>
  );
}
