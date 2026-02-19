// TODO(Q1): Habit インターフェースの各プロパティに正しい型を指定してください
// 以下の5つのプロパティの型（any）を正しい型に書き換えます:
//   id           → number
//   name         → string
//   completedDates → string[]  （完了した日付の配列。例: ["2025-01-15", "2025-01-16"]）
//   createdAt    → string      （ISO文字列）
//   color        → string      （表示色。例: "#4a90d9"）
//
// ヒント: 01-task-manager/src/types.ts の Task インターフェースを参考に、
//         各 any を具体的な型に置き換えてください
// 参考: 01-task-manager/src/types.ts
export interface Habit {
  id: any;               // ← 正しい型に書き換える
  name: any;             // ← 正しい型に書き換える
  completedDates: any;   // ← 正しい型に書き換える
  createdAt: any;        // ← 正しい型に書き換える
  color: any;            // ← 正しい型に書き換える
}

export type ThemeMode = "light" | "dark";

// TODO(Q2): HabitAction の判別共用体型を定義してください
// 以下の4つのアクションを | で繋いだユニオン型を作ります:
//   ADD:    { type: "ADD";    payload: Omit<Habit, "id" | "completedDates" | "createdAt"> }
//   TOGGLE: { type: "TOGGLE"; payload: { id: number; date: string } }
//   DELETE: { type: "DELETE"; payload: number }
//   LOAD:   { type: "LOAD";   payload: Habit[] }
//
// ヒント: type フィールドで分岐できる「判別共用体（Discriminated Union）」を作る。
//         各アクションを | で繋げて書きます。
// 参考: 01-task-manager/src/reducers/taskReducer.ts の TaskAction 型
export type HabitAction = undefined as any; // ← ここを正しい判別共用体型に書き換える
