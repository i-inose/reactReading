// 【このファイルで学べること】
// - Error Boundary はクラスコンポーネントでしか書けない（2025年現在）
// - getDerivedStateFromError でエラー時の state を更新する

import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // エラー発生時に state を更新する（レンダリング中に呼ばれる）
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  // エラー情報をログに記録する（コミット後に呼ばれる）
  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("ErrorBoundary がエラーをキャッチ:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>エラーが発生しました</h2>
          <p>申し訳ありませんが、問題が発生しました。</p>
          <details className="error-boundary__details">
            <summary>エラーの詳細</summary>
            <pre>{this.state.error?.message}</pre>
          </details>
          <button
            className="error-boundary__btn"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            もう一度試す
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
