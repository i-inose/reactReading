// ============================================================
// useVote.ts ― 投票ロジックを管理するカスタムフック
//
// 【このファイルで学べること】
// - useReducer で複雑な状態を管理するパターン
// - 複数のカスタムフックを組み合わせる方法
// - 判別共用体の型絞り込み（Type Narrowing）を switch 文で行う
// - useCallback による関数のメモ化
//
// 【04-realtime-chat との対応】
// chat では useChat フックが useWebSocket と useReducer を組み合わせていた。
// ここでは useVote フックが useConnection と useReducer を組み合わせる。
// ============================================================

import { useReducer, useCallback, useRef } from "react";
import { useConnection } from "./useConnection";
import type { VoteState, ServerEvent, ConnectionStatus } from "../types";

// --------------------------------------------------
// 投票アクションの判別共用体
//
// useReducer のアクション型を判別共用体で定義することで、
// dispatch 時に型安全にデータを渡せる
// --------------------------------------------------
type VoteAction =
  | { type: "SET_QUESTION"; payload: { id: number; text: string; options: string[] } }
  | { type: "ADD_VOTE"; payload: { optionIndex: number; username: string } }
  | { type: "SET_RESULT"; payload: { votes: number[]; totalVoters: number } }
  | { type: "SET_USERS"; payload: string[] }
  | { type: "SET_USERNAME"; payload: string }
  | { type: "MARK_VOTED" }
  | { type: "RESET_VOTE" };

// --------------------------------------------------
// 【TODO(Q5)】useReducer の初期状態を定義する
//
// ヒント: 04-realtime-chat では initialState を
// ChatState 型に合わせて定義していた。
// ここでは VoteState 型に合わせて定義する。
//
// VoteState の各フィールドの初期値:
//   question: null（質問がまだ来ていない）
//   votes: []（得票数の配列、空）
//   users: []（オンラインユーザー、空）
//   hasVoted: false（まだ投票していない）
//   username: null（まだ参加していない）
// --------------------------------------------------
const initialState: VoteState = undefined as any;
// ↑ ここを正しい初期状態オブジェクトに置き換える

// --------------------------------------------------
// Reducer 関数
//
// 【Reducer とは？】
// 現在の state と action を受け取り、新しい state を返す純粋関数。
// 状態の更新ロジックをコンポーネントの外に切り出せる。
// --------------------------------------------------
function voteReducer(state: VoteState, action: VoteAction): VoteState {
  switch (action.type) {
    case "SET_QUESTION":
      // 新しい質問が来たら、投票状態をリセットする
      return {
        ...state,
        question: {
          id: action.payload.id,
          text: action.payload.text,
          options: action.payload.options,
        },
        votes: new Array(action.payload.options.length).fill(0),
        hasVoted: false,
      };

    case "ADD_VOTE":
      // 特定の選択肢の得票数を +1 する
      return {
        ...state,
        votes: state.votes.map((count, i) =>
          i === action.payload.optionIndex ? count + 1 : count
        ),
      };

    case "SET_RESULT":
      // サーバーからの集計結果で上書きする
      return {
        ...state,
        votes: action.payload.votes,
      };

    case "SET_USERS":
      return { ...state, users: action.payload };

    case "SET_USERNAME":
      return { ...state, username: action.payload };

    case "MARK_VOTED":
      return { ...state, hasVoted: true };

    case "RESET_VOTE":
      return { ...state, hasVoted: false };

    default:
      return state;
  }
}

// --------------------------------------------------
// フックの戻り値の型
// --------------------------------------------------
interface UseVoteReturn {
  state: VoteState;
  status: ConnectionStatus;
  join: (username: string) => void;
  leave: () => void;
  vote: (optionIndex: number) => void;
}

// --------------------------------------------------
// useVote カスタムフック本体
// --------------------------------------------------
export function useVote(): UseVoteReturn {
  const [state, dispatch] = useReducer(voteReducer, initialState);

  // ユーザー名を ref で保持する（レンダリングに依存しない値）
  const usernameRef = useRef<string | null>(null);

  // --------------------------------------------------
  // 【TODO(Q6)】ServerEvent を受け取って適切な action を dispatch する
  //
  // ヒント: 04-realtime-chat の useChat では handleMessage 関数が
  // ServerMessage の type で switch して dispatch していた。
  // ここでも同じパターンで ServerEvent の type を判別する。
  //
  // 【判別共用体の型絞り込み（Type Narrowing）】
  // switch(event.type) で分岐すると、各 case ブロック内で
  // TypeScript が event の型を自動的に絞り込む。
  // 例: case "question" のブロック内では event.payload は
  //     { id: number; text: string; options: string[] } と推論される。
  //
  // 実装すべきこと:
  // 1. useCallback で handleEvent 関数を作成する
  // 2. 引数は (event: ServerEvent)
  // 3. switch(event.type) で分岐する:
  //    - "question" → dispatch({ type: "SET_QUESTION", payload: event.payload })
  //    - "vote"     → dispatch({ type: "ADD_VOTE", payload: event.payload })
  //    - "result"   → dispatch({ type: "SET_RESULT", payload: event.payload })
  //    - "users"    → dispatch({ type: "SET_USERS", payload: event.payload })
  // 4. 依存配列は空 [] にする
  // --------------------------------------------------
  const handleEvent = undefined as any;
  // ↑ ここを useCallback で実装する

  // useConnection フックと連携する
  const { status, connect, disconnect } = useConnection({
    onEvent: handleEvent ?? (() => {}),
    username: usernameRef.current,
  });

  // --------------------------------------------------
  // 投票に参加する
  // --------------------------------------------------
  const join = useCallback(
    (username: string) => {
      usernameRef.current = username;
      dispatch({ type: "SET_USERNAME", payload: username });
      connect();
    },
    [connect]
  );

  // --------------------------------------------------
  // 投票から退出する
  // --------------------------------------------------
  const leave = useCallback(() => {
    disconnect();
    usernameRef.current = null;
  }, [disconnect]);

  // --------------------------------------------------
  // 投票する
  // --------------------------------------------------
  const vote = useCallback(
    (optionIndex: number) => {
      if (state.hasVoted) return;
      if (!state.question) return;

      // 自分の投票を即座に反映する（楽観的更新）
      dispatch({
        type: "ADD_VOTE",
        payload: { optionIndex, username: usernameRef.current ?? "unknown" },
      });
      dispatch({ type: "MARK_VOTED" });
    },
    [state.hasVoted, state.question]
  );

  return {
    state,
    status,
    join,
    leave,
    vote,
  };
}
