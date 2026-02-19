# React + TypeScript コードリーディング教材集

React・TypeScript の知識を **3ステップ** で段階的に深める教材集です。

```
1回目: 読む（コードリーディング）  → パターンを知る
2回目: 読む（別アプリ）            → パターンの共通点と差分を理解する
3回目: 作る（穴埋め）              → 自分の手で書いて定着させる
```

> **前提知識**: TypeScript の基礎（型、interface、ジェネリクスなど）を理解していることが前提です。
> TypeScript の基礎は [StudyTypescript リポジトリ](https://github.com/i-inose/StudyTypescript) で学べます。

---

## 全体マップ

```
reactReading/
│
│  ── React 基礎 ──────────────────────────
├── 01-task-manager/          1回目: タスク管理（詳細コメント付き）
├── 01b-recipe-book/          2回目: レシピ管理（要点コメント）
├── 01c-habit-tracker/        穴埋め: 習慣トラッカー
│
│  ── ストリーミング UI ────────────────────
├── 02-mastra-rag/            1回目: AI ドキュメント Q&A
├── 02b-streaming-reader/     2回目: ストリーミング読書メモ
├── 02c-chat-simulator/       穴埋め: チャット UI シミュレーター
│
│  ── 認証 UI ─────────────────────────────
├── 03-auth-blog/             1回目: JWT 認証ブログ
├── 03b-auth-notepad/         2回目: 認証付きメモ帳
├── 03c-auth-gallery/         穴埋め: 認証付き画像ギャラリー
│
│  ── リアルタイム UI ─────────────────────
├── 04-realtime-chat/         1回目: WebSocket チャット
├── 04b-realtime-board/       2回目: リアルタイム風ホワイトボード
├── 04c-realtime-vote/        穴埋め: リアルタイム風投票アプリ
│
│  ── 検索・フィルタ UI ───────────────────
├── 05-api-design/            1回目: 商品管理 API
├── 05b-search-movies/        2回目: 映画検索アプリ
└── 05c-search-employees/     穴埋め: 従業員検索アプリ
```

---

## 推奨学習順序

各テーマを **1回目 → 2回目 → 穴埋め** の順で進めてください。

### テーマ 1: React 基礎（最初にここから）

| ステップ | アプリ | 内容 |
|:---:|--------|------|
| 1回目 | [01-task-manager](./01-task-manager/) | useState, useReducer, Context, Router, memo, lazy, Portal, Error Boundary |
| 2回目 | [01b-recipe-book](./01b-recipe-book/) | 同じパターンをレシピ管理で確認（コメント控えめ） |
| 穴埋め | [01c-habit-tracker](./01c-habit-tracker/) | 10箇所の穴埋めで React 基礎を定着 |

### テーマ 2: 検索・フィルタ・ページネーション

| ステップ | アプリ | 内容 |
|:---:|--------|------|
| 1回目 | [05-api-design](./05-api-design/) | useSearchParams, useDebounce, useReducer, ジェネリック型, ページネーション |
| 2回目 | [05b-search-movies](./05b-search-movies/) | 同じパターンを映画検索で確認 |
| 穴埋め | [05c-search-employees](./05c-search-employees/) | 10箇所の穴埋めで検索 UI を定着 |

### テーマ 3: 認証 UI

| ステップ | アプリ | 内容 |
|:---:|--------|------|
| 1回目 | [03-auth-blog](./03-auth-blog/) | AuthContext, ProtectedRoute, トークン管理, フォームバリデーション |
| 2回目 | [03b-auth-notepad](./03b-auth-notepad/) | 同じパターンをメモ帳で確認 |
| 穴埋め | [03c-auth-gallery](./03c-auth-gallery/) | 10箇所の穴埋めで認証パターンを定着 |

### テーマ 4: リアルタイム通信 UI

| ステップ | アプリ | 内容 |
|:---:|--------|------|
| 1回目 | [04-realtime-chat](./04-realtime-chat/) | 接続管理, 判別共用体, useReducer, デバウンス, 自動スクロール |
| 2回目 | [04b-realtime-board](./04b-realtime-board/) | 同じパターンをホワイトボードで確認 |
| 穴埋め | [04c-realtime-vote](./04c-realtime-vote/) | 10箇所の穴埋めでリアルタイム UI を定着 |

### テーマ 5: ストリーミング + チャット UI

| ステップ | アプリ | 内容 |
|:---:|--------|------|
| 1回目 | [02-mastra-rag](./02-mastra-rag/) | SSE ストリーミング, useReducer, useRef, ファイル入力 |
| 2回目 | [02b-streaming-reader](./02b-streaming-reader/) | 同じパターンを読書メモで確認 |
| 穴埋め | [02c-chat-simulator](./02c-chat-simulator/) | 10箇所の穴埋めでストリーミング UI を定着 |

---

## 3ステップの違い

| | 1回目（XX） | 2回目（XXb） | 穴埋め（XXc） |
|---|-----------|------------|------------|
| **目的** | パターンを知る | 共通点と差分を理解する | 手を動かして定着 |
| **コメント量** | 多い（~35-40%） | 要点のみ（~15-20%） | TODO 箇所のみ |
| **バックエンド** | あり（FastAPI / Mastra） | なし（localStorage） | なし（localStorage） |
| **起動方法** | サーバー + フロント | `npm run dev` のみ | `npm run dev` のみ |

---

## 穴埋めアプリの使い方

各穴埋めアプリには10箇所の `// TODO(Q1):` ～ `// TODO(Q10):` が空欄になっています。

```bash
cd 01c-habit-tracker  # (例)
npm install
npm run dev           # → TypeScript エラーやランタイムエラーが出る

# TODO を1つずつ埋めていく
# 全部正しく埋めると、アプリが正常に動作する！
```

- 各 TODO にはヒントと参考ファイルのパスが書いてある
- `_answers/README.md` に模範解答と解説あり（答え合わせ用）
- 1回目のアプリの対応ファイルを見ながら解くのが効果的

---

## セットアップ

### 共通の前提条件

- **Node.js** 18 以上
- **npm** または **yarn**
- **Python** 3.10 以上（1回目アプリのバックエンドのみ）

### 2回目・穴埋めアプリの起動

```bash
cd 01b-recipe-book  # (例)
npm install
npm run dev         # これだけで動く（サーバー不要）
```

### 1回目アプリの起動（バックエンド付き）

```bash
cd 01-task-manager  # (例)
npm install
pip install -r requirements.txt  # Python バックエンドの場合
python server.py                 # ターミナル 1
npm run dev                      # ターミナル 2
```

---

## コメントスタイル

### 1回目アプリ（詳細）
- **ファイルヘッダー**: `【このファイルで学べること】`
- **セクション区切り**: `// ----` で論理ブロックを区切り
- **概念説明**: `【○○とは？】` で初出の概念を解説
- **インライン**: 要点を簡潔に

### 2回目アプリ（控えめ）
- **ファイルヘッダー**: `【このファイルで学べること】`（維持）
- **インライン**: 「なぜこう書くか」に絞った要点のみ

### 穴埋めアプリ
- **TODO 箇所**: ヒント + 参考ファイルパス
- **それ以外**: コメントなし（穴埋めに集中）

---

## 関連リポジトリ

- [StudyTypescript](https://github.com/i-inose/StudyTypescript) — TypeScript 基礎（この教材集の前提知識）
