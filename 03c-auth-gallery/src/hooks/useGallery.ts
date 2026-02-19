// ============================================================
// useGallery.ts ― 画像ギャラリーの CRUD 操作を管理するカスタムフック
//
// 【このファイルで学べること】
// - カスタムフックによるデータ操作ロジックの分離
// - localStorage を使った CRUD（Create, Read, Delete）操作
// - useState + useCallback によるメモ化パターン
// - 03-auth-blog の useArticles.ts との対比（API vs localStorage）
// ============================================================

import { useState, useCallback } from 'react';
import type { GalleryImage } from '../types';
import { STORAGE_KEYS } from '../api';

// --------------------------------------------------
// フックの戻り値の型
// --------------------------------------------------
interface UseGalleryReturn {
  images: GalleryImage[];
  isLoading: boolean;
  error: string | null;
  loadImages: () => void;
  addImage: (image: Omit<GalleryImage, 'id' | 'createdAt'>) => void;
  deleteImage: (id: string, currentUserId: string) => void;
}

// --------------------------------------------------
// TODO(Q7): useGallery カスタムフックを実装してください
//
// 【説明】
// localStorage から画像データを読み書きするカスタムフック。
// 03-auth-blog の useArticles.ts では API 経由でしたが、
// このアプリでは localStorage を直接操作します。
//
// 【実装する関数】
// 1. loadImages(): localStorage から画像一覧を読み込んで state にセット
//    - STORAGE_KEYS.IMAGES キーから JSON を取得してパース
//    - createdAt の降順（新しい順）にソート
//
// 2. addImage(image): 新しい画像を追加
//    - id を `img-${Date.now()}` で生成
//    - createdAt を new Date().toISOString() で生成
//    - localStorage の配列に追加して保存
//    - loadImages() を呼んで state を更新
//
// 3. deleteImage(id, currentUserId): 画像を削除（所有者チェック付き）
//    - 画像の ownerId が currentUserId と一致するか確認
//    - 一致しなければエラーを投げる
//    - 一致すれば localStorage から削除して保存
//    - loadImages() を呼んで state を更新
//
// 【ヒント】
// - localStorage.getItem() → JSON.parse() → 配列操作 → JSON.stringify() → localStorage.setItem()
// - sort((a, b) => ...) で日時の降順ソート
// - filter() で削除対象を除外
// --------------------------------------------------

export function useGallery(): UseGalleryReturn {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TODO(Q7): loadImages, addImage, deleteImage を実装してください

  const loadImages = useCallback(() => {
    // ここに実装してください
  }, []);

  const addImage = useCallback((image: Omit<GalleryImage, 'id' | 'createdAt'>) => {
    // ここに実装してください
  }, [loadImages]);

  const deleteImage = useCallback((id: string, currentUserId: string) => {
    // ここに実装してください
  }, [loadImages]);

  return {
    images,
    isLoading,
    error,
    loadImages,
    addImage,
    deleteImage,
  };
}
