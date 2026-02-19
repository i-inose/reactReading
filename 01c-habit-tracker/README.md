# Habit Tracker — React + TypeScript 穴埋め学習アプリ

## このアプリについて

日々の習慣を管理するアプリです。習慣の追加・完了記録・統計表示ができます。
データはブラウザの localStorage に保存され、バックエンド不要で動作します。

このプロジェクトは **穴埋め形式** の学習教材です。コード内の 10 箇所の `TODO` を正しく埋めると、アプリが完全に動作します。

## セットアップ

```bash
npm install
npm run dev
```

## 学習の進め方

1. まず `01-task-manager`（1st リーディング教材）のコードを読んで理解する
2. このプロジェクトの各 TODO を、参考ファイルを見ながら埋めていく
3. `npm run dev` で動作確認する
4. わからないときは `_answers/README.md` を確認する

## TODO 一覧（全 10 問）

| # | ファイル | 内容 | 学べること |
|---|---------|------|-----------|
| Q1 | `src/types.ts` | Habit インターフェースの定義 | interface、プロパティの型指定 |
| Q2 | `src/types.ts` | HabitAction 判別共用体型の定義 | Discriminated Union、Omit |
| Q3 | `src/reducers/habitReducer.ts` | Reducer の switch ケース実装 | useReducer、イミュータブル更新 |
| Q4 | `src/contexts/ThemeContext.tsx` | ThemeProvider の実装 | Context API、Provider パターン |
| Q5 | `src/hooks/useHabits.ts` | カスタムフックの中核実装 | useReducer、useEffect、useCallback |
| Q6 | `src/components/HabitItem.tsx` | memo + useCallback の最適化 | React.memo、useCallback |
| Q7 | `src/components/HabitForm.tsx` | フォーム状態管理 | useState、Controlled Component |
| Q8 | `src/components/HabitStats.tsx` | useMemo で統計計算 | useMemo、メモ化 |
| Q9 | `src/components/Modal.tsx` | createPortal でモーダル描画 | createPortal、DOM ポータル |
| Q10 | `src/App.tsx` | React Router のルーティング設定 | BrowserRouter、Routes、Route |

## 参考プロジェクト

各 TODO のヒントに記載されている参考ファイルは `01-task-manager` プロジェクト内のファイルです。

## 技術スタック

- React 19.2.0
- React Router 7.13.0
- TypeScript ~5.9.3
- Vite 7.3.1
