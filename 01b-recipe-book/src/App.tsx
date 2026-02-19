// 【このファイルで学べること】
// - React Router でページルーティングを構成する
// - React.lazy + Suspense でコード分割する
// - Provider パターンで Context をアプリ全体に配信する
// - Error Boundary でエラーをキャッチする

import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UnitProvider } from "./contexts/UnitContext";
import { Layout } from "./components/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { HomePage } from "./pages/HomePage";

import "./App.css";

// React.lazy: FavoritesPage と AboutPage を必要になるまで読み込まない
// Vite が自動的に別チャンクに分割してくれる
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));

function App() {
  return (
    <ErrorBoundary>
      {/* UnitProvider: 単位系の状態をアプリ全体に配信する（ThemeProvider と同じ役割） */}
      <UnitProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="page-loading">読み込み中...</div>}>
            <Routes>
              {/* Layout をルートに配置し、子ルートを Outlet で描画する */}
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="*" element={
                  <div className="not-found">
                    <h1>404</h1>
                    <p>ページが見つかりません</p>
                  </div>
                } />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </UnitProvider>
    </ErrorBoundary>
  );
}

export default App;
