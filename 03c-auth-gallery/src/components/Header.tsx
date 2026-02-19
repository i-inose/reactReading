// ============================================================
// Header.tsx ― ナビゲーションバー + 認証状態の表示
//
// 【このファイルで学べること】
// - useAuth フックで認証状態を取得する方法
// - 認証状態に応じた条件付きレンダリング
// - React Router の Link と useNavigate の使い分け
// ============================================================

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Header() {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();

  // ログアウト後にトップページへ遷移する
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header__inner">
        {/* サイトタイトル（トップページへのリンク） */}
        <Link to="/" className="header__logo">
          Auth Gallery
        </Link>

        {/* ナビゲーションリンク */}
        <nav className="header__nav">
          <Link to="/" className="header__link">ギャラリー</Link>

          {authState.isAuthenticated ? (
            <>
              <Link to="/add" className="header__link">画像を追加</Link>
              <span className="header__user">{authState.user?.displayName}</span>
              <button onClick={handleLogout} className="header__button">
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="header__link">ログイン</Link>
              <Link to="/register" className="header__link header__link--accent">
                登録
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
