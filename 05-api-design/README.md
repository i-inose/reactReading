# 05 - REST API Design Patterns（商品管理アプリ）

REST API の設計パターンを学ぶための商品管理アプリケーション。
フロントエンド（React + TypeScript）とバックエンド（FastAPI + SQLAlchemy）の両方を通して、実践的な API 設計を理解する。

## 起動方法

### バックエンド

```bash
cd 05-api-design
pip install -r requirements.txt
python server.py
# → http://localhost:8000 で起動
# → http://localhost:8000/docs で Swagger UI（API ドキュメント）
```

### フロントエンド

```bash
cd 05-api-design
npm install
npm run dev
# → http://localhost:5173 で起動
```

## 学べる技術・パターン

| カテゴリ | 技術・パターン |
|---------|-------------|
| バックエンド | SQLAlchemy ORM、ページネーション、動的フィルタリング、動的ソート |
| バックエンド | バックグラウンドタスク、カスタム例外ハンドラー、依存性注入 |
| フロントエンド | useReducer による複雑な状態管理、useDebounce によるデバウンス |
| フロントエンド | URL クエリパラメータとの同期（useSearchParams） |
| フロントエンド | ジェネリクス（PaginatedResponse\<T\>）、Discriminated Union |
| 共通 | REST API 設計（CRUD、ページネーション、フィルタリング、ソート） |

## コードリーディング順序

### Step 1: 設定ファイルを確認する

| # | ファイル | 学ぶこと |
|---|---------|---------|
| 1 | `package.json` | 依存パッケージの確認 |
| 2 | `vite.config.ts` | プロキシ設定（CORS 回避） |
| 3 | `requirements.txt` | Python パッケージの確認 |

### Step 2: バックエンド（server.py）を読む

server.py は上から順に読むと理解しやすい。

| # | セクション | 行数目安 | 学ぶこと |
|---|-----------|---------|---------|
| 1 | DB 接続設定 | 上部 | Engine, Session, Base の役割 |
| 2 | モデル定義 | CategoryModel, ProductModel | ORM によるテーブル定義、relationship |
| 3 | Pydantic スキーマ | 各 Schema クラス | API 入出力の型定義 |
| 4 | カスタム例外 | Error クラス + handler | 例外からHTTPレスポンスへの変換 |
| 5 | DI パターン | get_db 関数 | Depends による DB セッション注入 |
| 6 | GET /products | get_products 関数 | ページネーション + フィルタ + ソート |
| 7 | POST/PATCH/DELETE | CRUD エンドポイント | 作成・更新・削除パターン |
| 8 | CSV インポート | import + background task | BackgroundTasks、ジョブ管理 |
| 9 | シードデータ | seed_database 関数 | startup イベント、初期データ投入 |

### Step 3: フロントエンドの型定義と API クライアント

| # | ファイル | 学ぶこと |
|---|---------|---------|
| 1 | `src/types.ts` | Product, PaginatedResponse\<T\>, フィルタ型 |
| 2 | `src/api.ts` | fetch API, URLSearchParams, エラーハンドリング |

### Step 4: カスタムフック

| # | ファイル | 学ぶこと |
|---|---------|---------|
| 1 | `src/hooks/useDebounce.ts` | ジェネリクス、タイマーのクリーンアップ |
| 2 | `src/hooks/useProducts.ts` | useReducer, useSearchParams, データフェッチ |

### Step 5: UI コンポーネント

| # | ファイル | 学ぶこと |
|---|---------|---------|
| 1 | `src/components/Header.tsx` | Link コンポーネント |
| 2 | `src/components/SearchBar.tsx` | Controlled Component |
| 3 | `src/components/FilterPanel.tsx` | チェックボックスグループ、数値入力 |
| 4 | `src/components/SortSelect.tsx` | select 要素、複合値の管理 |
| 5 | `src/components/Pagination.tsx` | ページ範囲計算、disabled 制御 |
| 6 | `src/components/ProductCard.tsx` | カード UI、数値フォーマット |
| 7 | `src/components/ProductTable.tsx` | ソート機能、テーブルレイアウト |
| 8 | `src/components/ProductForm.tsx` | フォーム送信、モーダル |

### Step 6: ページコンポーネント

| # | ファイル | 学ぶこと |
|---|---------|---------|
| 1 | `src/pages/ProductListPage.tsx` | 検索・フィルタ・ソート・ページネーションの統合 |
| 2 | `src/pages/ProductDetailPage.tsx` | 単一リソースの CRUD UI |

### Step 7: エントリーポイント

| # | ファイル | 学ぶこと |
|---|---------|---------|
| 1 | `src/main.tsx` | createRoot, BrowserRouter |
| 2 | `src/App.tsx` | Routes, Route によるルーティング |

## API エンドポイント一覧

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/api/products` | 商品一覧（ページネーション+フィルタ+ソート） |
| GET | `/api/products/:id` | 商品詳細 |
| POST | `/api/products` | 商品作成 |
| PATCH | `/api/products/:id` | 商品更新（部分更新） |
| DELETE | `/api/products/:id` | 商品削除 |
| POST | `/api/products/import` | CSV 一括インポート |
| GET | `/api/jobs/:jobId` | インポートジョブ状態 |
| GET | `/api/categories` | カテゴリ一覧 |

## ファイル構成

```
05-api-design/
├── server.py              # バックエンド API サーバー
├── requirements.txt       # Python 依存パッケージ
├── package.json           # Node.js 依存パッケージ
├── vite.config.ts         # Vite 設定（プロキシ）
├── tsconfig.json          # TypeScript 設定
├── index.html             # HTML テンプレート
└── src/
    ├── main.tsx           # エントリーポイント
    ├── App.tsx            # ルーティング設定
    ├── types.ts           # 型定義
    ├── api.ts             # API クライアント
    ├── index.css          # グローバルスタイル
    ├── App.css            # コンポーネントスタイル
    ├── hooks/
    │   ├── useDebounce.ts # デバウンスフック
    │   └── useProducts.ts # 商品データ管理フック
    ├── components/
    │   ├── Header.tsx     # ナビゲーション
    │   ├── SearchBar.tsx  # 検索バー
    │   ├── FilterPanel.tsx # フィルタパネル
    │   ├── SortSelect.tsx # ソートセレクター
    │   ├── Pagination.tsx # ページネーション
    │   ├── ProductCard.tsx # 商品カード
    │   ├── ProductTable.tsx # 商品テーブル
    │   └── ProductForm.tsx # 商品フォーム
    └── pages/
        ├── ProductListPage.tsx  # 商品一覧ページ
        └── ProductDetailPage.tsx # 商品詳細ページ
```
