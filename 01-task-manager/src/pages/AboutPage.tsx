// ============================================================
// AboutPage.tsx ― アプリ紹介ページ
//
// 【このファイルで学べること】
// - React.lazy と Suspense で遅延読み込みされるページの実例
// - シンプルなプレゼンテーショナルコンポーネント（表示のみ）
// ============================================================

// --------------------------------------------------
// AboutPage コンポーネント
//
// このコンポーネントは App.tsx で React.lazy() を使って
// 遅延読み込み（Code Splitting）される。
// 遅延読み込みでは default export が必要。
// --------------------------------------------------
export default function AboutPage() {
  return (
    <div className="about-page">
      <h1 className="about-page__title">このアプリについて</h1>

      <section className="about-page__section">
        <h2>概要</h2>
        <p>
          これは React + TypeScript の学習用タスク管理アプリです。
          ソースコードには一行ずつ詳しいコメントが付いているので、
          React の仕組みを理解しながら学習できます。
        </p>
      </section>

      <section className="about-page__section">
        <h2>使用技術</h2>
        {/* JSX ではリストを直接書ける */}
        <ul className="about-page__list">
          <li><strong>React 19</strong> ― UI ライブラリ</li>
          <li><strong>TypeScript</strong> ― 型安全な JavaScript</li>
          <li><strong>React Router</strong> ― SPA のルーティング</li>
          <li><strong>Vite</strong> ― 高速なビルドツール</li>
          <li><strong>Express</strong> ― バックエンド API サーバー</li>
        </ul>
      </section>

      <section className="about-page__section">
        <h2>学べる React の概念</h2>
        <ul className="about-page__list">
          <li>関数コンポーネントと JSX</li>
          <li>useState ― 状態管理</li>
          <li>useEffect ― 副作用の処理</li>
          <li>useRef ― DOM 参照</li>
          <li>useReducer ― 複雑な状態管理</li>
          <li>useContext ― グローバルな状態共有</li>
          <li>useMemo / useCallback ― メモ化</li>
          <li>React.memo ― 再レンダリング最適化</li>
          <li>カスタムフック ― ロジックの再利用</li>
          <li>Context API ― Props のバケツリレー回避</li>
          <li>React Router ― ページルーティング</li>
          <li>React.lazy / Suspense ― コード分割</li>
          <li>createPortal ― DOM ツリー外へのレンダリング</li>
          <li>Error Boundary ― エラーハンドリング</li>
        </ul>
      </section>
    </div>
  );
}
