# リアルタイム投票アプリ ― 解答集

このファイルには全10問の解答を記載しています。
自分で解いてみてから確認してください。

---

## Q1: ServerEvent の判別共用体（`src/types.ts`）

サーバーからクライアントに送信されるイベントの判別共用体を定義します。
`type` プロパティの値で4つのバリアントを区別します。

```typescript
export type ServerEvent =
  | { type: "question"; payload: { id: number; text: string; options: string[] } }
  | { type: "vote"; payload: { optionIndex: number; username: string } }
  | { type: "result"; payload: { votes: number[]; totalVoters: number } }
  | { type: "users"; payload: string[] };
```

**ポイント:**
- 共通プロパティ `type` のリテラル型で判別する（Discriminated Union）
- `switch(event.type)` で分岐すると、各 case で payload の型が自動推論される
- 04-realtime-chat の `ServerMessage` と同じパターンだが、`payload` でデータをまとめている

---

## Q2: ClientEvent の判別共用体（`src/types.ts`）

クライアントからサーバーに送信されるイベントの判別共用体を定義します。

```typescript
export type ClientEvent =
  | { type: "join"; payload: { username: string } }
  | { type: "vote"; payload: { questionId: number; optionIndex: number } };
```

**ポイント:**
- ServerEvent と同じ判別共用体パターン
- クライアント側は2種類のみ（参加と投票）

---

## Q3: useRef + setInterval でフェイク投票を生成する（`src/hooks/useConnection.ts`）

`intervalRef` と `questionTimerRef` を `useRef` で作成し、
`startSimulation` 関数でフェイク投票をシミュレートします。

```typescript
const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
const questionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

const startSimulation = useCallback(() => {
  // 現在の質問を取得する
  const question = QUESTIONS[currentQuestionIndexRef.current % QUESTIONS.length];

  // "question" イベントを発火する
  onEventRef.current({
    type: "question",
    payload: { id: question.id, text: question.text, options: question.options },
  });

  // "users" イベントを発火する（自分 + ランダムなフェイクユーザー）
  const fakeCount = randomInt(3, 6);
  const shuffled = [...FAKE_USERS].sort(() => Math.random() - 0.5);
  const activeUsers = shuffled.slice(0, fakeCount);
  if (username) {
    activeUsers.unshift(username);
  }
  onEventRef.current({ type: "users", payload: activeUsers });

  // 累積得票数を管理する変数
  const voteCounts = new Array(question.options.length).fill(0) as number[];

  // setInterval でフェイク投票を定期生成する
  intervalRef.current = setInterval(() => {
    const fakeUser = FAKE_USERS[randomInt(0, FAKE_USERS.length - 1)];
    const optionIndex = randomInt(0, question.options.length - 1);

    // "vote" イベントを発火する
    onEventRef.current({
      type: "vote",
      payload: { optionIndex, username: fakeUser },
    });

    // 累積得票数を更新する
    voteCounts[optionIndex] += 1;
    const totalVoters = voteCounts.reduce((sum, v) => sum + v, 0);

    // "result" イベントを発火する
    onEventRef.current({
      type: "result",
      payload: { votes: [...voteCounts], totalVoters },
    });
  }, randomInt(MIN_VOTE_INTERVAL_MS, MAX_VOTE_INTERVAL_MS));

  // 一定時間後に次の質問に切り替える
  questionTimerRef.current = setTimeout(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    currentQuestionIndexRef.current += 1;
    startSimulation();
  }, QUESTION_CYCLE_MS);
}, [username]);
```

**ポイント:**
- `useRef` でタイマー ID を保持する（再レンダリングを起こさない）
- `onEventRef.current` で常に最新のコールバックを参照する
- `randomInt` で 1〜3 秒のランダム間隔でフェイク投票を生成する
- 04-realtime-chat の `useWebSocket` で `wsRef` を使っていたのと同じパターン

---

## Q4: useEffect のクリーンアップ（`src/hooks/useConnection.ts`）

コンポーネントのアンマウント時にタイマーを全てクリアします。

```typescript
useEffect(() => {
  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (questionTimerRef.current) {
      clearTimeout(questionTimerRef.current);
    }
    if (connectionTimerRef.current) {
      clearTimeout(connectionTimerRef.current);
    }
  };
}, []);
```

**ポイント:**
- useEffect が返す関数がクリーンアップ関数
- アンマウント時に不要なタイマーを解放してメモリリークを防ぐ
- 04-realtime-chat では `ws.close()` でWebSocket を閉じていたのと同じ役割

---

## Q5: useReducer の初期状態（`src/hooks/useVote.ts`）

`VoteState` 型に合わせた初期状態を定義します。

```typescript
const initialState: VoteState = {
  question: null,
  votes: [],
  users: [],
  hasVoted: false,
  username: null,
};
```

**ポイント:**
- 各フィールドを VoteState インターフェースの型に合わせる
- `question` は `Question | null` なので初期値は `null`
- `votes` と `users` は空配列で初期化

---

## Q6: ServerEvent のイベントハンドラ（`src/hooks/useVote.ts`）

