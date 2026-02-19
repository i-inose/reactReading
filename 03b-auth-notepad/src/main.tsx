// 【このファイルで学べること】
// - React アプリの起動プロセス
// - StrictMode によるバグの早期発見
// - アプリ起動時のサンプルデータ投入

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initMockUsers } from './data/mockUsers';
import { initMockNotes } from './data/mockNotes';
import './index.css';
import './App.css';

// localStorage にサンプルデータを投入する（初回のみ）
initMockUsers();
initMockNotes();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
