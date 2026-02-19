// 【このファイルで学べること】
// - カスタムフックによる CRUD ロジックの分離
// - localStorage をデータストアとして使うパターン
// - 03-auth-blog の useArticles と同じ構造（API → localStorage に置換）

import { useState, useCallback } from 'react';
import type { Note, NoteCreateInput, NoteUpdateInput } from '../types';
import { useAuth } from './useAuth';

const NOTES_KEY = 'auth-notepad-notes';

// localStorage からメモ一覧を取得
function loadNotes(): Note[] {
  const raw = localStorage.getItem(NOTES_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Note[];
  } catch {
    return [];
  }
}

// localStorage にメモ一覧を保存
function saveNotes(notes: Note[]): void {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

interface UseNotesReturn {
  notes: Note[];
  note: Note | null;
  isLoading: boolean;
  error: string | null;
  fetchNotes: (ownerId?: string) => Promise<void>;
  fetchNote: (id: string) => Promise<void>;
  createNote: (input: NoteCreateInput) => Promise<Note>;
  updateNote: (id: string, input: NoteUpdateInput) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
}

export function useNotes(): UseNotesReturn {
  const [notes, setNotes] = useState<Note[]>([]);
  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // メモ一覧取得（ownerId 指定で絞り込み可能）
  const fetchNotes = useCallback(async (ownerId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 100));
      let all = loadNotes();
      if (ownerId) {
        all = all.filter((n) => n.ownerId === ownerId);
      }
      setNotes(all);
    } catch {
      setError('メモの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 単一メモ取得
  const fetchNote = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 100));
      const all = loadNotes();
      const found = all.find((n) => n.id === id);
      if (!found) throw new Error('メモが見つかりません');
      setNote(found);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'メモの取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // メモ作成
  const createNote = useCallback(async (input: NoteCreateInput): Promise<Note> => {
    if (!user) throw new Error('ログインが必要です');
    const now = new Date().toISOString();
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: input.title,
      content: input.content,
      ownerId: user.id,
      ownerName: user.username,
      tags: input.tags.split(',').map((t) => t.trim()).filter(Boolean),
      createdAt: now,
      updatedAt: now,
    };
    const all = loadNotes();
    saveNotes([newNote, ...all]);
    return newNote;
  }, [user]);

  // メモ更新（オーナーのみ）
  const updateNote = useCallback(async (id: string, input: NoteUpdateInput): Promise<Note> => {
    if (!user) throw new Error('ログインが必要です');
    const all = loadNotes();
    const idx = all.findIndex((n) => n.id === id);
    if (idx === -1) throw new Error('メモが見つかりません');
    if (all[idx].ownerId !== user.id) throw new Error('編集権限がありません');

    const updated: Note = {
      ...all[idx],
      title: input.title ?? all[idx].title,
      content: input.content ?? all[idx].content,
      tags: input.tags !== undefined
        ? input.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : all[idx].tags,
      updatedAt: new Date().toISOString(),
    };
    all[idx] = updated;
    saveNotes(all);
    return updated;
  }, [user]);

  // メモ削除（オーナーのみ）
  const deleteNote = useCallback(async (id: string): Promise<void> => {
    if (!user) throw new Error('ログインが必要です');
    const all = loadNotes();
    const target = all.find((n) => n.id === id);
    if (!target) throw new Error('メモが見つかりません');
    if (target.ownerId !== user.id) throw new Error('削除権限がありません');

    saveNotes(all.filter((n) => n.id !== id));
  }, [user]);

  return {
    notes,
    note,
    isLoading,
    error,
    fetchNotes,
    fetchNote,
    createNote,
    updateNote,
    deleteNote,
  };
}
