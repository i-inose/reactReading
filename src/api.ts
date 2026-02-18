// ============================================================
// api.ts ― バックエンド API との通信を担当するモジュール
// React コンポーネントから直接 fetch を書くと複雑になるので、
// API 呼び出しを関数として切り出すのがベストプラクティス
// ============================================================

// 型定義ファイルからインポートする
import type { Task, CreateTaskInput, ApiResponse } from "./types";

// --------------------------------------------------
// API のベース URL
// 開発環境では FastAPI サーバーが 3001 番で起動する
// --------------------------------------------------
const BASE_URL = "http://localhost:3001/api";

// --------------------------------------------------
// 全タスクを取得する（GET）
// async/await で非同期通信を行い、型安全に結果を返す
// --------------------------------------------------
export async function fetchTasks(): Promise<Task[]> {
  // fetch はブラウザ標準の HTTP 通信 API
  const response = await fetch(`${BASE_URL}/tasks`);

  // レスポンスが正常でなければエラーを投げる
  if (!response.ok) {
    throw new Error(`タスクの取得に失敗しました: ${response.status}`);
  }

  // JSON をパースして ApiResponse<Task[]> として取り出す
  const result: ApiResponse<Task[]> = await response.json();

  // data プロパティにタスク配列が入っている
  return result.data;
}

// --------------------------------------------------
// 新しいタスクを作成する（POST）
// リクエストボディに JSON を送る
// --------------------------------------------------
export async function createTask(input: CreateTaskInput): Promise<Task> {
  const response = await fetch(`${BASE_URL}/tasks`, {
    // POST メソッドを指定する
    method: "POST",

    // JSON を送ることをサーバーに伝えるヘッダー
    headers: { "Content-Type": "application/json" },

    // JavaScript オブジェクトを JSON 文字列に変換して送る
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`タスクの作成に失敗しました: ${response.status}`);
  }

  const result: ApiResponse<Task> = await response.json();
  return result.data;
}

// --------------------------------------------------
// タスクの完了状態を切り替える（PATCH）
// 既存リソースの一部だけ更新するときは PATCH を使う
// --------------------------------------------------
export async function toggleTask(id: number): Promise<Task> {
  const response = await fetch(`${BASE_URL}/tasks/${id}/toggle`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error(`タスクの更新に失敗しました: ${response.status}`);
  }

  const result: ApiResponse<Task> = await response.json();
  return result.data;
}

// --------------------------------------------------
// タスクを削除する（DELETE）
// --------------------------------------------------
export async function deleteTask(id: number): Promise<void> {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`タスクの削除に失敗しました: ${response.status}`);
  }
}
