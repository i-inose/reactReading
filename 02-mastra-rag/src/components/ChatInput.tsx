// ============================================================
// src/components/ChatInput.tsx - 質問入力フォーム
// ============================================================
// 【このファイルで学べること】
// - フォームの onSubmit ハンドラ
// - 制御コンポーネント（controlled component）パターン
// - disabled による送信制御
// ============================================================

import { useState, type FormEvent } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  // --------------------------------------------------
  // 【制御コンポーネントとは？】
  // input の値を React の state で管理するパターン。
  // value と onChange を組み合わせることで、
  // React が入力値を完全にコントロールする。
  // --------------------------------------------------
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    // デフォルトのフォーム送信（ページリロード）を防止
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    onSend(trimmed);
    setInput(""); // 送信後に入力欄をクリア
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        type="text"
        className="chat-input__field"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="ドキュメントについて質問してください..."
        disabled={isLoading}
      />
      <button
        type="submit"
        className="chat-input__button"
        disabled={isLoading || !input.trim()}
      >
        {isLoading ? "生成中..." : "送信"}
      </button>
    </form>
  );
}
