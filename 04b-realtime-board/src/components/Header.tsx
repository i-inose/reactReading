// ============================================================
// Header.tsx ― アプリヘッダー
//
// 【このファイルで学べること】
// - 小さなコンポーネントへの分割（コンポジション）
// - Props でコールバックを受け取りボタンに接続する
// ============================================================

import type { ConnectionStatus as ConnectionStatusType } from "../types";
import { ConnectionStatus } from "./ConnectionStatus.tsx";

interface HeaderProps {
  status: ConnectionStatusType;
  onLeave: () => void;
}

export function Header({ status, onLeave }: HeaderProps) {
  return (
    <header className="header">
      <h1 className="header__title">Realtime Board</h1>
      <div className="header__actions">
        <ConnectionStatus status={status} />
        <button className="header__leave-btn" onClick={onLeave}>
          退出する
        </button>
      </div>
    </header>
  );
}
