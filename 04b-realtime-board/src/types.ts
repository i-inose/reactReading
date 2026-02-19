// ============================================================
// types.ts ― ボードアプリ全体で共有する型定義
//
// 【このファイルで学べること】
// - 判別共用体（Discriminated Union）による型安全なイベント設計
// - チャットアプリと同じパターンを「ボードイベント」に適用する
// - 接続状態を表すリテラル型のユニオン
// ============================================================

// --------------------------------------------------
// 付箋ノートのデータ型
// --------------------------------------------------
export interface StickyNote {
  id: string;
  text: string;
  x: number;       // ボード上の X 座標（px）
  y: number;       // ボード上の Y 座標（px）
  color: string;   // 背景色（CSS カラー値）
  author: string;  // 作成者のユーザー名
}

// --------------------------------------------------
// カーソル位置のデータ型
// --------------------------------------------------
export interface Cursor {
  username: string;
  x: number;
  y: number;
  color: string;   // カーソルの表示色
}

// --------------------------------------------------
// 接続状態
// チャットアプリの ConnectionStatus と同じパターン
// --------------------------------------------------
export type ConnectionStatus = "connecting" | "connected" | "disconnected";

// --------------------------------------------------
// ボードイベントの判別共用体
//
// 【判別共用体（Discriminated Union）とは？】
// 共通の type プロパティの値で型を判別する仕組み。
// チャットの ClientMessage / ServerMessage と同じパターンだが、
// ここではボード操作（追加・移動・削除・カーソル移動）に適用する。
// switch で type を分岐すると各 case で型が自動的に絞り込まれる。
// --------------------------------------------------
export type BoardEvent =
  | { type: "note_add"; note: StickyNote }
  | { type: "note_move"; noteId: string; x: number; y: number }
  | { type: "note_delete"; noteId: string }
  | { type: "cursor_move"; cursor: Cursor };

// --------------------------------------------------
// useReducer 用のアクション型（判別共用体）
// BoardEvent をそのまま dispatch する場合と、
// 内部的な状態変更を行う場合の両方を含む
// --------------------------------------------------
export type BoardAction =
  | { type: "ADD_NOTE"; payload: StickyNote }
  | { type: "MOVE_NOTE"; payload: { noteId: string; x: number; y: number } }
  | { type: "DELETE_NOTE"; payload: string }
  | { type: "UPDATE_CURSOR"; payload: Cursor }
  | { type: "SET_STATUS"; payload: ConnectionStatus }
  | { type: "REMOVE_OLDEST_FAKE_NOTE"; payload: string }
  | { type: "RESET" };

// --------------------------------------------------
// ボード全体の状態型
// --------------------------------------------------
export interface BoardState {
  notes: StickyNote[];
  cursors: Cursor[];
  status: ConnectionStatus;
}
