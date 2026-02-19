// 【このファイルで学べること】
// - 認証状態に応じた条件付きレンダリング（03-auth-blog と同じパターン）
// - Link と useNavigate の使い分け

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo">
          Auth Notepad
        </Link>

        <nav className="header__nav">
          <Link to="/" className="header__link">みんなのメモ</Link>

          {/* 認証状態で表示を切り替える */}
          {isAuthenticated ? (
            <>
              <Link to="/my-notes" className="header__link">マイメモ</Link>
              <Link to="/write" className="header__link">新規作成</Link>
              <span className="header__user">{user?.username}</span>
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
