// ============================================================
// ErrorBoundary.tsx ― エラーバウンダリコンポーネント
//
// 【このファイルで学べること】
// - クラスコンポーネント（React の古い書き方だが Error Boundary では必須）
// - Error Boundary: 子コンポーネントのエラーをキャッチして表示する
// - ライフサイクルメソッド（componentDidCatch, getDerivedStateFromError）
// - 関数コンポーネントとクラスコンポーネントの違い
//
// 【なぜクラスコンポーネントなのか？】
// Error Boundary は getDerivedStateFromError と componentDidCatch という
// ライフサイクルメソッドを使う必要があり、これらは 2025 年現在、
// 関数コンポーネント（フック）では実装できない。
// そのため、Error Boundary だけはクラスコンポーネントで書く必要がある。
// ============================================================

// React の Component クラスをインポートする
import { Component } from "react";

// 型だけのインポート
import type { ReactNode, ErrorInfo } from "react";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface ErrorBoundaryProps {
  children: ReactNode;                              // 子要素
  fallback?: ReactNode;                             // エラー時に表示する代替 UI（任意）
  onError?: (error: Error, info: ErrorInfo) => void; // エラー発生時のコールバック（任意）
}

// --------------------------------------------------
// State の型定義
// --------------------------------------------------
interface ErrorBoundaryState {
  hasError: boolean;     // エラーが発生したかどうか
  error: Error | null;   // エラーオブジェクト
}

// --------------------------------------------------
// ErrorBoundary クラスコンポーネント
//
// 【クラスコンポーネントの基本構造】
// class 名前 extends Component<Props型, State型> { ... }
// Component は React が提供するベースクラス
// --------------------------------------------------
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  // --------------------------------------------------
  // コンストラクタ: クラスのインスタンスが作られるときに実行される
  // --------------------------------------------------
  constructor(props: ErrorBoundaryProps) {
    // super(props) で親クラス（Component）のコンストラクタを呼ぶ（必須）
    super(props);

    // this.state で状態を初期化する（関数コンポーネントの useState に相当）
    this.state = {
      hasError: false,
      error: null,
    };
  }

  // --------------------------------------------------
  // static getDerivedStateFromError: エラー発生時に state を更新する
  //
  // 【static メソッドとは？】
  // クラスのインスタンスではなく、クラス自体に属するメソッド。
  // this にアクセスできない。React が内部的に呼び出す。
  //
  // このメソッドは「レンダリング中」に呼ばれる。
  // 副作用（API コール等）は書かず、state の更新だけ行う。
  // --------------------------------------------------
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // エラーが起きたことを state に記録して、フォールバック UI を表示する
    return { hasError: true, error };
  }

  // --------------------------------------------------
  // componentDidCatch: エラー情報をログに記録する
  //
  // getDerivedStateFromError と違い「コミット後」に呼ばれる。
  // ログ送信やエラーレポートなどの副作用を書ける。
  // --------------------------------------------------
  componentDidCatch(error: Error, info: ErrorInfo): void {
    // コンソールにエラーの詳細を出力する
    console.error("ErrorBoundary がエラーをキャッチしました:", error);
    console.error("コンポーネントスタック:", info.componentStack);

    // Props で渡されたコールバックがあれば呼び出す
    this.props.onError?.(error, info);
  }

  // --------------------------------------------------
  // render: JSX を返すメソッド（関数コンポーネントの return に相当）
  // クラスコンポーネントでは render() メソッドの中に JSX を書く
  // --------------------------------------------------
  render() {
    // エラーが発生している場合
    if (this.state.hasError) {
      // カスタムフォールバックが Props で渡されていればそれを表示する
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // デフォルトのエラー表示
      return (
        <div className="error-boundary">
          <h2>エラーが発生しました</h2>
          <p>申し訳ありませんが、問題が発生しました。</p>
          {/* this.state でクラスコンポーネントの状態にアクセスする */}
          <details className="error-boundary__details">
            <summary>エラーの詳細</summary>
            {/* ?. でオプショナルチェーンを使い null 安全にアクセスする */}
            <pre>{this.state.error?.message}</pre>
          </details>
          <button
            className="error-boundary__btn"
            onClick={() => {
              // this.setState でクラスコンポーネントの状態を更新する
              // （関数コンポーネントの setState に相当）
              this.setState({ hasError: false, error: null });
            }}
          >
            もう一度試す
          </button>
        </div>
      );
    }

    // エラーがなければ子要素をそのまま描画する
    // this.props.children で Props の children にアクセスする
    return this.props.children;
  }
}
