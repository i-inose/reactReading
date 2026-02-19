import { useReducer, useEffect, useCallback } from "react";
import { habitReducer, initialHabitState } from "../reducers/habitReducer";
import { initialHabits } from "../data/initialHabits";
import type { Habit, HabitAction } from "../types";

const STORAGE_KEY = "habit-tracker-habits";

function loadHabits(): Habit[] {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved) as Habit[];
  }
  return initialHabits;
}

function saveHabits(habits: Habit[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

interface UseHabitsReturn {
  habits: Habit[];
  addHabit: (name: string, color: string) => void;
  toggleHabit: (id: number, date: string) => void;
  deleteHabit: (id: number) => void;
}

// TODO(Q5): useHabits カスタムフックの中核部分を実装してください
// 以下の3つを実装します:
//   1. useReducer で habitReducer と初期状態を使い、[state, dispatch] を取得する
//      初期状態は initialHabitState ではなく、{ habits: loadHabits() } を使う
//   2. useEffect で state.habits が変わるたびに saveHabits(state.habits) を呼ぶ
//   3. useCallback で addHabit, toggleHabit, deleteHabit の3関数を作る
//      それぞれ dispatch で適切なアクションを発行する
//
// ヒント: useReducer の戻り値は [state, dispatch] のタプル。
//         dispatch({ type: "ADD", payload: { name, color } }) のように使う。
// 参考: 01-task-manager/src/hooks/useTasks.ts の useTasks フック
export function useHabits(): UseHabitsReturn {
  // ここに useReducer, useEffect, useCallback を書いてください

  const _state = undefined as any as { habits: Habit[] }; // ← useReducer で置き換える
  const _dispatch = undefined as any as React.Dispatch<HabitAction>; // ← useReducer で置き換える

  void useReducer; // ← 正しく実装したらこの行を削除
  void useEffect; // ← 正しく実装したらこの行を削除
  void useCallback; // ← 正しく実装したらこの行を削除
  void habitReducer; // ← 正しく実装したらこの行を削除
  void initialHabitState; // ← 正しく実装したらこの行を削除
  void loadHabits; // ← 正しく実装したらこの行を削除
  void saveHabits; // ← 正しく実装したらこの行を削除
  void _dispatch;

  return {
    habits: _state.habits,
    addHabit: (_name: string, _color: string) => {}, // ← useCallback + dispatch で置き換える
    toggleHabit: (_id: number, _date: string) => {}, // ← useCallback + dispatch で置き換える
    deleteHabit: (_id: number) => {}, // ← useCallback + dispatch で置き換える
  };
}
