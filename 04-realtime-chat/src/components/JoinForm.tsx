// ============================================================
// JoinForm.tsx ― ニックネーム入力フォーム
//
// 【このファイルで学べること】
// - フォームの送信と入力バリデーション
// - useRef で初回レンダリング時にフォーカスを当てる
// - useState と条件分岐によるエラー表示
// ============================================================

import { useState, useRef, useEffect, useCallback } from "react";
import type { FormEvent } from "react";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface JoinFormProps {
  onJoin: (username: string) => void;   // 参加コールバック
}

// ユーザー名の文字数制限
const MIN_LENGTH = 1;
const MAX_LENGTH = 20;

// --------------------------------------------------
// JoinForm コンポーネント
// --------------------------------------------------
export function JoinForm({ onJoin }: JoinFormProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // --------------------------------------------------
  // 初回レンダリング時に入力欄にフォーカスを当てる
  //
  // 【autoFocus vs useRef + useEffect】
  // HTML の autoFocus 属性でもフォーカスできるが、
  // useRef + useEffect の方がタイミングを制御しやすい。
  // --------------------------------------------------
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // --------------------------------------------------
  // フォーム送信処理
  // --------------------------------------------------
  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      const trimmed = name.trim();

      // バリデーション
      if (trimmed.length < MIN_LENGTH) {
        setError("ニックネームを入力してください");
        return;
      }
      if (trimmed.length > MAX_LENGTH) {
        setError(`ニックネームは${MAX_LENGTH}文字以内にしてください`);
        return;
      }

      setError(null);
      onJoin(trimmed);
    },
    [name, onJoin]
  );

  return (
    <div className="join-form">
      <h1 className="join-form__title">リアルタイムチャット</h1>
      <p className="join-form__description">
        ニックネームを入力してチャットに参加しましょう
      </p>

      <form className="join-form__form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className="join-form__input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ニックネーム"
          maxLength={MAX_LENGTH}
          autoComplete="off"
        />

        {/* エラーメッセージの条件付き表示 */}
        {error && <p className="join-form__error">{error}</p>}

        <button
          className="join-form__btn"
          type="submit"
          disabled={name.trim() === ""}
        >
          参加する
        </button>
      </form>
    </div>
  );
}
