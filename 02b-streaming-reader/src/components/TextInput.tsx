// ============================================================
// src/components/TextInput.tsx - テキスト入力 + ファイル読み込み
// ============================================================
// 【このファイルで学べること】
// - FileReader API による .txt ファイルの読み込み
//   （02-mastra-rag の DocumentUpload と対になるパターン）
// - input[type="file"] の ref 経由での操作
// - フォーム送信と状態管理の連携
// ============================================================

import { useState, useRef, type FormEvent, type ChangeEvent } from "react";

interface TextInputProps {
  onSubmit: (text: string) => void;
  disabled: boolean;
}

export function TextInput({ onSubmit, disabled }: TextInputProps) {
  const [text, setText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText("");
  };

  // --------------------------------------------------
  // FileReader API でテキストファイルを読み込む
  // 02-mastra-rag ではサーバーにアップロードしていたが、
  // ここではクライアント側で完結する。
  // --------------------------------------------------
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        setText(content);
      }
    };
    reader.readAsText(file);

    // 同じファイルを再選択できるようにリセット
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form className="text-input" onSubmit={handleSubmit}>
      <div className="text-input__toolbar">
        <span className="text-input__label">テキストを入力または貼り付け</span>
        <button
          type="button"
          className="text-input__file-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        >
          .txt を読み込む
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,text/plain"
          className="text-input__file-hidden"
          onChange={handleFileChange}
        />
      </div>

      <textarea
        className="text-input__textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="要約したいテキストをここに入力してください..."
        rows={8}
        disabled={disabled}
      />

      <button
        type="submit"
        className="text-input__submit"
        disabled={disabled || !text.trim()}
      >
        {disabled ? "要約を生成中..." : "AI で要約する"}
      </button>
    </form>
  );
}
