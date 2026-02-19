// 【このファイルで学べること】
// - BrowserRouter + Routes + Route によるルート定義
// - ネストされたルート（Layout の中に子ルートを配置）
// - ProtectedRoute による認証ガード
// - 公開ルートと保護ルートの使い分け

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { MyNotesPage } from './pages/MyNotesPage';
import { NoteDetailPage } from './pages/NoteDetailPage';
import { WritePage } from './pages/WritePage';
import { EditPage } from './pages/EditPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

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
            <Route path="/notes/:id" element={<NoteDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* --- 保護ルート（ProtectedRoute でラップ） --- */}
            <Route
              path="/my-notes"
              element={
                <ProtectedRoute>
                  <MyNotesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/write"
              element={
                <ProtectedRoute>
                  <WritePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes/:id/edit"
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
