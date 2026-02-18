// ============================================================
// App.tsx ― アプリケーションのルート設定
//
// 【このファイルで学べること】
// - React Router のルート定義（BrowserRouter + Routes + Route）
// - ネストされたルート（Layout コンポーネントの中に子ルートを配置）
// - ProtectedRoute による認証ガード
// - 公開ルートと保護ルートの使い分け
// ============================================================

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { ArticlePage } from './pages/ArticlePage';
import { WritePage } from './pages/WritePage';
import { EditPage } from './pages/EditPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// --------------------------------------------------
// ルート構成
//
// 【ルートの種類】
// 1. 公開ルート: 誰でもアクセスできる（記事一覧、記事詳細、ログイン、登録）
// 2. 保護ルート: 認証済みユーザーのみ（記事作成、記事編集）
//
// 【ネストされたルート】
// Layout コンポーネントの Route の中に子 Route を配置すると、
// Layout の <Outlet /> の位置に子コンポーネントがレンダリングされる。
// これにより全ページで共通の Header を表示できる。
// --------------------------------------------------
export default function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider: 認証状態をアプリ全体で共有する */}
      <AuthProvider>
        <Routes>
          {/* Layout でラップ: 全ページに Header を表示する */}
          <Route element={<Layout />}>
            {/* --- 公開ルート --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/articles/:id" element={<ArticlePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* --- 保護ルート（ProtectedRoute でラップ） --- */}
            <Route
              path="/write"
              element={
                <ProtectedRoute>
                  <WritePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/articles/:id/edit"
              element={
                <ProtectedRoute>
                  <EditPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