判別共用体の型絞り込みを活用して、イベントの type に応じて dispatch します。

```typescript
const handleEvent = useCallback((event: ServerEvent) => {
  switch (event.type) {
    case "question":
      dispatch({ type: "SET_QUESTION", payload: event.payload });
      break;
    case "vote":
      dispatch({ type: "ADD_VOTE", payload: event.payload });
      break;
    case "result":
      dispatch({ type: "SET_RESULT", payload: event.payload });
      break;
    case "users":
      dispatch({ type: "SET_USERS", payload: event.payload });
      break;
  }
}, []);
```

**ポイント:**
- `switch(event.type)` で分岐すると、各 case ブロック内で `event.payload` の型が自動推論される
- 例: `case "question"` では `event.payload` は `{ id: number; text: string; options: string[] }`
- これが判別共用体の最大のメリット: 型安全なイベントハンドリング
- 04-realtime-chat の `handleMessage` と完全に同じパターン

---

## Q7: useMemo でパーセンテージを計算する（`src/components/VoteBar.tsx`）

得票率を useMemo でメモ化して計算します。

```typescript
const percentage = useMemo(() => {
  if (totalVotes === 0) return 0;
  return Math.round((count / totalVotes) * 100);
}, [count, totalVotes]);
```

**ポイント:**
- `totalVotes === 0` のときにゼロ除算を防ぐ
- `Math.round` で整数パーセンテージにする
- `count` と `totalVotes` が変わらない限り再計算しない

---

## Q8: React.memo でコンポーネントをメモ化する（`src/components/UserList.tsx`）

React.memo でラップして、props が変化しない限り再レンダリングをスキップします。

```typescript
export const UserList = React.memo(function UserList({ users, currentUser }: UserListProps) {
  return (
    <aside className="user-list">
      <h3 className="user-list__title">
        参加者 <span className="user-list__count">({users.length}人)</span>
      </h3>

      <ul className="user-list__items">
        {users.map((user) => (
          <li
            key={user}
            className={`user-list__item ${
              user === currentUser ? "user-list__item--self" : ""
            }`}
          >
            {user}
            {user === currentUser && (
              <span className="user-list__self-label">（自分）</span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
});
```

**ポイント:**
- `React.memo` は高階コンポーネント（HOC）で、props の浅い比較を行う
- 投票のたびに votes が更新されるが、users が変わらなければ再描画しない
- 04-realtime-chat の UserList にはなかった最適化

---

## Q9: useEffect + setInterval でカウントダウン（`src/components/Timer.tsx`）

useState と useEffect を組み合わせてカウントダウンを実装します。

```typescript
const [remaining, setRemaining] = useState(seconds);

useEffect(() => {
  const id = setInterval(() => {
    setRemaining((prev) => prev - 1);
  }, 1000);
  return () => clearInterval(id);
}, []);

useEffect(() => {
  if (remaining <= 0) {
    onComplete();
  }
}, [remaining, onComplete]);
```

**ポイント:**
- `setRemaining(prev => prev - 1)` でクロージャの問題を回避する
- useEffect のクリーンアップで `clearInterval` する
- 別の useEffect で remaining を監視し、0 以下になったら onComplete を呼ぶ
- 04-realtime-chat の自動再接続タイマーと同じ setInterval + cleanup パターン

---

## Q10: 接続状態に応じた条件付きレンダリング（`src/pages/VotePage.tsx`）

status の値で表示内容を切り替えます。

```typescript
const renderContent = (status: ConnectionStatus): React.ReactNode => {
  switch (status) {
    case "connecting":
      return (
        <div className="vote-page__loading">
          <div className="vote-page__spinner" />
          <p>接続中...</p>
        </div>
      );

    case "connected":
      return (
        <>
          <Timer
            key={timerKey}
            seconds={QUESTION_DURATION_SECONDS}
            onComplete={handleTimerComplete}
          />
          {state.question && (
            <QuestionCard
              question={state.question}
              votes={state.votes}
              hasVoted={state.hasVoted}
              selectedIndex={selectedIndex}
              onVote={handleVote}
            />
          )}
          <div className="vote-page__content">
            <div className="vote-page__sidebar">
              <UserList users={state.users} currentUser={state.username ?? ""} />
            </div>
          </div>
          <div className="vote-page__footer">
            <button className="vote-page__leave-btn" onClick={leave}>
              退出する
            </button>
          </div>
        </>
      );

    case "disconnected":
      return (
        <div className="vote-page__disconnected">
          <p>切断されました</p>
          <button
            className="vote-page__reconnect-btn"
            onClick={() => join(state.username ?? "")}
          >
            再接続
          </button>
        </div>
      );
  }
};
```

**ポイント:**
- ConnectionStatus の3つの値で UI を切り替える
- 04-realtime-chat の ChatPage.tsx では `isConnected` のブーリアンで判定していたが、ここでは3状態に対応
- `state.question &&` で質問がまだ来ていない場合を安全にハンドリング
- Timer の `key` を変えることでコンポーネントを再マウントし、カウントダウンをリセットする
