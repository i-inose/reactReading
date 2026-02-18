// ============================================================
// useArticles.ts ― 記事の CRUD 操作を管理するカスタムフック
//
// 【このファイルで学べること】
// - カスタムフックによるデータ取得ロジックの分離
// - useState + useCallback で API 呼び出しを管理する方法
// - apiClient を使ったトークン付きリクエスト
// ============================================================

import { useState, useCallback } from 'react';
import type { Article, ArticleCreateInput, ArticleUpdateInput } from '../types';
import { apiClient } from '../api';

// --------------------------------------------------
// フックの戻り値の型
// --------------------------------------------------
interface UseArticlesReturn {
  articles: Article[];           // 記事一覧
  article: Article | null;       // 単一記事の詳細
  isLoading: boolean;            // ローディング状態
  error: string | null;          // エラーメッセージ
  fetchArticles: (authorId?: number) => Promise<void>;
  fetchArticle: (id: number) => Promise<void>;
  createArticle: (input: ArticleCreateInput) => Promise<Article>;
  updateArticle: (id: number, input: ArticleUpdateInput) => Promise<Article>;
  deleteArticle: (id: number) => Promise<void>;
}

// --------------------------------------------------
// useArticles フック
// --------------------------------------------------
export function useArticles(): UseArticlesReturn {
  const [articles, setArticles] = useState<Article[]>([]);
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 記事一覧を取得する（著者 ID で絞り込み可能）
  const fetchArticles = useCallback(async (authorId?: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const query = authorId ? `?author_id=${authorId}` : '';
      const res = await apiClient(`/api/articles${query}`);
      if (!res.ok) throw new Error('記事の取得に失敗しました');
      const data: Article[] = await res.json();
      setArticles(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : '記事の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 記事の詳細を取得する
  const fetchArticle = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient(`/api/articles/${id}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error('記事が見つかりません');
        throw new Error('記事の取得に失敗しました');
      }
      const data: Article = await res.json();
      setArticle(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : '記事の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 記事を作成する（認証必須）
  const createArticle = useCallback(async (input: ArticleCreateInput): Promise<Article> => {
    const res = await apiClient('/api/articles', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || '記事の作成に失敗しました');
    }
    return await res.json();
  }, []);

  // 記事を更新する（認証 + 著者のみ）
  const updateArticle = useCallback(async (id: number, input: ArticleUpdateInput): Promise<Article> => {
    const res = await apiClient(`/api/articles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || '記事の更新に失敗しました');
    }
    return await res.json();
  }, []);

  // 記事を削除する（認証 + 著者のみ）
  const deleteArticle = useCallback(async (id: number): Promise<void> => {
    const res = await apiClient(`/api/articles/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok && res.status !== 204) {
      const err = await res.json();
      throw new Error(err.detail || '記事の削除に失敗しました');
    }
  }, []);

  return {
    articles,
    article,
    isLoading,
    error,
    fetchArticles,
    fetchArticle,
    createArticle,
    updateArticle,
    deleteArticle,
  };
}
