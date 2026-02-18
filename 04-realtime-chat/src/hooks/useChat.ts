// ============================================================
// useChat.ts ― チャットロジックを管理するカスタムフック
//
// 【このファイルで学べること】
// - useReducer で複雑な状態を管理するパターン
// - 複数のカスタムフックを組み合わせる方法
// - デバウンスを使った入力中表示の制御
// - useCallback による関数のメモ化
// ============================================================

import { useReducer, useCallback, useRef, useEffect } from "react";
import { useWebSocket } from "./useWebSocket";
import type {
  ChatMessage,
  RoomName,
  ServerMessage,
  ConnectionStatus,
} from "../types";

// --------------------------------------------------
// チャットの状態を表す型
// --------------------------------------------------
interface ChatState {
  messages: ChatMessage[];   // 現在のルームのメッセージ一覧
  users: string[];           // オンラインユーザー一覧
  typingUsers: string[];     // 入力中のユーザー一覧
  currentRoom: RoomName;     // 現在のルーム
}

// --------------------------------------------------
// チャットアクションの判別共用体
//
// useReducer のアクション型を判別共用体で定義することで、
// dispatch 時に型安全にデータを渡せる
// --------------------------------------------------
type ChatAction =
  | { type: "SET_MESSAGES"; payload: ChatMessage[] }
  | { type: "ADD_MESSAGE"; payload: ChatMessage }
  | { type: "SET_USERS"; payload: string[] }
  | { type: "ADD_TYPING_USER"; payload: string }
  | { type: "REMOVE_TYPING_USER"; payload: string }
  | { type: "CHANGE_ROOM"; payload: RoomName }
  | { type: "CLEAR_MESSAGES" };

// 初期状態
const initialState: ChatState = {
  messages: [],
  users: [],
  typingUsers: [],
  currentRoom: "general",
};

// --------------------------------------------------
// Reducer 関数
//
// 【Reducer とは？】
// 現在の state と action を受け取り、新しい state を返す純粋関数。
// 状態の更新ロジックをコンポーネントの外に切り出せる。
// --------------------------------------------------
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };

    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };

    case "SET_USERS":
      return { ...state, users: action.payload };

    case "ADD_TYPING_USER":
      // 既に含まれていなければ追加する
      if (state.typingUsers.includes(action.payload)) return state;
      return { ...state, typingUsers: [...state.typingUsers, action.payload] };

    case "REMOVE_TYPING_USER":
      return {
        ...state,
        typingUsers: state.typingUsers.filter((u) => u !== action.payload),
      };

    case "CHANGE_ROOM":
      // ルーム変更時にメッセージとユーザー一覧をクリアする
      return {
        ...state,
        currentRoom: action.payload,
        messages: [],
        users: [],
        typingUsers: [],
      };

    case "CLEAR_MESSAGES":
      return { ...state, messages: [] };

    default:
      return state;
  }
}

// --------------------------------------------------
// フックの戻り値の型
// --------------------------------------------------
interface UseChatReturn {
  messages: ChatMessage[];
  users: string[];
  typingUsers: string[];
  currentRoom: RoomName;
  username: string | null;
  status: ConnectionStatus;
  join: (username: string) => void;
  leave: () => void;
  sendChatMessage: (message: string) => void;
  changeRoom: (room: RoomName) => void;
  notifyTyping: () => void;
}

// --------------------------------------------------
// 入力中表示のタイムアウト（ミリ秒）
// この時間が経過すると入力中表示が消える
// --------------------------------------------------
const TYPING_TIMEOUT_MS = 3000;

