// ============================================================
// useConnection.ts ― 擬似リアルタイム接続を管理するカスタムフック
//
// 【このファイルで学べること】
// - useRef でタイマーID やコールバックを保持するパターン
// - useEffect + setInterval でポーリング的な処理を実装する
// - useEffect のクリーンアップでリソースを解放する
// - ConnectionStatus による接続状態の管理
//
// 【04-realtime-chat との対応】
// chat では useWebSocket フックが WebSocket 接続を管理していた。
// ここでは WebSocket の代わりに setInterval でフェイク投票を
// 定期的に生成し、「リアルタイム風」の動作をシミュレートする。
// ============================================================

import { useState, useRef, useCallback, useEffect } from "react";
import type { ServerEvent } from "../types";
import { FAKE_USERS } from "../data/fakeUsers";
import { QUESTIONS } from "../data/questions";

// --------------------------------------------------
// フックの引数の型
// --------------------------------------------------
interface UseConnectionOptions {
  onEvent: (event: ServerEvent) => void;  // イベント受信時のコールバック
  username: string | null;                // 参加しているユーザー名
}

// --------------------------------------------------
// フックの戻り値の型
// --------------------------------------------------
interface UseConnectionReturn {
  status: ConnectionStatus;   // 接続状態
  connect: () => void;        // 接続開始
  disconnect: () => void;     // 切断
}

// ConnectionStatus 型を直接インポートする代わりにここで使う
import type { ConnectionStatus } from "../types";

// --------------------------------------------------
// シミュレーション設定
// --------------------------------------------------
const CONNECTION_DELAY_MS = 500;           // 接続シミュレーションの遅延
const MIN_VOTE_INTERVAL_MS = 1000;         // フェイク投票の最小間隔
const MAX_VOTE_INTERVAL_MS = 3000;         // フェイク投票の最大間隔
const QUESTION_CYCLE_MS = 30000;           // 質問の切り替え間隔（30秒）

// --------------------------------------------------
// ランダムな整数を返すヘルパー
// --------------------------------------------------
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --------------------------------------------------
// useConnection カスタムフック本体
//
// 【setInterval でリアルタイムをシミュレートする】
// 実際のアプリでは WebSocket でサーバーからイベントを受信するが、
// ここではバックエンドなしで学習するため、setInterval を使って
// フェイクユーザーからのランダムな投票イベントを定期的に生成する。
// --------------------------------------------------
export function useConnection({ onEvent, username }: UseConnectionOptions): UseConnectionReturn {
  // 接続状態を管理する state
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");

  // --------------------------------------------------
  // useRef でミュータブルな値を保持する
  //
  // 【なぜ useRef を使うのか？】
  // useState と違い、useRef の値を変更しても再レンダリングが起きない。
  // タイマー ID やコールバック関数など、レンダリングに影響しない値に適する。
  // また、useRef の値はコールバック内から常に最新値を参照できる。
  // --------------------------------------------------
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;

  const currentQuestionIndexRef = useRef(0);
  const connectionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --------------------------------------------------
  // 【TODO(Q3)】setInterval でフェイク投票を定期生成する
  //
  // ヒント: 04-realtime-chat の useWebSocket では WebSocket の
  // onmessage でサーバーからのイベントを受信していた。
  // ここでは setInterval を使って同様の「イベント受信」を
  // シミュレートする。
  //
  // 実装すべきこと:
  // 1. intervalId を保持する useRef を作成する
  //    （型: ReturnType<typeof setInterval> | null）
  // 2. startSimulation 関数を実装する:
  //    a. 現在の質問を QUESTIONS 配列から取得する
  //    b. onEventRef.current を使って "question" イベントを発火する
  //    c. onEventRef.current を使って "users" イベントを発火する
  //       （自分 + ランダムなフェイクユーザー数名）
  //    d. setInterval で 1〜3秒ごとにフェイク投票を生成する:
  //       - FAKE_USERS からランダムにユーザーを選ぶ
  //       - 現在の質問の選択肢からランダムにインデックスを選ぶ
  //       - "vote" ServerEvent を発火する
  //       - "result" ServerEvent を発火する（累積得票数を計算）
  //    e. intervalId を ref に保存する
  //    f. QUESTION_CYCLE_MS 後に次の質問に切り替える setTimeout を設定する
  //
  // 型の参考:
  //   const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // --------------------------------------------------
  const intervalRef = undefined as any;   // ← useRef に置き換える
  const questionTimerRef = undefined as any;  // ← useRef に置き換える

  const startSimulation = undefined as any;
  // ↑ この関数を実装する（useCallback で囲む）

  // --------------------------------------------------
  // 接続を開始する
  // CONNECTION_DELAY_MS 後に "connected" に遷移し、シミュレーション開始
  // --------------------------------------------------
  const connect = useCallback(() => {
    if (status === "connected" || status === "connecting") return;

    setStatus("connecting");

    // 接続シミュレーション: 少し遅延させてから接続完了にする
    connectionTimerRef.current = setTimeout(() => {
      setStatus("connected");
      // startSimulation を呼ぶ
      if (startSimulation) {
        startSimulation();
      }
    }, CONNECTION_DELAY_MS);
  }, [status, startSimulation]);

  // --------------------------------------------------
  // 【TODO(Q4)】useEffect のクリーンアップでリソースを解放する
  //
  // ヒント: 04-realtime-chat の useWebSocket では useEffect の
  // クリーンアップ関数で WebSocket を close していた。
  // ここでは setInterval と setTimeout をクリアする。
  //
  // 実装すべきこと:
  // 1. useEffect を使い、クリーンアップ関数を返す
  // 2. クリーンアップ関数内で:
  //    a. intervalRef.current が存在すれば clearInterval する
  //    b. questionTimerRef.current が存在すれば clearTimeout する
  //    c. connectionTimerRef.current が存在すれば clearTimeout する
  // 3. 依存配列は空 [] にする（マウント/アンマウント時のみ実行）
  // --------------------------------------------------
  // ここに useEffect を書く

  // --------------------------------------------------
  // 切断する
  // --------------------------------------------------
  const disconnect = useCallback(() => {
    // タイマーをすべてクリアする
    if (intervalRef?.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (questionTimerRef?.current) {
      clearTimeout(questionTimerRef.current);
      questionTimerRef.current = null;
    }
    if (connectionTimerRef.current) {
      clearTimeout(connectionTimerRef.current);
      connectionTimerRef.current = null;
    }
    setStatus("disconnected");
  }, []);

  return { status, connect, disconnect };
}
