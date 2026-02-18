// ============================================================
// JoinPage.tsx ― ニックネーム入力ページ
//
// 【このファイルで学べること】
// - React Router の useNavigate によるプログラマティックな画面遷移
// - ページコンポーネントの責務（ルーティングとロジックの橋渡し）
// - コールバック Props を通じた親子間のデータの受け渡し
// ============================================================

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { JoinForm } from "../components/JoinForm";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface JoinPageProps {
  onJoin: (username: string) => void;   // 参加処理のコールバック
}

// --------------------------------------------------
// JoinPage コンポーネント
//
// 【useNavigate とは？】
// React Router が提供するフック。プログラムから画面遷移を実行する。
// Link コンポーネントはクリックで遷移するが、useNavigate は
// フォーム送信後などのタイミングで遷移したい場合に使う。
// --------------------------------------------------
export function JoinPage({ onJoin }: JoinPageProps) {
  const navigate = useNavigate();

  // ニックネーム入力後の処理
  const handleJoin = useCallback(
    (username: string) => {
      onJoin(username);
      // チャットページに遷移する
      navigate("/chat");
    },
    [onJoin, navigate]
  );

  return (
    <div className="join-page">
      <JoinForm onJoin={handleJoin} />
    </div>
  );
}
