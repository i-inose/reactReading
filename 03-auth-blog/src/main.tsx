// ============================================================
// main.tsx ― アプリケーションのエントリーポイント
//
// 【このファイルで学べること】
// - React アプリの起動プロセス
// - StrictMode によるバグの早期発見
// ============================================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './App.css';

// 【createRoot とは？】
// React 18 で導入された新しいルート API。
// #root 要素を React のルートとして登録し、App コンポーネントをレンダリングする。
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
