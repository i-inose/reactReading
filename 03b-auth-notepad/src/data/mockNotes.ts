// 【このファイルで学べること】
// - 複数ユーザーにまたがるサンプルデータの設計

import type { Note } from '../types';

export const mockNotes: Note[] = [
  {
    id: 'note-1',
    title: 'React の基本メモ',
    content: 'React はコンポーネントベースのUIライブラリ。JSX を使ってUIを宣言的に記述する。状態管理には useState、副作用には useEffect を使う。',
    ownerId: 'user-1',
    ownerName: 'たろう',
    tags: ['React', '基本'],
    createdAt: '2025-03-01T10:00:00.000Z',
    updatedAt: '2025-03-01T10:00:00.000Z',
  },
  {
    id: 'note-2',
    title: 'TypeScript の型システム',
    content: 'TypeScript は JavaScript に型を追加した言語。interface と type で型を定義し、コンパイル時にエラーを検出できる。ジェネリクスで再利用可能な型を作れる。',
    ownerId: 'user-1',
    ownerName: 'たろう',
    tags: ['TypeScript', '型'],
    createdAt: '2025-03-05T14:30:00.000Z',
    updatedAt: '2025-03-06T09:00:00.000Z',
  },
  {
    id: 'note-3',
    title: 'useEffect の使い方',
    content: 'useEffect は副作用を扱うフック。依存配列が空なら初回マウント時のみ実行。クリーンアップ関数を返すことでアンマウント時の処理を定義できる。',
    ownerId: 'user-1',
    ownerName: 'たろう',
    tags: ['React', 'Hooks'],
    createdAt: '2025-03-10T11:00:00.000Z',
    updatedAt: '2025-03-10T11:00:00.000Z',
  },
  {
    id: 'note-4',
    title: 'CSS Grid レイアウト入門',
    content: '2次元レイアウトには CSS Grid が便利。grid-template-columns と grid-template-rows でグリッドを定義。gap でアイテム間の余白を設定する。',
    ownerId: 'user-2',
    ownerName: 'はなこ',
    tags: ['CSS', 'レイアウト'],
    createdAt: '2025-03-12T08:00:00.000Z',
    updatedAt: '2025-03-12T08:00:00.000Z',
  },
  {
    id: 'note-5',
    title: 'React Router の設定方法',
    content: 'BrowserRouter でアプリをラップし、Routes + Route でパスとコンポーネントを対応付ける。Link コンポーネントでページ遷移。useParams でURLパラメータを取得。',
    ownerId: 'user-2',
    ownerName: 'はなこ',
    tags: ['React', 'Router'],
    createdAt: '2025-03-15T16:00:00.000Z',
    updatedAt: '2025-03-16T10:00:00.000Z',
  },
  {
    id: 'note-6',
    title: 'localStorage でデータ永続化',
    content: 'localStorage.setItem でデータを保存し、getItem で取得する。JSON.stringify/parse でオブジェクトを文字列に変換する。ブラウザを閉じてもデータは残る。',
    ownerId: 'user-2',
    ownerName: 'はなこ',
    tags: ['JavaScript', 'ブラウザAPI'],
    createdAt: '2025-03-18T13:00:00.000Z',
    updatedAt: '2025-03-18T13:00:00.000Z',
  },
];

// localStorage にサンプルメモがなければ投入する
export function initMockNotes(): void {
  const key = 'auth-notepad-notes';
  const existing = localStorage.getItem(key);
  if (!existing || JSON.parse(existing).length === 0) {
    localStorage.setItem(key, JSON.stringify(mockNotes));
  }
}
