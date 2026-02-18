// ============================================================
// MessageList.tsx ― メッセージ一覧の表示と自動スクロール
//
// 【このファイルで学べること】
// - useRef で DOM 要素を参照する方法
// - useEffect で DOM 操作（スクロール）を行う
// - map + key によるリストレンダリング
// - 依存配列による useEffect の再実行条件
// ============================================================

import { useRef, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import type { ChatMessage } from "../types";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface MessageListProps {
  messages: ChatMessage[];   // メッセージ一覧
  currentUser: string;       // 現在のユーザー名（自分のメッセージ判定に使う）
}

// --------------------------------------------------
// MessageList コンポーネント
// --------------------------------------------------
export function MessageList({ messages, currentUser }: MessageListProps) {
  // --------------------------------------------------
  // useRef で DOM 要素への参照を作成する
  //
  // 【useRef で DOM にアクセスする】
  // useRef<HTMLDivElement>(null) で ref オブジェクトを作り、
  // JSX の ref 属性に渡すと、その DOM 要素にアクセスできる。
  // .current プロパティで実際の DOM 要素を取得する。
  // --------------------------------------------------
  const bottomRef = useRef<HTMLDivElement>(null);

  // --------------------------------------------------
  // 新しいメッセージが追加されたら自動的に最下部にスクロールする
  //
  // 【依存配列の意味】
  // [messages.length] → messages の件数が変わったときだけ実行される。
  // メッセージの内容が変わっても件数が同じなら実行されない。
  // --------------------------------------------------
  useEffect(() => {
    // scrollIntoView: 指定した要素が見えるようにスクロールする DOM API
    // behavior: "smooth" でアニメーション付きスクロールになる
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // メッセージがない場合の表示
  if (messages.length === 0) {
    return (
      <div className="message-list">
        <p className="message-list__empty">
          まだメッセージはありません。最初のメッセージを送ってみましょう。
        </p>
      </div>
    );
  }

  return (
    <div className="message-list">
      {/* --------------------------------------------------
        map でメッセージ一覧をレンダリングする

        【key の重要性】
        React はリスト内の各要素を key で識別する。
        key がないと、要素の追加・削除時に正しく更新できない。
        ここではインデックス + タイムスタンプを組み合わせる。
      -------------------------------------------------- */}
      {messages.map((msg, index) => (
        <MessageBubble
          key={`${index}-${msg.timestamp}`}
          message={msg}
          isOwn={msg.username === currentUser}
        />
      ))}

      {/* スクロール先のアンカー要素（非表示） */}
      <div ref={bottomRef} />
    </div>
  );
}
