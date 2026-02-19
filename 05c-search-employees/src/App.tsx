// ============================================================
// App.tsx ― アプリケーションのルート設定
//
// 【このファイルで学べること】
// 1. React Router v7 によるルーティング設定
// 2. Routes / Route の使い分け
// 3. レイアウトコンポーネント（Header）の配置
// ============================================================

import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { EmployeeListPage } from "./pages/EmployeeListPage";
import { EmployeeDetailPage } from "./pages/EmployeeDetailPage";
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
          {/* / → 社員一覧ページ */}
          <Route path="/" element={<EmployeeListPage />} />
          {/* /employees/:id → 社員詳細ページ（:id はパスパラメータ） */}
          <Route path="/employees/:id" element={<EmployeeDetailPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
