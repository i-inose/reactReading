// ============================================================
// Timer.tsx ― カウントダウンタイマー
//
// 【このファイルで学べること】
// - useEffect + setInterval でカウントダウンを実装する
// - useEffect のクリーンアップで clearInterval する
// - コールバック Props による親コンポーネントへの通知
//
// 【04-realtime-chat との対応】
// chat には直接対応するコンポーネントはないが、
// useWebSocket の自動再接続タイマーと同じ考え方:
// setInterval を使い、useEffect のクリーンアップで解放する。
// ============================================================

import { useState, useEffect } from "react";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface TimerProps {
  seconds: number;           // カウントダウンの初期秒数
  onComplete: () => void;    // カウントが 0 になったときのコールバック
}

// --------------------------------------------------
// Timer コンポーネント
// --------------------------------------------------
export function Timer({ seconds, onComplete }: TimerProps) {
  // --------------------------------------------------
  // 【TODO(Q9)】useEffect + setInterval でカウントダウンを実装する
  //
  // ヒント: 04-realtime-chat の useWebSocket では
  // useEffect のクリーンアップで WebSocket を close していた。
  // ここでは setInterval のクリーンアップで clearInterval する。
  //
  // 実装すべきこと:
  // 1. useState で remaining（残り秒数）を管理する
  //    初期値は seconds props
  // 2. useEffect 内で:
  //    a. setInterval を 1000ms 間隔で設定する
  //    b. setInterval のコールバック内で:
  //       - remaining を -1 する（prev => prev - 1 パターン）
  //    c. クリーンアップ関数で clearInterval する
  //    d. 依存配列は空 [] にする
  // 3. 別の useEffect で remaining が 0 以下になったら onComplete を呼ぶ
  //    依存配列は [remaining, onComplete]
  //
  // 参考:
  //   useEffect(() => {
  //     const id = setInterval(() => { ... }, 1000);
  //     return () => clearInterval(id);
  //   }, []);
  // --------------------------------------------------
  void useState;    // TODO 実装後は不要（lint エラー回避用）
  void useEffect;   // TODO 実装後は不要（lint エラー回避用）
  const remaining = seconds; // ← useState + useEffect に置き換える

  // 残り秒数のフォーマット（例: "0:25"）
  const minutes = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const display = `${minutes}:${secs.toString().padStart(2, "0")}`;

  // プログレスバーの幅を計算する
  const progress = seconds > 0 ? (remaining / seconds) * 100 : 0;

  // onComplete を参照（lint 対策）
  void onComplete;

  return (
    <div className="timer">
      <div className="timer__display">{display}</div>
      <div className="timer__track">
        <div
          className="timer__fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="timer__label">次の質問まで</span>
    </div>
  );
}
