# JWT 認証付きブログアプリ

## 概要

JWT（JSON Web Token）による認証・認可を学ぶための、フルスタックブログアプリケーションです。

- **フロントエンド**: React 19 + TypeScript + Vite 7 + React Router 7
- **バックエンド**: FastAPI + SQLAlchemy + SQLite + PyJWT + bcrypt
- **認証方式**: JWT（アクセストークン + リフレッシュトークン）

## 前提知識

- React の基本（コンポーネント、Props、State、useEffect）
- TypeScript の基本（型定義、interface）
- REST API の基本（GET, POST, PATCH, DELETE）
- Python の基本文法

## セットアップ

### バックエンド

```bash
cd 03-auth-blog
pip install -r requirements.txt
python server.py
# → http://localhost:8000 で起動
# → http://localhost:8000/docs で Swagger UI が見られる
```

### フロントエンド

```bash
cd 03-auth-blog
npm install
npm run dev
# → http://localhost:5173 で起動
```

### テスト用アカウント

サーバー初回起動時にサンプルデータが自動投入されます。

| ユーザー名  | メールアドレス     | パスワード    |
| ----------- | ------------------- | ------------- |
| testuser1   | user1@example.com   | password123   |
| testuser2   | user2@example.com   | password123   |
| testuser3   | user3@example.com   | password123   |

## コードリーディング順序

以下の順序でコードを読むことを推奨します。

### Step 1: バックエンド（server.py）

| 順番 | セクション | 学べること |
| ---- | ---------- | ---------- |
| 1-1 | データベースモデル（User, Article） | SQLAlchemy ORM、リレーション定義 |
| 1-2 | Pydantic スキーマ | API の入出力型定義、モデルとスキーマの違い |
| 1-3 | 認証ユーティリティ | bcrypt ハッシュ、JWT トークン生成 |
| 1-4 | 依存性注入（Depends） | get_db、get_current_user パターン |
| 1-5 | 認証エンドポイント | 登録・ログイン・リフレッシュの流れ |
| 1-6 | 記事エンドポイント | CRUD 操作、認可チェック |

### Step 2: フロントエンド

| 順番 | ファイル | 学べること |
| ---- | -------- | ---------- |
| 2-1 | `src/types.ts` | アプリ全体の型定義 |
| 2-2 | `src/api.ts` | API クライアント、トークンインターセプター |
| 2-3 | `src/contexts/AuthContext.tsx` | Context API、認証状態管理 |
| 2-4 | `src/hooks/useAuth.ts` | カスタムフック、Context のラッパー |
| 2-5 | `src/components/ProtectedRoute.tsx` | 認証ガード、リダイレクト |
| 2-6 | `src/hooks/useArticles.ts` | CRUD 操作のカスタムフック |
| 2-7 | `src/components/LoginForm.tsx` | フォーム、バリデーション |
| 2-8 | `src/components/RegisterForm.tsx` | クライアントサイドバリデーション |
| 2-9 | `src/components/ArticleCard.tsx` | Props 設計、日時フォーマット |
| 2-10 | `src/components/ArticleList.tsx` | 配列レンダリング、key |
| 2-11 | `src/components/ArticleForm.tsx` | 作成/編集の共通フォーム |
| 2-12 | `src/pages/HomePage.tsx` | useEffect でのデータ取得 |
| 2-13 | `src/pages/ArticlePage.tsx` | useParams、認可制御 |
| 2-14 | `src/pages/LoginPage.tsx` | ログイン後リダイレクト |
| 2-15 | `src/pages/WritePage.tsx` | 保護されたページ |
| 2-16 | `src/pages/EditPage.tsx` | 著者チェック |
| 2-17 | `src/App.tsx` | ルート定義、全体構成 |

## 主な学習テーマ

### 認証フロー（JWT）
```
登録/ログイン → サーバーがトークン発行 → フロントエンドが保存
→ API リクエスト時に Authorization ヘッダーで送信
→ サーバーがトークンを検証 → ユーザーを特定
```

### トークンリフレッシュ
```
アクセストークン期限切れ → 401 レスポンス
→ リフレッシュトークンで新しいアクセストークンを取得
→ 元のリクエストをリトライ
```

### 認可（Authorization）
```
記事の編集/削除リクエスト
→ サーバー: article.author_id == current_user.id を確認
→ 一致しなければ 403 Forbidden
→ フロントエンド: 著者のみに編集/削除ボタンを表示
```

## ファイル構成

```
03-auth-blog/
├── server.py              # バックエンド API サーバー
├── requirements.txt       # Python 依存パッケージ
├── package.json           # Node.js 依存パッケージ
├── vite.config.ts         # Vite 設定（API プロキシ）
├── index.html             # HTML エントリーポイント
└── src/
    ├── main.tsx           # アプリ起動
    ├── App.tsx            # ルート定義
    ├── App.css            # コンポーネントスタイル
    ├── index.css          # グローバルスタイル
    ├── types.ts           # 型定義
    ├── api.ts             # API クライアント
    ├── contexts/
    │   └── AuthContext.tsx # 認証コンテキスト
    ├── hooks/
    │   ├── useAuth.ts     # 認証フック
    │   └── useArticles.ts # 記事 CRUD フック
    ├── components/
    │   ├── Header.tsx     # ヘッダー
    │   ├── Layout.tsx     # レイアウト
    │   ├── ProtectedRoute.tsx  # 認証ガード
    │   ├── LoginForm.tsx       # ログインフォーム
    │   ├── RegisterForm.tsx    # 登録フォーム
    │   ├── ArticleCard.tsx     # 記事カード
    │   ├── ArticleList.tsx     # 記事一覧
    │   └── ArticleForm.tsx     # 記事フォーム
    └── pages/
        ├── HomePage.tsx        # トップページ
        ├── ArticlePage.tsx     # 記事詳細
        ├── WritePage.tsx       # 記事作成
        ├── EditPage.tsx        # 記事編集
        ├── LoginPage.tsx       # ログイン
        └── RegisterPage.tsx    # ユーザー登録
```
