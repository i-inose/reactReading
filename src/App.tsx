// ============================================================
// App.tsx ― アプリケーションのルートコンポーネント
//
// 【このファイルで学べること】
// - React Router によるページルーティング（SPA のページ切り替え）
// - React.lazy と Suspense によるコード分割（遅延読み込み）
// - Provider パターン（Context を使ったデータの配信）
// - Error Boundary によるエラーハンドリング
// ============================================================

// React の機能をインポートする
import {
  lazy,      // コンポーネントを遅延読み込みする関数
  Suspense,  // 遅延読み込み中にフォールバック UI を表示するコンポーネント
} from "react";

// --------------------------------------------------
// React Router のコンポーネントをインポートする
//
// 【React Router とは？】
// SPA（Single Page Application）でページ遷移を実現するライブラリ。
// URL に応じて表示するコンポーネントを切り替える。
// ページ遷移時にフルリロードせず、JavaScript で画面を差し替える。
// --------------------------------------------------
import {
  BrowserRouter, // HTML5 History API を使うルーター（最も一般的）
  Routes,        // Route のグループ（1つだけマッチする）
  Route,         // URL パスとコンポーネントの対応を定義する
} from "react-router-dom";

// Context Provider をインポートする
import { ThemeProvider } from "./contexts/ThemeContext";

// コンポーネントをインポートする
import { Layout } from "./components/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";

// ページコンポーネントをインポートする
// HomePage は常に使うので通常インポートする
import { HomePage } from "./pages/HomePage";

// --------------------------------------------------
// React.lazy によるコード分割（遅延読み込み）
//
// 【React.lazy とは？】
// コンポーネントを「必要になったときに初めて読み込む」仕組み。
// ページ単位でコードを分割することで、初回読み込みを高速化する。
//
// 使い方: const Component = lazy(() => import("./path/to/Component"));
// - import() は動的インポート（ES Modules の機能）
// - Vite が自動的に別ファイル（チャンク）に分割してくれる
// - lazy は default export されたコンポーネントのみ対応
// --------------------------------------------------
const AboutPage = lazy(() => import("./pages/AboutPage"));

// --------------------------------------------------
// CSS をインポートする
// Vite では CSS ファイルを直接 import すると自動で適用される
// --------------------------------------------------
import "./App.css";

// --------------------------------------------------
// App コンポーネント（アプリケーションのルート）
// --------------------------------------------------
function App() {
  return (
    // --------------------------------------------------
    // ErrorBoundary: 子コンポーネントで起きたエラーをキャッチする
    // アプリ全体を囲むことで、どこでエラーが起きてもクラッシュを防ぐ
    // --------------------------------------------------
    <ErrorBoundary>
      {/* --------------------------------------------------
        ThemeProvider: テーマ情報をアプリ全体に配信する
        Provider は通常、アプリのルート近くに配置する
        Provider の中にあるコンポーネントなら、どこからでも
        useTheme() でテーマ情報にアクセスできる
      -------------------------------------------------- */}
      <ThemeProvider>
        {/* --------------------------------------------------
          BrowserRouter: URL ベースのルーティングを有効にする
          アプリ内で Link や useNavigate を使うには、
          これらのコンポーネントが BrowserRouter の中にある必要がある
        -------------------------------------------------- */}
        <BrowserRouter>
          {/* Layout: ヘッダー・フッターなどの共通レイアウト */}
          <Layout>
            {/* --------------------------------------------------
              Suspense: 遅延読み込み中の表示を制御する

              【Suspense とは？】
              lazy() で読み込むコンポーネントは、ダウンロードが
              完了するまで表示できない。その間に表示する UI を
              fallback で指定する。

              fallback={<Loading />} のように、専用のコンポーネント
              を渡すこともできる。
            -------------------------------------------------- */}
            <Suspense fallback={<div className="page-loading">ページを読み込み中...</div>}>
              {/* --------------------------------------------------
                Routes: URL パスに応じたコンポーネントの切り替え

                【ルーティングの仕組み】
                1. ユーザーが URL にアクセスする（例: /about）
                2. Routes が定義された Route を上から順に照合する
                3. path が一致する Route のコンポーネントを表示する
              -------------------------------------------------- */}
              <Routes>
                {/* path="/" → ルート URL（トップページ） */}
                {/* element={<Component />} → 表示するコンポーネント */}
                <Route path="/" element={<HomePage />} />

                {/* path="/about" → /about URL */}
                {/* AboutPage は lazy で遅延読み込みされる */}
                <Route path="/about" element={<AboutPage />} />

                {/* path="*" → どのルートにもマッチしなかった場合（404 ページ） */}
                <Route path="*" element={
                  <div className="not-found">
                    <h1>404</h1>
                    <p>ページが見つかりません</p>
                  </div>
                } />
              </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// --------------------------------------------------
// default export: このコンポーネントをデフォルトエクスポートする
// main.tsx からインポートされる
// --------------------------------------------------
export default App;
