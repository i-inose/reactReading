// ============================================================
// vite.config.ts - Vite ビルドツール設定
// ============================================================
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
