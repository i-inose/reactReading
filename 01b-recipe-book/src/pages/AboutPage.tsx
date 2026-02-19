// 【このファイルで学べること】
// - シンプルなプレゼンテーショナルコンポーネント（表示のみ）

export default function AboutPage() {
  return (
    <div className="about-page">
      <h1 className="about-page__title">このアプリについて</h1>

      <section className="about-page__section">
        <h2>概要</h2>
        <p>
          レシピブックは React + TypeScript の学習用レシピ管理アプリです。
          01-task-manager で学んだパターンを、別のドメイン（料理）で復習します。
          コメントは「ここだけは覚えておきたい」ポイントに絞っています。
        </p>
      </section>

      <section className="about-page__section">
        <h2>使用技術</h2>
        <ul className="about-page__list">
          <li><strong>React 19</strong> --- UI ライブラリ</li>
          <li><strong>TypeScript</strong> --- 型安全な JavaScript</li>
          <li><strong>React Router</strong> --- SPA のルーティング</li>
          <li><strong>Vite</strong> --- 高速なビルドツール</li>
          <li><strong>localStorage</strong> --- ブラウザ内データ永続化</li>
        </ul>
      </section>

      <section className="about-page__section">
        <h2>復習できる React パターン</h2>
        <ul className="about-page__list">
          <li><strong>useReducer</strong> --- レシピの CRUD + お気に入り切替</li>
          <li><strong>Context API</strong> --- 単位系（メトリック/インペリアル）の切替</li>
          <li><strong>React.memo</strong> --- RecipeCard の再レンダリング最適化</li>
          <li><strong>createPortal</strong> --- レシピ詳細モーダル</li>
          <li><strong>Error Boundary</strong> --- アプリ全体のエラーキャッチ</li>
          <li><strong>React.lazy + Suspense</strong> --- お気に入りページの遅延読み込み</li>
          <li><strong>useMemo</strong> --- カロリー平均・カテゴリ別集計</li>
          <li><strong>useRef</strong> --- レシピ名入力の自動フォーカス</li>
          <li><strong>useCallback</strong> --- メモ化コンポーネントへの関数渡し</li>
          <li><strong>useEffect</strong> --- localStorage 同期</li>
          <li><strong>React Router</strong> --- ホーム / お気に入り / About ページ</li>
        </ul>
      </section>
    </div>
  );
}