// --------------------------------------------------
// useChat カスタムフック本体
// --------------------------------------------------
export function useChat(): UseChatReturn {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // ユーザー名を ref で保持する（レンダリングに依存しない値）
  const usernameRef = useRef<string | null>(null);
  // 入力中ユーザーのタイムアウトを管理する Map
  const typingTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // --------------------------------------------------
  // サーバーからのメッセージを処理するコールバック
  //
  // 【判別共用体のメリット】
  // switch で message.type を分岐すると、各 case 内で TypeScript が
  // message の型を自動的に絞り込む。例: case "chat" では
  // message.username や message.message にアクセスできる。
  // --------------------------------------------------
  const handleMessage = useCallback((message: ServerMessage) => {
    switch (message.type) {
      case "chat":
        dispatch({
          type: "ADD_MESSAGE",
          payload: {
            username: message.username,
            message: message.message,
            timestamp: message.timestamp,
            isSystem: message.isSystem,
          },
        });
        break;

      case "users":
        dispatch({ type: "SET_USERS", payload: message.users });
        break;

      case "typing": {
        const typer = message.username;
        // 自分自身の入力中通知は無視する
        if (typer === usernameRef.current) break;

        dispatch({ type: "ADD_TYPING_USER", payload: typer });

        // --------------------------------------------------
        // デバウンス: 一定時間操作がなければ入力中表示を消す
        //
        // 【デバウンスとは？】
        // 連続する操作をまとめて、最後の操作から一定時間後に
        // 処理を実行する技法。入力中通知が来るたびにタイマーを
        // リセットし、タイムアウトしたら表示を消す。
        // --------------------------------------------------
        const existingTimer = typingTimersRef.current.get(typer);
        if (existingTimer) clearTimeout(existingTimer);

        const timer = setTimeout(() => {
          dispatch({ type: "REMOVE_TYPING_USER", payload: typer });
          typingTimersRef.current.delete(typer);
        }, TYPING_TIMEOUT_MS);

        typingTimersRef.current.set(typer, timer);
        break;
      }

      case "room_history":
        dispatch({ type: "SET_MESSAGES", payload: message.messages });
        break;
    }
  }, []);

  // useWebSocket フックと連携する
  const { status, connect, disconnect, sendMessage } = useWebSocket({
    onMessage: handleMessage,
  });

  // --------------------------------------------------
  // ルームに参加する
  // --------------------------------------------------
  const join = useCallback(
    (username: string) => {
      usernameRef.current = username;
      connect();

      // 接続完了後にサーバーに join メッセージを送る
      // WebSocket の接続は非同期なので、少し遅延させる
      setTimeout(() => {
        sendMessage({
          type: "join",
          username,
          room: initialState.currentRoom,
        });
      }, 500);
    },
    [connect, sendMessage]
  );

  // --------------------------------------------------
  // ルームから退出する
  // --------------------------------------------------
  const leave = useCallback(() => {
    sendMessage({ type: "leave", room: state.currentRoom });
    disconnect();
    usernameRef.current = null;
    dispatch({ type: "CLEAR_MESSAGES" });
  }, [disconnect, sendMessage, state.currentRoom]);

  // --------------------------------------------------
  // チャットメッセージを送信する
  // --------------------------------------------------
  const sendChatMessage = useCallback(
    (message: string) => {
      if (message.trim() === "") return;
      sendMessage({ type: "chat", message });
    },
    [sendMessage]
  );

  // --------------------------------------------------
  // ルームを変更する
  // --------------------------------------------------
  const changeRoom = useCallback(
    (room: RoomName) => {
      if (room === state.currentRoom) return;

      // 現在のルームから退出する
      sendMessage({ type: "leave", room: state.currentRoom });

      // 状態をリセットする
      dispatch({ type: "CHANGE_ROOM", payload: room });

      // 新しいルームに参加する
      if (usernameRef.current) {
        sendMessage({
          type: "join",
          username: usernameRef.current,
          room,
        });
      }
    },
    [sendMessage, state.currentRoom]
  );

  // --------------------------------------------------
  // 入力中通知を送信する
  // --------------------------------------------------
  const notifyTyping = useCallback(() => {
    sendMessage({ type: "typing" });
  }, [sendMessage]);

  // --------------------------------------------------
  // クリーンアップ: タイマーを全て解除する
  // --------------------------------------------------
  useEffect(() => {
    return () => {
      typingTimersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return {
    messages: state.messages,
    users: state.users,
    typingUsers: state.typingUsers,
    currentRoom: state.currentRoom,
    username: usernameRef.current,
    status,
    join,
    leave,
    sendChatMessage,
    changeRoom,
    notifyTyping,
  };
}
