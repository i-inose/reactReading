# 04c-realtime-vote ― リアルタイム投票アプリ

React + TypeScript で作るリアルタイム風の投票アプリです。
バックエンドなしで、`setInterval` を使ってフェイクユーザーの投票をシミュレートします。

## 学習テーマ

- **判別共用体（Discriminated Union）** と型絞り込み（Type Narrowing）
- **useReducer** による複雑な状態管理
- **useRef** でタイマーIDやコールバックを保持するパターン
- **useEffect** のクリーンアップによるリソース解放
- **useMemo** による計算結果のメモ化
- **React.memo** による不要な再レンダリングの防止
- **setInterval / setTimeout** でリアルタイム風の動作をシミュレート
- **条件付きレンダリング** による接続状態別の画面表示

## 04-realtime-chat との対応

| chat のファイル | vote のファイル | 対応する概念 |
|---|---|---|
| `types.ts` (ServerMessage) | `types.ts` (ServerEvent) | 判別共用体 |
| `useWebSocket.ts` | `useConnection.ts` | 接続管理 + useRef |
| `useChat.ts` | `useVote.ts` | useReducer + イベントハンドリング |
| `ChatPage.tsx` | `VotePage.tsx` | コンポジション + 条件付きレンダリング |
| `UserList.tsx` | `UserList.tsx` | React.memo で最適化 |
| - | `VoteBar.tsx` | useMemo |
| - | `Timer.tsx` | useEffect + setInterval |

## セットアップ

```bash
npm install
npm run dev
```

## 穴埋め問題

全10問の `// TODO(QN):` コメントがあります。
`_answers/README.md` に解答があります。

| # | ファイル | テーマ |
|---|---|---|
| Q1 | `src/types.ts` | ServerEvent の判別共用体 |
| Q2 | `src/types.ts` | ClientEvent の判別共用体 |
| Q3 | `src/hooks/useConnection.ts` | useRef + setInterval |
| Q4 | `src/hooks/useConnection.ts` | useEffect のクリーンアップ |
| Q5 | `src/hooks/useVote.ts` | useReducer の初期状態 |
| Q6 | `src/hooks/useVote.ts` | 判別共用体の型絞り込み |
| Q7 | `src/components/VoteBar.tsx` | useMemo |
| Q8 | `src/components/UserList.tsx` | React.memo |
| Q9 | `src/components/Timer.tsx` | useEffect + setInterval |
| Q10 | `src/pages/VotePage.tsx` | 条件付きレンダリング |

## アプリの動作

1. ニックネームを入力して参加
2. 質問と選択肢が表示される
3. 選択肢をクリックして投票
4. 投票後は棒グラフで結果がリアルタイムに更新される
5. 30秒ごとに次の質問に切り替わる
6. フェイクユーザーが1〜3秒ごとに自動投票する
