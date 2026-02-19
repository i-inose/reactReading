// ============================================================
// LoginForm.tsx ― ログインフォームコンポーネント
//
// 【このファイルで学べること】
// - フォームの状態管理（useState）
// - onSubmit イベントハンドラと preventDefault
// - 非同期処理中の UI フィードバック（ボタンの無効化）
// - Link コンポーネントによるページ遷移
// ============================================================

import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface LoginFormProps {
  onSubmit: (username: string, password: string) => Promise<void>;
  error: string | null;
}

// --------------------------------------------------
// TODO(Q6): ログインフォームコンポーネントを実装してください
//
// 【説明】
// ユーザー名とパスワードの入力フィールドを持つフォーム。
// 送信時に onSubmit コールバックを呼び出す。
//
// 【実装手順】
// 1. useState で username と password の状態を管理
// 2. handleSubmit 関数を実装:
//    - e.preventDefault() でフォームのデフォルト動作を防止
//    - setIsSubmitting(true) でボタンを無効化
//    - onSubmit(username, password) を呼び出す
//    - finally で setIsSubmitting(false) にする
// 3. JSX でフォームを返す（フォーム構造は提供済み）
//
// 【ヒント】
// - useState<string>('') で空文字列を初期値とする
// - FormEvent 型は import 済み
// - async/await + try/finally パターン
// --------------------------------------------------

export function LoginForm({ onSubmit, error }: LoginFormProps) {
  // TODO(Q6): username, password, isSubmitting の useState を定義してください
  const [username, setUsername] = undefined as any;
  const [password, setPassword] = undefined as any;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO(Q6): フォーム送信ハンドラを実装してください
  const handleSubmit = async (e: FormEvent) => {
    // ここに実装してください
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2 className="form__title">ログイン</h2>

      {/* エラーメッセージの表示 */}
      {error && <div className="form__error">{error}</div>}

      <div className="form__field">
        <label htmlFor="username" className="form__label">ユーザー名</label>
        <input
          id="username"
          type="text"
          className="form__input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          placeholder="user1"
        />
      </div>

      <div className="form__field">
        <label htmlFor="password" className="form__label">パスワード</label>
        <input
          id="password"
          type="password"
          className="form__input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="password1"
        />
      </div>

      <button
        type="submit"
        className="form__submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'ログイン中...' : 'ログイン'}
      </button>

      <p className="page__link-text">
        アカウントをお持ちでない方は
        <Link to="/register" className="page__link"> こちらから登録</Link>
      </p>
    </form>
  );
}
