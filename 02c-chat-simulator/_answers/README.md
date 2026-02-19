# Chat Simulator ― 解答集

## Q1: ChatMessage インターフェースと StreamStatus 型

**ファイル:** `src/types.ts`

```ts
export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: number;
  status: "complete" | "streaming";
}

export type StreamStatus = "idle" | "streaming" | "done";
```

**解説:**
- `interface` はオブジェクトの形状（シェイプ）を定義します
- `role` と `status` にはリテラル型のユニオンを使い、特定の文字列しか代入できないようにします
- `type` キーワードで型エイリアスを定義します。`StreamStatus` は3つのリテラル型の和集合です
- `interface` vs `type`: オブジェクトの形状には `interface`、ユニオン型には `type` を使うのが一般的です

---

## Q2: ChatAction 判別共用体

**ファイル:** `src/types.ts`

```ts
export type ChatAction =
  | { type: "ADD_USER_MESSAGE"; payload: string }
  | { type: "START_AI_MESSAGE"; payload: string }
  | { type: "APPEND_AI_CHUNK"; payload: { id: string; chunk: string } }
  | { type: "COMPLETE_AI_MESSAGE"; payload: string }
  | { type: "SET_STATUS"; payload: StreamStatus };
```

**解説:**
- 判別共用体（Discriminated Union）は、共通の `type` プロパティで各バリアントを区別するパターンです
- `switch (action.type)` で TypeScript が自動的に `payload` の型を絞り込みます（型の絞り込み / Type Narrowing）
- `APPEND_AI_CHUNK` の payload はオブジェクト型で、ID と追加する文字を含みます
- このパターンは Redux や useReducer で広く使われています

---

## Q3: useReducer の初期化

**ファイル:** `src/hooks/useChat.ts`

```ts
const [state, dispatch] = useReducer(chatReducer, initialState);
```

**解説:**
- `useReducer` は `useState` の代替で、複雑な状態遷移に適しています
- 第1引数に reducer 関数、第2引数に初期状態を渡します
- 戻り値は `[現在の状態, dispatch関数]` のタプルです
- `dispatch({ type: "ADD_USER_MESSAGE", payload: "hello" })` のように呼び出して状態を更新します
- `useState` との使い分け: 状態の更新ロジックが複雑な場合は `useReducer` が適しています

---

## Q4: ストリーミングシミュレーション

**ファイル:** `src/hooks/useChat.ts`

```ts
const simulateStreaming = (messageId: string, response: string) => {
  let index = 0;
  function appendNext() {
    if (index < response.length) {
      dispatch({
        type: "APPEND_AI_CHUNK",
        payload: { id: messageId, chunk: response[index] },
      });
      index++;
      setTimeout(appendNext, 30 + Math.random() * 20);
    } else {
      dispatch({ type: "COMPLETE_AI_MESSAGE", payload: messageId });
      dispatch({ type: "SET_STATUS", payload: "idle" });
    }
  }
  appendNext();
};
```

**解説:**
- `setTimeout` を再帰的に呼び出すことで、一定間隔で1文字ずつ追加します
- `30 + Math.random() * 20` で 30ms〜50ms のランダムな遅延を作り、リアルなタイピング感を演出します
- `response[index]` で文字列から1文字を取得します
- 全文字の送信が完了したら `COMPLETE_AI_MESSAGE` と `SET_STATUS` をディスパッチします
- この再帰パターンは `setInterval` よりも柔軟で、各ステップ間の遅延を変えられます

---

## Q5: useRef + useEffect で自動スクロール

**ファイル:** `src/hooks/useChat.ts`

```ts
const messagesEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [state.messages]);
```

**解説:**
- `useRef<HTMLDivElement>(null)` で DOM 要素への参照オブジェクトを作成します
- `useEffect` の依存配列に `state.messages` を指定し、メッセージが変わるたびに実行します
- `scrollIntoView({ behavior: "smooth" })` でスムーズにスクロールします
- `?.` はオプショナルチェーンで、`messagesEndRef.current` が `null` の場合はスキップします
- この ref は JSX で `<div ref={messagesEndRef} />` のように使い、メッセージリストの末尾に配置します

---

## Q6: useCallback でメモ化

**ファイル:** `src/hooks/useChat.ts`

```ts
const sendMessage = useCallback(
  (content: string) => {
    if (state.streamStatus !== "idle") return;

    dispatch({ type: "ADD_USER_MESSAGE", payload: content });
    dispatch({ type: "SET_STATUS", payload: "streaming" });

    const messageId = crypto.randomUUID();
    dispatch({ type: "START_AI_MESSAGE", payload: messageId });

    const response = getRandomResponse();
    setTimeout(() => {
      simulateStreaming(messageId, response);
    }, 500);
  },
  [state.streamStatus]
);
```

