// ============================================================
// types.ts ― 投票アプリ全体で共有する型定義
//
// 【このファイルで学べること】
// - 判別共用体（Discriminated Union）による型安全なイベント設計
// - クライアント⇔サーバー間のイベントプロトコルの型定義
// - 接続状態を表すリテラル型のユニオン
//
// 【04-realtime-chat との対応】
// chat では ServerMessage / ClientMessage という名前だったが、
// ここでは ServerEvent / ClientEvent と呼ぶ。
// payload プロパティにデータをまとめることで、
// type と payload の2階層で構造化している。
// ============================================================

// --------------------------------------------------
// 接続状態を表す型
// UI で接続インジケーターを表示するために使う
// --------------------------------------------------
export type ConnectionStatus = "connecting" | "connected" | "disconnected";

// --------------------------------------------------
// 質問1件のデータ型
// --------------------------------------------------
export interface Question {
  id: number;         // 質問ID
  text: string;       // 質問文
  options: string[];  // 選択肢の配列
}

// --------------------------------------------------
// 投票状態の型（useReducer で管理する）
// --------------------------------------------------
export interface VoteState {
  question: Question | null;  // 現在表示中の質問
  votes: number[];            // 各選択肢の得票数
  users: string[];            // オンラインユーザー一覧
  hasVoted: boolean;          // 自分が投票済みかどうか
  username: string | null;    // 自分のユーザー名
}

// --------------------------------------------------
// サーバー → クライアントに送るイベント型
//
// 【TODO(Q1)】判別共用体（Discriminated Union）を定義する
//
// ヒント: 04-realtime-chat の ServerMessage と同じパターン。
// 共通プロパティ type の値で型を判別する。
// ここでは payload プロパティにデータをまとめている。
//
// 4つのバリアントがある:
//   - "question": 新しい質問が配信された
//     payload: { id: number; text: string; options: string[] }
//   - "vote": 誰かが投票した
//     payload: { optionIndex: number; username: string }
//   - "result": 集計結果の更新
//     payload: { votes: number[]; totalVoters: number }
//   - "users": オンラインユーザー一覧の更新
//     payload: string[]
// --------------------------------------------------
export type ServerEvent = undefined as any;
// ↑ ここを正しい判別共用体に置き換える

// --------------------------------------------------
// クライアント → サーバーに送るイベント型
//
// 【TODO(Q2)】判別共用体（Discriminated Union）を定義する
//
// ヒント: ServerEvent と同じパターンだが、クライアント側から送る2種類。
//
// 2つのバリアントがある:
//   - "join": ユーザーが参加した
//     payload: { username: string }
//   - "vote": ユーザーが投票した
//     payload: { questionId: number; optionIndex: number }
// --------------------------------------------------
export type ClientEvent = undefined as any;
// ↑ ここを正しい判別共用体に置き換える
