// ============================================================
// App.tsx ― ルーティング設定
//
// 【このファイルで学べること】
// - React Router v7 の Routes / Route によるページ切り替え
// ============================================================

import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { MovieListPage } from "./pages/MovieListPage";
import { MovieDetailPage } from "./pages/MovieDetailPage";
import "./App.css";

function App() {
  return (
    <>
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<MovieListPage />} />
          <Route path="/movies/:id" element={<MovieDetailPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
