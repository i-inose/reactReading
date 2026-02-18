// ============================================================
// RoomSelector.tsx ― チャットルーム切り替えタブ
//
// 【このファイルで学べること】
// - 定数配列をもとにタブ UI を動的に生成する
// - アクティブ状態の管理と条件付きクラス名
// - コールバック Props によるイベント伝搬
// ============================================================

import { useCallback } from "react";
import { ROOMS } from "../types";
import type { RoomName } from "../types";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface RoomSelectorProps {
  currentRoom: RoomName;                     // 現在選択中のルーム
  onChangeRoom: (room: RoomName) => void;    // ルーム変更コールバック
}

// --------------------------------------------------
// RoomSelector コンポーネント
// --------------------------------------------------
export function RoomSelector({ currentRoom, onChangeRoom }: RoomSelectorProps) {
  // --------------------------------------------------
  // ルーム変更ハンドラ
  // useCallback で関数をメモ化し、不要な再レンダリングを防ぐ
  // --------------------------------------------------
  const handleClick = useCallback(
    (room: RoomName) => {
      onChangeRoom(room);
    },
    [onChangeRoom]
  );

  return (
    <nav className="room-selector">
      {/* --------------------------------------------------
        ROOMS 定数配列を map して、各ルームのタブを生成する

        【定数配列からのUI生成】
        データ（ROOMS）と表示ロジックを分離することで、
        ルームの追加・変更が容易になる。
        types.ts の ROOMS を変更するだけで UI に反映される。
      -------------------------------------------------- */}
      {ROOMS.map((room) => {
        const isActive = room.key === currentRoom;

        return (
          <button
            key={room.key}
            className={`room-selector__tab ${
              isActive ? "room-selector__tab--active" : ""
            }`}
            onClick={() => handleClick(room.key)}
            // aria-selected: スクリーンリーダー向けの選択状態
            aria-selected={isActive}
          >
            {room.label}
          </button>
        );
      })}
    </nav>
  );
}
