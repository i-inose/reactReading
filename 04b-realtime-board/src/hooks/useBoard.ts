// ============================================================
// useBoard.ts ― ボードのロジックを管理するカスタムフック
//
// 【このファイルで学べること】
// - useReducer で複雑な状態を管理するパターン（チャットの useChat と同じ）
// - 複数のカスタムフックを組み合わせる方法
// - デバウンスを使ったカーソル位置更新の制御
// - useCallback による関数のメモ化
// ============================================================

import { useReducer, useCallback, useRef, useEffect } from "react";
import { useConnection } from "./useConnection.ts";
import type {
  BoardState,
  BoardAction,
  BoardEvent,
  StickyNote,
  ConnectionStatus,
  Cursor,
} from "../types";

// --------------------------------------------------
// 初期状態
// --------------------------------------------------
const initialState: BoardState = {
  notes: [],
  cursors: [],
  status: "disconnected",
};

// --------------------------------------------------
// Reducer 関数
//
// チャットの chatReducer と同じパターン。
// action.type で分岐し、新しい状態を返す純粋関数。
// --------------------------------------------------
function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "ADD_NOTE":
      return { ...state, notes: [...state.notes, action.payload] };

    case "MOVE_NOTE":
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.noteId
            ? { ...note, x: action.payload.x, y: action.payload.y }
            : note
        ),
      };

    case "DELETE_NOTE":
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload),
      };

    case "UPDATE_CURSOR": {
      const existing = state.cursors.findIndex(
        (c) => c.username === action.payload.username
      );
      if (existing >= 0) {
        const newCursors = [...state.cursors];
        newCursors[existing] = action.payload;
        return { ...state, cursors: newCursors };
      }
      return { ...state, cursors: [...state.cursors, action.payload] };
    }

    case "REMOVE_OLDEST_FAKE_NOTE":
      // 指定ユーザーの最も古いノートを削除する
      return {
        ...state,
        notes: state.notes.filter((n) => n.id !== action.payload),
      };

    case "SET_STATUS":
      return { ...state, status: action.payload };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

// --------------------------------------------------
// フックの戻り値の型
// --------------------------------------------------
interface UseBoardReturn {
  notes: StickyNote[];
  cursors: Cursor[];
  status: ConnectionStatus;
  connectedUsers: string[];
  username: string | null;
  join: (username: string) => void;
  leave: () => void;
  addNote: (text: string, color: string) => void;
  moveNote: (noteId: string, x: number, y: number) => void;
  deleteNote: (noteId: string) => void;
  handleCursorMove: (x: number, y: number) => void;
}

// デバウンス間隔（ミリ秒）
const CURSOR_DEBOUNCE_MS = 50;

// --------------------------------------------------
// useBoard カスタムフック本体
// --------------------------------------------------
export function useBoard(): UseBoardReturn {
  const [state, dispatch] = useReducer(boardReducer, initialState);
  const usernameRef = useRef<string | null>(null);
  const cursorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --------------------------------------------------
  // ボードイベントを処理するコールバック
  //
  // 【判別共用体の活用】
  // チャットの handleMessage と同じパターン。
  // event.type で switch 分岐すると、各 case 内で
  // TypeScript が event の型を自動的に絞り込む。
  // --------------------------------------------------
  const handleEvent = useCallback((event: BoardEvent) => {
    switch (event.type) {
      case "note_add":
        dispatch({ type: "ADD_NOTE", payload: event.note });
        break;
      case "note_move":
        dispatch({
          type: "MOVE_NOTE",
          payload: { noteId: event.noteId, x: event.x, y: event.y },
        });
        break;
      case "note_delete":
        dispatch({ type: "DELETE_NOTE", payload: event.noteId });
        break;
      case "cursor_move":
        dispatch({ type: "UPDATE_CURSOR", payload: event.cursor });
        break;
    }
  }, []);

  // useConnection フックと連携する
  const { status, connect, disconnect, connectedUsers } = useConnection({
    onEvent: handleEvent,
    currentNotes: state.notes,
  });

  // 接続状態を同期する
  useEffect(() => {
    dispatch({ type: "SET_STATUS", payload: status });
  }, [status]);

  const noteIdCounter = useRef(0);

  // --------------------------------------------------
  // ボードに参加する
  // --------------------------------------------------
  const join = useCallback(
    (username: string) => {
      usernameRef.current = username;
      connect();
    },
    [connect]
  );

  // --------------------------------------------------
  // ボードから退出する
  // --------------------------------------------------
  const leave = useCallback(() => {
    disconnect();
    usernameRef.current = null;
    dispatch({ type: "RESET" });
  }, [disconnect]);

  // --------------------------------------------------
  // ノートを追加する
  // --------------------------------------------------
  const addNote = useCallback((text: string, color: string) => {
    if (!text.trim() || !usernameRef.current) return;
    noteIdCounter.current += 1;
    const note: StickyNote = {
      id: `user-${noteIdCounter.current}-${Date.now()}`,
      text: text.trim(),
      x: Math.floor(Math.random() * 500) + 100,
      y: Math.floor(Math.random() * 300) + 100,
      color,
      author: usernameRef.current,
    };
    dispatch({ type: "ADD_NOTE", payload: note });
  }, []);

  // --------------------------------------------------
  // ノートを移動する
  // --------------------------------------------------
  const moveNote = useCallback((noteId: string, x: number, y: number) => {
    dispatch({ type: "MOVE_NOTE", payload: { noteId, x, y } });
  }, []);

  // --------------------------------------------------
  // ノートを削除する
  // --------------------------------------------------
  const deleteNote = useCallback((noteId: string) => {
    dispatch({ type: "DELETE_NOTE", payload: noteId });
  }, []);

  // --------------------------------------------------
  // カーソル位置を更新する（デバウンス付き）
  //
  // 【デバウンスとは？】
  // 連続する呼び出しをまとめて、最後の呼び出しから一定時間後に
  // 処理を実行する技法。マウス移動イベントは高頻度で発火するため、
  // デバウンスで更新頻度を制限する（チャットの typing 通知と同じ考え方）。
  // --------------------------------------------------
  const handleCursorMove = useCallback((x: number, y: number) => {
    if (!usernameRef.current) return;

    if (cursorTimerRef.current) {
      clearTimeout(cursorTimerRef.current);
    }

    cursorTimerRef.current = setTimeout(() => {
      if (usernameRef.current) {
        dispatch({
          type: "UPDATE_CURSOR",
          payload: {
            username: usernameRef.current,
            x,
            y,
            color: "#ff6b00",
          },
        });
      }
    }, CURSOR_DEBOUNCE_MS);
  }, []);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (cursorTimerRef.current) clearTimeout(cursorTimerRef.current);
    };
  }, []);

  return {
    notes: state.notes,
    cursors: state.cursors,
    status: state.status,
    connectedUsers,
    username: usernameRef.current,
    join,
    leave,
    addNote,
    moveNote,
    deleteNote,
    handleCursorMove,
  };
}
