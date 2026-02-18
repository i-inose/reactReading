// ============================================================
// MessageInput.tsx ― メッセージ入力フォーム
//
// 【このファイルで学べること】
// - 制御コンポーネント（useState で入力値を管理）
// - フォームの送信イベント処理（FormEvent）
// - キー入力イベント（KeyboardEvent）でのショートカット実装
// - useRef で DOM 要素にフォーカスする
// ============================================================

import { useState, useRef, useCallback } from "react";
import type { FormEvent, KeyboardEvent } from "react";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface MessageInputProps {
  onSend: (message: string) => void;     // メッセージ送信コールバック
  onTyping: () => void;                  // 入力中通知コールバック
  disabled: boolean;                     // 送信無効状態
}

// --------------------------------------------------
// MessageInput コンポーネント
// --------------------------------------------------
export function MessageInput({ onSend, onTyping, disabled }: MessageInputProps) {
  // --------------------------------------------------
  // 制御コンポーネント
  //
  // 【制御コンポーネントとは？】
  // input の値を React の state で管理するパターン。
  // value と onChange を組み合わせることで、React が入力値を
  // 完全に制御する。バリデーションや加工が容易になる。
  // --------------------------------------------------
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // --------------------------------------------------
  // フォーム送信処理
  // --------------------------------------------------
  const handleSubmit = useCallback(
    (e: FormEvent) => {
      // デフォルトのフォーム送信（ページリロード）を防ぐ
      e.preventDefault();

      const trimmed = text.trim();
      if (trimmed === "") return;

      onSend(trimmed);
      setText("");  // 入力欄をクリアする

      // 送信後に入力欄にフォーカスを戻す
      inputRef.current?.focus();
    },
    [text, onSend]
  );

  // --------------------------------------------------
  // キー入力ハンドラ
  // Enter キーで送信、Shift+Enter は改行（将来対応）
  // --------------------------------------------------
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as FormEvent);
      }
    },
    [handleSubmit]
  );

  // --------------------------------------------------
  // 入力変更時に入力中通知を送る
  // --------------------------------------------------
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value);
      onTyping();  // サーバーに入力中を通知する
    },
    [onTyping]
  );

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        className="message-input__field"
        type="text"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="メッセージを入力..."
        disabled={disabled}
        autoComplete="off"
      />
      <button
        className="message-input__btn"
        type="submit"
        disabled={disabled || text.trim() === ""}
      >
        送信
      </button>
    </form>
  );
}
