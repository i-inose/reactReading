import type { Habit, HabitAction } from "../types";

export interface HabitState {
  habits: Habit[];
}

export const initialHabitState: HabitState = {
  habits: [],
};

// TODO(Q3): habitReducer の switch 文の各 case を実装してください
// 4つの case を実装します:
//   "LOAD"   → habits を action.payload で丸ごと置き換える
//   "ADD"    → 新しい Habit を作成して配列の末尾に追加する
//              id は Date.now()、completedDates は []、createdAt は new Date().toISOString()
//   "TOGGLE" → 指定された id の習慣の completedDates を切り替える
//              その日付が含まれていれば除去、なければ追加する
//   "DELETE" → 指定された id の習慣を配列から除外する
//
// ヒント: スプレッド構文 ...state で既存の state をコピーし、
//         変更したいプロパティだけ上書きする（イミュータブル更新）
// 参考: 01-task-manager/src/reducers/taskReducer.ts の taskReducer 関数
export function habitReducer(state: HabitState, action: HabitAction): HabitState {
  switch (action.type) {
    // ここに4つの case を書いてください

    default:
      return state;
  }
}