**解説:**
- `useCallback(fn, deps)` は関数をメモ化し、依存配列が変わらない限り同じ関数参照を返します
- 子コンポーネントに渡すコールバックをメモ化することで、不要な再レンダリングを防ぎます
- `state.streamStatus` を依存配列に含め、ストリーミング中の二重送信を防ぎます
- `crypto.randomUUID()` でブラウザ標準の UUID を生成します
- `setTimeout` で 500ms の遅延を入れ、AI が「考えている」感を演出します

---

## Q7: 条件付きレンダリング

**ファイル:** `src/components/ChatMessage.tsx`

```tsx
export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`chat-message ${message.role}`}>
      <div className="message-bubble">
        <p className="message-content">{message.content}</p>
        {message.status === "streaming" && <StreamingDots />}
      </div>
      <span className="message-time">
        {new Date(message.timestamp).toLocaleTimeString()}
      </span>
    </div>
  );
}
```

**解説:**
- テンプレートリテラル `` `chat-message ${message.role}` `` で動的にクラス名を構成します
- `{条件 && <コンポーネント />}` は条件付きレンダリングのパターンです
- 条件が `true` のときだけ `<StreamingDots />` が描画されます
- `new Date(timestamp).toLocaleTimeString()` でタイムスタンプを読みやすい時刻文字列に変換します
- CSS 側で `.chat-message.user` と `.chat-message.ai` で異なるスタイルを適用しています

---

## Q8: useState と onSubmit ハンドラ

**ファイル:** `src/components/ChatInput.tsx`

```tsx
import { useState } from "react";
import type { StreamStatus } from "../types.ts";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  streamStatus: StreamStatus;
}

export function ChatInput({ onSendMessage, streamStatus }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput("");
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="chat-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="メッセージを入力..."
        disabled={streamStatus !== "idle"}
      />
      <button
        type="submit"
        className="send-button"
        disabled={streamStatus !== "idle" || !input.trim()}
      >
        送信
      </button>
    </form>
  );
}
```

**解説:**
- `useState("")` で入力値を空文字列で初期化します
- `e.preventDefault()` でフォーム送信時のページリロードを防ぎます
- `input.trim()` で前後の空白を除去し、空の場合は早期リターンします
- `onChange={(e) => setInput(e.target.value)}` で入力値をリアルタイムに同期します
- `disabled` プロパティでストリーミング中の入力を無効化し、UX を向上させます

---

## Q9: StreamingDots コンポーネント

**ファイル:** `src/components/StreamingDots.tsx`

```tsx
export function StreamingDots() {
  return (
    <span className="streaming-dots">
      <span className="dot" style={{ animationDelay: "0s" }}>.</span>
      <span className="dot" style={{ animationDelay: "0.2s" }}>.</span>
      <span className="dot" style={{ animationDelay: "0.4s" }}>.</span>
    </span>
  );
}
```

**解説:**
- React では `style` プロパティにオブジェクトを渡します（文字列ではない）
- CSS プロパティ名はキャメルケースに変換します（`animation-delay` → `animationDelay`）
- `animationDelay` を 0s, 0.2s, 0.4s とずらすことで、ドットが順番に点滅する効果を作ります
- CSS の `@keyframes dotBlink` アニメーション（App.css）と組み合わせて動作します
- シンプルなコンポーネントですが、React の JSX における style の書き方を学ぶ良い練習になります

---

## Q10: ChatPage の組み立て

**ファイル:** `src/pages/ChatPage.tsx`

```tsx
import { useChat } from "../hooks/useChat.ts";
import { ChatMessage } from "../components/ChatMessage.tsx";
import { ChatInput } from "../components/ChatInput.tsx";

export function ChatPage() {
  const { messages, streamStatus, sendMessage, messagesEndRef } = useChat();

  return (
    <div className="chat-page">
      <div className="chat-header">
        <h1>Chat Simulator</h1>
        <p>AI チャットシミュレーター</p>
      </div>
      <div className="chat-messages">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSendMessage={sendMessage} streamStatus={streamStatus} />
    </div>
  );
}
```

**解説:**
- `useChat()` カスタムフックの戻り値を分割代入で受け取ります
- `messages.map()` で配列の各要素を `<ChatMessage />` コンポーネントに変換します
- `key={message.id}` は React がリスト要素を効率的に更新するために必要です
- `<div ref={messagesEndRef} />` はスクロール位置の目印として配置します
- props の受け渡しにより、親（ChatPage）から子（ChatInput）へデータとコールバックを伝えます
