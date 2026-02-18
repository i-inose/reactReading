// ============================================================
// UserList.tsx ― オンラインユーザー一覧のサイドバー
//
// 【このファイルで学べること】
// - シンプルなリスト表示コンポーネント
// - 条件付きクラス名で自分のユーザー名をハイライトする
// - Props の型定義と children を使わないコンポーネント
// ============================================================

import type { ConnectionStatus } from "../types";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface UserListProps {
  users: string[];               // オンラインユーザー名の配列
  currentUser: string;           // 自分のユーザー名
  status: ConnectionStatus;      // 接続状態
}

// --------------------------------------------------
// 接続状態を日本語ラベルに変換する
// --------------------------------------------------
function getStatusLabel(status: ConnectionStatus): string {
  switch (status) {
    case "connected":
      return "接続中";
    case "connecting":
      return "接続中...";
    case "reconnecting":
      return "再接続中...";
    case "disconnected":
      return "切断";
  }
}

// --------------------------------------------------
// 接続状態に応じた CSS modifier を返す
// --------------------------------------------------
function getStatusModifier(status: ConnectionStatus): string {
  switch (status) {
    case "connected":
      return "user-list__status--connected";
    case "connecting":
    case "reconnecting":
      return "user-list__status--connecting";
    case "disconnected":
      return "user-list__status--disconnected";
  }
}

// --------------------------------------------------
// UserList コンポーネント
// --------------------------------------------------
export function UserList({ users, currentUser, status }: UserListProps) {
  return (
    <aside className="user-list">
      {/* 接続状態インジケーター */}
      <div className={`user-list__status ${getStatusModifier(status)}`}>
        <span className="user-list__status-dot" />
        {getStatusLabel(status)}
      </div>

      <h3 className="user-list__title">
        オンライン ({users.length})
      </h3>

      <ul className="user-list__items">
        {users.map((user) => (
          <li
            key={user}
            className={`user-list__item ${
              user === currentUser ? "user-list__item--self" : ""
            }`}
          >
            {/* 自分のユーザー名には（自分）ラベルを付ける */}
            {user}
            {user === currentUser && (
              <span className="user-list__self-label">（自分）</span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
