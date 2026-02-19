import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatPage } from "./pages/ChatPage.tsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ChatPage />} />
        <Route
          path="*"
          element={
            <div className="not-found">
              <h1>404</h1>
              <p>ページが見つかりません</p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
