// ============================================================
// vite.config.ts ― Vite 開発サーバーの設定ファイル
//
// 【このファイルで学べること】
// - Vite のプロキシ設定（フロントエンド → バックエンド API への転送）
// - 開発時の CORS 問題を回避する方法
// ============================================================

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// --------------------------------------------------
// Vite 設定
// --------------------------------------------------
export default defineConfig({
  plugins: [react()],

  // 【プロキシとは？】
  // 開発時、フロントエンド（localhost:5173）から
  // バックエンド（localhost:8000）へのリクエストを転送する設定。
  // /api で始まるリクエストを FastAPI サーバーに中継する。
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
