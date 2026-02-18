// ============================================================
// App.tsx ― アプリケーションのルート設定
//
// 【このファイルで学べること】
// 1. React Router v7 によるルーティング設定
// 2. BrowserRouter / Routes / Route の使い分け
// 3. レイアウトコンポーネント（Header）の配置
// ============================================================

import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { ProductListPage } from "./pages/ProductListPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import "./App.css";

// --------------------------------------------------
// App コンポーネント
//
// 【React Router とは？】
// SPA（Single Page Application）でページ遷移を実現するライブラリ。
// URL に応じて表示するコンポーネントを切り替える。
// ブラウザのリロードなしでページ遷移が可能。
// --------------------------------------------------
function App() {
  return (
    <>
      {/* Header は全ページ共通で表示する */}
      <Header />

      <main className="main">
        <Routes>
          {/* / → 商品一覧ページ */}
          <Route path="/" element={<ProductListPage />} />
          {/* /products/:id → 商品詳細ページ（:id はパスパラメータ） */}
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
