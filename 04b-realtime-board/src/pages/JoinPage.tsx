// ============================================================
// JoinPage.tsx ― ニックネーム入力ページ
//
// 【このファイルで学べること】
// - useNavigate によるプログラマティックな画面遷移（チャットと同じ）
// - useState でフォーム入力を管理する
// - コールバック Props を通じた親子間のデータ受け渡し
// ============================================================

import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface JoinPageProps {
  onJoin: (username: string) => void;
}

export function JoinPage({ onJoin }: JoinPageProps) {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim()) return;
      onJoin(name.trim());
      navigate("/board");
    },
    [name, onJoin, navigate]
  );

  return (
    <div className="join-page">
      <div className="join-page__card">
        <h1 className="join-page__title">Realtime Board</h1>
        <p className="join-page__desc">
          デジタルホワイトボードでリアルタイムにコラボレーション。
          ニックネームを入力して参加しましょう。
        </p>
        <form className="join-page__form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="join-page__input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ニックネームを入力..."
            maxLength={20}
            autoFocus
          />
          <button
            type="submit"
            className="join-page__btn"
            disabled={!name.trim()}
          >
            参加する
          </button>
        </form>
      </div>
    </div>
  );
}
