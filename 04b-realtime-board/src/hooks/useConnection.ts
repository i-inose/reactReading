// ============================================================
// useConnection.ts ― シミュレーション接続を管理するカスタムフック
//
// 【このファイルで学べること】
// - useRef でタイマー ID を保持するパターン（チャットの wsRef と同じ）
// - setInterval によるリアルタイムイベントのシミュレーション
// - useEffect のクリーンアップでリソースを解放する
// - useCallback でコールバックをメモ化する
// ============================================================

import { useState, useRef, useCallback, useEffect } from "react";
import type { ConnectionStatus, BoardEvent, StickyNote } from "../types";
import { FAKE_USERS } from "../data/fakeUsers.ts";
import { NOTE_COLORS } from "../data/noteColors.ts";

interface UseConnectionOptions {
  onEvent: (event: BoardEvent) => void;   // イベント受信時のコールバック
  currentNotes: StickyNote[];             // 現在のノート一覧（移動対象の選択用）
}

interface UseConnectionReturn {
  status: ConnectionStatus;
  connect: () => void;
  disconnect: () => void;
  connectedUsers: string[];
}

// シミュレーション間隔（ミリ秒）
const SIMULATION_INTERVAL_MS = 2500;
// 接続シミュレーションの遅延（ミリ秒）
const CONNECTION_DELAY_MS = 800;
// ボード上のノート最大数
const MAX_NOTES = 20;

// ユーザーごとのカーソル色
const CURSOR_COLORS = ["#e53935", "#1e88e5", "#43a047", "#fb8c00", "#8e24aa"];

let noteIdCounter = 0;
function generateNoteId(): string {
  noteIdCounter += 1;
  return `fake-${noteIdCounter}-${Date.now()}`;
}

// --------------------------------------------------
// useConnection カスタムフック本体
//
// チャットアプリの useWebSocket に対応する。
// WebSocket の代わりに setInterval でイベントを生成する。
// --------------------------------------------------
export function useConnection({ onEvent, currentNotes }: UseConnectionOptions): UseConnectionReturn {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);

  // 【useRef でタイマー ID を保持する】
  // チャットの wsRef / reconnectTimerRef と同じパターン。
  // レンダリングに影響しない値を保持するのに useRef を使う。
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const connectionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onEventRef = useRef(onEvent);
  onEventRef.current = onEvent;
  const currentNotesRef = useRef(currentNotes);
  currentNotesRef.current = currentNotes;

  // ランダムなボードイベントを生成する
  const generateRandomEvent = useCallback((): BoardEvent | null => {
    const notes = currentNotesRef.current;
    const fakeUserSet: ReadonlySet<string> = new Set(FAKE_USERS);
    const fakeNotes = notes.filter((n) => fakeUserSet.has(n.author));
    const user = FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)];
    const action = Math.random();

    // ノートが多すぎる場合は古いものを削除
    if (fakeNotes.length >= MAX_NOTES) {
      return { type: "note_delete", noteId: fakeNotes[0].id };
    }

    if (action < 0.4 || fakeNotes.length === 0) {
      // 新しいノートを追加
      const messages = [
        "いいアイデア！", "TODO: 確認", "要検討", "OK!",
        "ここ修正", "完了", "質問あり", "承認済み",
        "要レビュー", "次回議論", "優先度高", "メモ",
      ];
      const color = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)].value;
      const note: StickyNote = {
        id: generateNoteId(),
        text: messages[Math.floor(Math.random() * messages.length)],
        x: Math.floor(Math.random() * 700) + 50,
        y: Math.floor(Math.random() * 400) + 50,
        color,
        author: user,
      };
      return { type: "note_add", note };
    } else if (action < 0.7 && fakeNotes.length > 0) {
      // 既存のノートを移動
      const target = fakeNotes[Math.floor(Math.random() * fakeNotes.length)];
      return {
        type: "note_move",
        noteId: target.id,
        x: Math.floor(Math.random() * 700) + 50,
        y: Math.floor(Math.random() * 400) + 50,
      };
    } else {
      // カーソルを移動
      const userIndex = FAKE_USERS.indexOf(user);
      return {
        type: "cursor_move",
        cursor: {
          username: user,
          x: Math.floor(Math.random() * 800) + 20,
          y: Math.floor(Math.random() * 500) + 20,
          color: CURSOR_COLORS[userIndex] || "#999",
        },
      };
    }
  }, []);

  // --------------------------------------------------
  // 接続を開始する
  // チャットの connect() に対応。800ms の遅延で接続シミュレーション。
  // --------------------------------------------------
  const connect = useCallback(() => {
    if (status === "connected" || status === "connecting") return;

    setStatus("connecting");

    // 接続シミュレーション: 800ms 後に connected にする
    connectionTimerRef.current = setTimeout(() => {
      setStatus("connected");
      setConnectedUsers([...FAKE_USERS]);

      // setInterval でランダムイベントを定期的に発火する
      intervalRef.current = setInterval(() => {
        const event = generateRandomEvent();
        if (event) {
          onEventRef.current(event);
        }
      }, SIMULATION_INTERVAL_MS);
    }, CONNECTION_DELAY_MS);
  }, [status, generateRandomEvent]);

  // --------------------------------------------------
  // 接続を切断する
  // --------------------------------------------------
  const disconnect = useCallback(() => {
    if (connectionTimerRef.current) {
      clearTimeout(connectionTimerRef.current);
      connectionTimerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setStatus("disconnected");
    setConnectedUsers([]);
  }, []);

  // 【useEffect のクリーンアップ】
  // アンマウント時にタイマーを解放する（チャットと同じパターン）
  useEffect(() => {
    return () => {
      if (connectionTimerRef.current) clearTimeout(connectionTimerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { status, connect, disconnect, connectedUsers };
}
