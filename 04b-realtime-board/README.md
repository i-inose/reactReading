# 04b-realtime-board: リアルタイムボード

デジタルホワイトボード / 付箋ボードアプリ。シミュレーションによるリアルタイムコラボレーション体験。

04-realtime-chat と**同じ React パターン**を、異なるドメイン（チャット → ボード）で再学習する「2nd Reading」教材です。

## 起動方法

```bash
npm install
npm run dev
```

## 04-realtime-chat との比較表

| パターン | 04-realtime-chat | 04b-realtime-board |
|---------|-----------------|-------------------|
| 接続管理 (useRef) | `useWebSocket` - WebSocket インスタンスを useRef で保持 | `useConnection` - setInterval ID を useRef で保持 |
| 判別共用体 | `ClientMessage` / `ServerMessage` (chat, users, typing, room_history) | `BoardEvent` (note_add, note_move, note_delete, cursor_move) |
| useReducer | `chatReducer` - messages, users, typingUsers | `boardReducer` - notes, cursors, status |
| デバウンス | typing 通知のタイムアウト | カーソル位置更新の頻度制限 |
| useRef | wsRef, reconnectTimerRef, onMessageRef | intervalRef, connectionTimerRef, onEventRef |
| 接続状態 | connecting / connected / disconnected / reconnecting | connecting / connected / disconnected |
| 条件付きレンダリング | 接続状態でメッセージ入力の有効/無効 | 接続状態でオーバーレイ表示 / フォーム無効化 |
| コンポジション | MessageList + MessageInput + UserList | Board + StickyNote + CursorOverlay + AddNoteForm |

## ファイル構成

```
src/
  types.ts              - 型定義（判別共用体）
  hooks/
    useConnection.ts    - シミュレーション接続管理
    useBoard.ts         - ボード状態管理（useReducer）
  components/
    StickyNote.tsx      - ドラッグ可能な付箋
    Board.tsx           - ホワイトボード領域
    CursorOverlay.tsx   - カーソル表示
    AddNoteForm.tsx     - 付箋追加フォーム
    ConnectionStatus.tsx- 接続状態インジケーター
    UserList.tsx        - ユーザー一覧
    Header.tsx          - ヘッダー
  pages/
    JoinPage.tsx        - ニックネーム入力
    BoardPage.tsx       - メインボード画面
  data/
    fakeUsers.ts        - 仮ユーザーデータ
    noteColors.ts       - 付箋の色定義
  App.tsx               - ルーティング
  main.tsx              - エントリーポイント
```

## 学習のポイント

1. **判別共用体**: チャットでは「メッセージ種別」、ボードでは「ボードイベント種別」。同じ switch + type narrowing パターン
2. **useReducer**: チャットでは「メッセージ配列の管理」、ボードでは「ノート配列 + カーソル配列の管理」。複雑な状態を純粋関数で更新
3. **useRef**: タイマー ID やコールバックの最新値を保持。レンダリングに影響しない値の管理
4. **デバウンス**: 高頻度イベント（typing / cursor move）の発火を制限
5. **ドラッグ実装**: mousedown → document.addEventListener(mousemove/mouseup) パターン
