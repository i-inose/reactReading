# 03c-auth-gallery - 認証付き画像ギャラリー

localStorage ベースの擬似認証を使った画像ギャラリーアプリです。
03-auth-blog のパターン（Context, ProtectedRoute, カスタムフック）を、バックエンドなしで復習できます。

## 機能

- 画像ギャラリーの閲覧（誰でもアクセス可能）
- ユーザー登録 / ログイン（localStorage に保存）
- 画像の追加（ログインユーザーのみ）
- 画像の削除（画像の所有者のみ）

## セットアップ

```bash
npm install
npm run dev
```

## テスト用アカウント

| ユーザー名 | パスワード | 表示名 |
|-----------|-----------|-------|
| user1     | password1 | 田中太郎 |
| user2     | password2 | 鈴木花子 |

## TODO 一覧（穴埋め問題）

全 10 問。`// TODO(QN):` で検索してください。

| # | ファイル | 内容 |
|---|---------|------|
| Q1 | `src/types.ts` | User, GalleryImage, AuthState インターフェースの定義 |
| Q2 | `src/contexts/AuthContext.tsx` | createContext + AuthProvider（useEffect による復元、Provider ラップ） |
| Q3 | `src/hooks/useAuth.ts` | useContext のラッパーフック（null チェック付き） |
| Q4 | `src/api.ts` | checkAuth と getAuthHeader の実装（localStorage 版） |
| Q5 | `src/components/ProtectedRoute.tsx` | Navigate による認証ガード |
| Q6 | `src/components/LoginForm.tsx` | useState + フォーム送信ハンドラ |
| Q7 | `src/hooks/useGallery.ts` | localStorage を使った画像 CRUD（loadImages, addImage, deleteImage） |
| Q8 | `src/components/ImageCard.tsx` | 所有者判定と条件付きレンダリング |
| Q9 | `src/pages/GalleryPage.tsx` | useEffect + map によるギャラリー表示 |
| Q10 | `src/App.tsx` | React Router のルーティング設定 |

## 回答

`_answers/README.md` に全問の回答と解説があります。

## 03-auth-blog との対比

| 項目 | 03-auth-blog | 03c-auth-gallery |
|------|-------------|-----------------|
| バックエンド | FastAPI (Python) | なし（localStorage） |
| 認証方式 | JWT (access_token + refresh_token) | 擬似トークン (`user-{id}-{timestamp}`) |
| データ取得 | fetch() / apiClient() | localStorage.getItem() |
| トークンリフレッシュ | あり（401 時に自動） | なし |
| パターン | Context + useAuth + ProtectedRoute | 同じ |
