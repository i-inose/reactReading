// ============================================================
// ConnectionStatus.tsx ― 接続状態インジケーター
//
// 【このファイルで学べること】
// - 条件付きレンダリング（接続状態に応じた表示切替）
// - switch 式で状態ごとの表示を返すパターン
// ============================================================

import type { ConnectionStatus as ConnectionStatusType } from "../types";

interface ConnectionStatusProps {
  status: ConnectionStatusType;
}

function getStatusLabel(status: ConnectionStatusType): string {
  switch (status) {
    case "connected":
      return "接続中";
    case "connecting":
      return "接続中...";
    case "disconnected":
      return "切断";
  }
}

function getStatusModifier(status: ConnectionStatusType): string {
  switch (status) {
    case "connected":
      return "connection-status--connected";
    case "connecting":
      return "connection-status--connecting";
    case "disconnected":
      return "connection-status--disconnected";
  }
}

export function ConnectionStatus({ status }: ConnectionStatusProps) {
  return (
    <div className={`connection-status ${getStatusModifier(status)}`}>
      <span className="connection-status__dot" />
      <span className="connection-status__label">{getStatusLabel(status)}</span>
    </div>
  );
}
