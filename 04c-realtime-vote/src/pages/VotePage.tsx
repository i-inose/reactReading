// ============================================================
// VotePage.tsx ― メイン投票画面
//
// 【このファイルで学べること】
// - 複数のコンポーネントを組み合わせた画面構成（コンポジション）
// - カスタムフックを使ったロジックと UI の分離
// - 条件付きレンダリングによる接続状態別の画面表示
// - useNavigate で未認証ユーザーをリダイレクトする
//
// 【04-realtime-chat との対応】
// chat の ChatPage.tsx と同じ構成パターン。
// 接続状態（connecting / connected / disconnected）に応じて
// 表示内容を切り替える。
// ============================================================

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionCard } from "../components/QuestionCard";
import { UserList } from "../components/UserList";
import { Timer } from "../components/Timer";
import type { useVote } from "../hooks/useVote";
import type { ConnectionStatus } from "../types";

// --------------------------------------------------
// Props の型定義
// useVote の戻り値をそのまま受け取る
//
// 【ReturnType<typeof fn>】
// 関数の戻り値の型を取得するユーティリティ型。
// useVote の戻り値の型を手動で書き直す必要がなくなる。
// --------------------------------------------------
type VotePageProps = ReturnType<typeof useVote>;

// --------------------------------------------------
// 質問のサイクル時間（秒）
// Timer コンポーネントに渡す
// --------------------------------------------------
const QUESTION_DURATION_SECONDS = 30;

// --------------------------------------------------
// VotePage コンポーネント
// --------------------------------------------------
export function VotePage({ state, status, join, leave, vote }: VotePageProps) {
  const navigate = useNavigate();

  // 自分が選択した選択肢のインデックスを保持する
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // タイマーのリセット用キー（質問が変わるたびに更新）
  const [timerKey, setTimerKey] = useState(0);

  // --------------------------------------------------
  // 未認証ユーザーのリダイレクト
  // ユーザー名がなければ参加ページに戻す
  // --------------------------------------------------
  useEffect(() => {
    if (!state.username) {
      navigate("/");
    }
  }, [state.username, navigate]);

  // 質問が変わったらタイマーをリセットし、選択状態をクリアする
  useEffect(() => {
    setSelectedIndex(null);
    setTimerKey((prev) => prev + 1);
  }, [state.question?.id]);

  // 投票ハンドラ
  const handleVote = useCallback(
    (optionIndex: number) => {
      setSelectedIndex(optionIndex);
      vote(optionIndex);
    },
    [vote]
  );

  // タイマー完了時のハンドラ（次の質問へ）
  const handleTimerComplete = useCallback(() => {
    // 接続を維持したまま次の質問を待つ
    // （useConnection 側で自動的に次の質問が配信される）
  }, []);

  // ユーザー名がない場合は何も表示しない
  if (!state.username) return null;

  // --------------------------------------------------
  // 【TODO(Q10)】接続状態に応じた条件付きレンダリング
  //
  // ヒント: 04-realtime-chat の ChatPage.tsx では
  // status === "connected" で接続中かどうかを判定し、
  // 条件付きで UI を表示していた。
  // ここでは3つの状態で表示を切り替える。
  //
  // 実装すべきこと:
  // 1. status の値に応じて異なる UI を返す:
  //
  //    a. "connecting" の場合:
  //       - ローディングスピナーを表示する
  //       - "接続中..." テキスト
  //       - CSS クラス: "vote-page__loading"
  //
  //    b. "connected" の場合:
  //       - Timer コンポーネント（key={timerKey}, seconds={QUESTION_DURATION_SECONDS}）
  //       - state.question が存在すれば QuestionCard を表示
  //       - UserList を表示（state.users, state.username）
  //       - 退出ボタン（onClick で leave() を呼ぶ）
  //
  //    c. "disconnected" の場合:
  //       - "切断されました" テキスト
  //       - "再接続" ボタン（onClick で join(state.username) を呼ぶ）
  //       - CSS クラス: "vote-page__disconnected"
  //
  // 2. renderContent 関数を定義し、switch(status) で分岐する
  //
  // 参考: ChatPage.tsx の条件付きレンダリングパターン
  //   const isConnected = status === "connected";
  // --------------------------------------------------
  const renderContent = (_status: ConnectionStatus): React.ReactNode => {
    // ↑ この関数の中身を実装する
    void _status;
    void handleVote;
    void handleTimerComplete;
    void timerKey;
    void selectedIndex;
    void join;
    void leave;
    void QuestionCard;
    void UserList;
    void Timer;
    void QUESTION_DURATION_SECONDS;
    return null;
  };

  return (
    <div className="vote-page">
      <header className="vote-page__header">
        <h1 className="vote-page__title">リアルタイム投票</h1>
        <span className="vote-page__user">
          {state.username} でログイン中
        </span>
      </header>

      <main className="vote-page__body">
        {renderContent(status)}
      </main>
    </div>
  );
}
