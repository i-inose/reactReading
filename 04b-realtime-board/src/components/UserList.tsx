// ============================================================
// UserList.tsx ― 接続ユーザー一覧
//
// 【このファイルで学べること】
// - 配列の map によるリスト描画（チャットの UserList と同じ）
// - 条件付きクラス名で自分のユーザー名をハイライトする
// ============================================================

interface UserListProps {
  users: string[];
  currentUser: string;
}

export function UserList({ users, currentUser }: UserListProps) {
  return (
    <aside className="user-list">
      <h3 className="user-list__title">
        参加者 ({users.length + 1})
      </h3>
      <ul className="user-list__items">
        {/* 自分を先頭に表示する */}
        <li className="user-list__item user-list__item--self">
          {currentUser}
          <span className="user-list__self-label">（自分）</span>
        </li>
        {users.map((user) => (
          <li key={user} className="user-list__item">
            {user}
          </li>
        ))}
      </ul>
    </aside>
  );
}
