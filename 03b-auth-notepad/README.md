# 03b-auth-notepad ― 認証付きメモ帳アプリ

03-auth-blog と同じ React パターンを、メモ帳アプリという別のドメインで復習する「2nd reading」プロジェクト。

## 起動方法

```bash
npm install
npm run dev
```

## サンプルアカウント

| ユーザー名 | メールアドレス       | パスワード    |
|-----------|--------------------|-----------  |
| たろう     | taro@example.com   | password123 |
| はなこ     | hanako@example.com | password123 |

## 03-auth-blog との比較表

| 観点                | 03-auth-blog              | 03b-auth-notepad            |
|---------------------|---------------------------|-----------------------------|
| ドメイン            | ブログ記事                 | メモ帳                       |
| バックエンド        | FastAPI (JWT)             | なし（localStorage のみ）     |
| 認証方式            | JWT (access + refresh)    | 擬似トークン (localStorage)  |
| API クライアント    | fetch + インターセプター    | localStorage 直接操作        |
| Context API         | AuthContext               | AuthContext（同じ構造）       |
| ProtectedRoute      | あり                      | あり（同じパターン）          |
| カスタムフック      | useAuth, useArticles      | useAuth, useNotes            |
| フォームバリデーション | あり                   | あり（同じパターン）          |
| 認可チェック        | 著者のみ編集/削除          | オーナーのみ編集/削除         |
| 検索機能            | なし                      | タイトル・本文・タグ検索      |
| タグ機能            | なし                      | あり                         |
| マイページ          | なし                      | マイメモ一覧                  |

## 学べる React パターン

| パターン                  | ファイル                        |
|--------------------------|--------------------------------|
| Context API              | `src/contexts/AuthContext.tsx`  |
| ProtectedRoute           | `src/components/ProtectedRoute.tsx` |
| localStorage トークン管理 | `src/api.ts`                   |
| useEffect (初期化)       | `src/contexts/AuthContext.tsx`  |
| フォームバリデーション     | `src/components/RegisterForm.tsx`, `src/components/NoteForm.tsx` |
| 認可チェック              | `src/pages/NoteDetailPage.tsx`, `src/pages/EditPage.tsx` |
| カスタムフック            | `src/hooks/useAuth.ts`, `src/hooks/useNotes.ts` |

## ファイル構成

```
src/
├── api.ts                 # 擬似認証 API（localStorage ベース）
├── types.ts               # 型定義
├── App.tsx                # ルート定義
├── main.tsx               # エントリーポイント
├── contexts/
│   └── AuthContext.tsx     # 認証状態管理
├── hooks/
│   ├── useAuth.ts         # 認証コンテキストラッパー
│   └── useNotes.ts        # メモ CRUD 操作
├── components/
│   ├── Header.tsx         # ナビゲーションバー
│   ├── Layout.tsx         # 共通レイアウト
│   ├── LoginForm.tsx      # ログインフォーム
│   ├── RegisterForm.tsx   # 登録フォーム
│   ├── NoteCard.tsx       # メモカード
│   ├── NoteForm.tsx       # メモ作成/編集フォーム
│   ├── NoteList.tsx       # メモ一覧 + 検索
│   └── ProtectedRoute.tsx # 認証ガード
├── pages/
│   ├── HomePage.tsx       # 全メモ一覧（公開）
│   ├── MyNotesPage.tsx    # マイメモ一覧（要認証）
│   ├── NoteDetailPage.tsx # メモ詳細
│   ├── WritePage.tsx      # 新規作成（要認証）
│   ├── EditPage.tsx       # 編集（要認証 + オーナー）
│   ├── LoginPage.tsx      # ログイン
│   └── RegisterPage.tsx   # 登録
└── data/
    ├── mockUsers.ts       # サンプルユーザー
    └── mockNotes.ts       # サンプルメモ
```

## localStorage キー

| キー                   | 内容               |
|-----------------------|-------------------|
| `auth-notepad-users`  | 登録済みユーザー一覧  |
| `auth-notepad-auth`   | 認証トークン + ユーザー情報 |
| `auth-notepad-notes`  | メモデータ一覧       |
