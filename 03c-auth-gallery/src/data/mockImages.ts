// ============================================================
// mockImages.ts ― 初期画像データ
//
// 【説明】
// アプリ初回起動時に localStorage にセットするサンプル画像。
// picsum.photos のプレースホルダー画像を使用。
// ============================================================

import type { GalleryImage } from '../types';

export const mockImages: GalleryImage[] = [
  {
    id: 'img-1',
    url: 'https://picsum.photos/seed/mountain/400/300',
    title: '山の朝焼け',
    description: '早朝に撮影した山の風景。空がオレンジ色に染まっています。',
    ownerId: 'user-1',
    ownerName: '田中太郎',
    createdAt: '2025-01-15T08:30:00.000Z',
  },
  {
    id: 'img-2',
    url: 'https://picsum.photos/seed/ocean/400/300',
    title: '夏の海',
    description: '透き通った青い海。波が穏やかな日でした。',
    ownerId: 'user-2',
    ownerName: '鈴木花子',
    createdAt: '2025-02-10T14:00:00.000Z',
  },
  {
    id: 'img-3',
    url: 'https://picsum.photos/seed/forest/400/300',
    title: '森の小道',
    description: '木漏れ日が差し込む静かな森の中の散歩道。',
    ownerId: 'user-1',
    ownerName: '田中太郎',
    createdAt: '2025-03-05T10:15:00.000Z',
  },
  {
    id: 'img-4',
    url: 'https://picsum.photos/seed/city/400/300',
    title: '夜の街並み',
    description: 'ネオンが輝く都会の夜景。ビルの明かりが美しい。',
    ownerId: 'user-2',
    ownerName: '鈴木花子',
    createdAt: '2025-03-20T21:00:00.000Z',
  },
  {
    id: 'img-5',
    url: 'https://picsum.photos/seed/flower/400/300',
    title: '春の桜',
    description: '満開の桜並木。花びらが風に舞っています。',
    ownerId: 'user-1',
    ownerName: '田中太郎',
    createdAt: '2025-04-01T11:30:00.000Z',
  },
  {
    id: 'img-6',
    url: 'https://picsum.photos/seed/lake/400/300',
    title: '湖畔の夕暮れ',
    description: '夕日が湖面に映る幻想的な風景。',
    ownerId: 'user-2',
    ownerName: '鈴木花子',
    createdAt: '2025-04-15T17:45:00.000Z',
  },
  {
    id: 'img-7',
    url: 'https://picsum.photos/seed/temple/400/300',
    title: '古い寺院',
    description: '歴史ある寺院の門。苔むした石段が趣深い。',
    ownerId: 'user-1',
    ownerName: '田中太郎',
    createdAt: '2025-05-10T09:00:00.000Z',
  },
  {
    id: 'img-8',
    url: 'https://picsum.photos/seed/cat/400/300',
    title: '日向ぼっこする猫',
    description: '窓辺で日向ぼっこする猫。気持ちよさそうに眠っています。',
    ownerId: 'user-2',
    ownerName: '鈴木花子',
    createdAt: '2025-05-25T13:20:00.000Z',
  },
];
