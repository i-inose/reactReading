// ============================================================
// App.tsx ― アプリケーションのルート設定
//
// 【このファイルで学べること】
// - React Router のルート定義（BrowserRouter + Routes + Route）
// - ネストされたルート（Layout コンポーネントの中に子ルートを配置）
// - ProtectedRoute による認証ガード
// - 公開ルートと保護ルートの使い分け
// - 03-auth-blog の App.tsx と同じパターン
// ============================================================

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { GalleryPage } from './pages/GalleryPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AddImagePage } from './pages/AddImagePage';
import { initializeData } from './api';
import { mockUsers } from './data/mockUsers';
import { mockImages } from './data/mockImages';

// --------------------------------------------------
// 初期データの投入
// アプリ起動時にモックデータを localStorage にセットする
// --------------------------------------------------
initializeData(mockUsers, mockImages);

// --------------------------------------------------
// TODO(Q10): React Router によるルーティングを設定してください
//
// 【説明】
// BrowserRouter > AuthProvider > Routes > Route の構造で
// ページ遷移を定義する。Layout コンポーネントで全ページに
// 共通の Header を表示する。
//
// 【ルート構成】
// 1. "/" → GalleryPage（公開ルート）
// 2. "/login" → LoginPage（公開ルート）
// 3. "/register" → RegisterPage（公開ルート）
// 4. "/add" → AddImagePage（保護ルート：ProtectedRoute でラップ）
//
// 【実装手順】
// 1. BrowserRouter でアプリ全体をラップ
// 2. AuthProvider で認証コンテキストを提供
// 3. Routes の中に Route を定義
// 4. Layout を親 Route の element に設定（ネストルート）
// 5. 各ページの Route を子 Route として配置
// 6. "/add" は ProtectedRoute でラップ
//
// 【ヒント】
// - 03-auth-blog の App.tsx とほぼ同じ構造
// - <Route element={<Layout />}> でネストルートの親を定義
// - <Route path="/" element={<GalleryPage />} /> で子ルートを定義
// - <ProtectedRoute><AddImagePage /></ProtectedRoute> で保護
// --------------------------------------------------

export default function App() {
  return (
    // TODO(Q10): ここにルーティング設定を実装してください
    undefined as any
  );
}
