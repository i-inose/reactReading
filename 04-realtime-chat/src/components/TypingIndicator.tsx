// ============================================================
// TypingIndicator.tsx ― 「○○が入力中...」表示
//
// 【このファイルで学べること】
// - 条件付きレンダリング（早期リターン）
// - 配列の要素数に応じた表示テキストの出し分け
// - CSS アニメーションとの連携
// ============================================================

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface TypingIndicatorProps {
  typingUsers: string[];   // 入力中のユーザー名の配列
}

// --------------------------------------------------
// 入力中ユーザーの表示テキストを生成する
// --------------------------------------------------
function getTypingText(users: string[]): string {
  if (users.length === 1) {
    return `${users[0]}が入力中...`;
  }
  if (users.length === 2) {
    return `${users[0]}と${users[1]}が入力中...`;
  }
  // 3人以上の場合
  return `${users[0]}ほか${users.length - 1}人が入力中...`;
}

// --------------------------------------------------
// TypingIndicator コンポーネント
//
// 【条件付きレンダリング（早期リターン）】
// コンポーネントの先頭で条件を確認し、表示不要なら
// null を返して何も描画しない。if-else でネストが深くなるのを防ぐ。
// --------------------------------------------------
export function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  // 入力中ユーザーがいなければ何も表示しない
  if (typingUsers.length === 0) return null;

  return (
    <div className="typing-indicator">
      {/* 点滅するドットアニメーション */}
      <span className="typing-indicator__dots">
        <span className="typing-indicator__dot" />
        <span className="typing-indicator__dot" />
        <span className="typing-indicator__dot" />
      </span>
      <span className="typing-indicator__text">
        {getTypingText(typingUsers)}
      </span>
    </div>
  );
}
