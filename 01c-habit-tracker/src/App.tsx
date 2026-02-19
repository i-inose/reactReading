import { Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { StatsPage } from "./pages/StatsPage";
import "./App.css";

// TODO(Q10): React Router のルーティングを設定してください
// 以下の構造を BrowserRouter の中に作ります:
//   <BrowserRouter>
//     <Layout>
//       <Suspense fallback={<div className="page-loading">読み込み中...</div>}>
//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/stats" element={<StatsPage />} />
//           <Route path="*" element={<div className="not-found"><h1>404</h1><p>ページが見つかりません</p></div>} />
//         </Routes>
//       </Suspense>
//     </Layout>
//   </BrowserRouter>
//
// ヒント: BrowserRouter > Layout > Suspense > Routes > Route の順にネストする。
//         path="/" はトップページ、path="*" は404ページ。
// 参考: 01-task-manager/src/App.tsx の App コンポーネント
function App() {
  // ここに ThemeProvider + BrowserRouter + Layout + Suspense + Routes を書いてください
  void Suspense;
  void Routes;
  void Route;
  void BrowserRouter;
  void Layout;
  void HomePage;
  void StatsPage;

  return (
    <ThemeProvider>
      {/* BrowserRouter 以下のルーティング構造をここに書く */}
      <div>ルーティングを実装してください</div>
    </ThemeProvider>
  );
}

export default App;
