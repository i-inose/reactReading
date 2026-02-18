// ============================================================
// vite.config.ts ― Vite ビルドツールの設定ファイル
//
// 【このファイルで学べること】
// - Vite のプロキシ設定（開発時に CORS を回避する手法）
// - defineConfig による型安全な設定
// ============================================================

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// --------------------------------------------------
// Vite 設定のエクスポート
// --------------------------------------------------
export default defineConfig({
  plugins: [react()],

  // 【プロキシとは？】
  // 開発時、フロントエンド（:5173）からバックエンド（:8000）への
  // リクエストを Vite が中継する仕組み。CORS 問題を回避できる。
  // /api/* へのリクエストを自動的に localhost:8000 に転送する。
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
