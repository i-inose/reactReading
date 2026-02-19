import type { Habit } from "../types";

export const initialHabits: Habit[] = [
  {
    id: 1,
    name: "読書 30分",
    completedDates: ["2025-06-10", "2025-06-11", "2025-06-12"],
    createdAt: "2025-06-01T09:00:00.000Z",
    color: "#4a90d9",
  },
  {
    id: 2,
    name: "ランニング",
    completedDates: ["2025-06-11", "2025-06-12"],
    createdAt: "2025-06-02T10:00:00.000Z",
    color: "#27ae60",
  },
  {
    id: 3,
    name: "瞑想 10分",
    completedDates: ["2025-06-10"],
    createdAt: "2025-06-03T08:00:00.000Z",
    color: "#8e44ad",
  },
  {
    id: 4,
    name: "英語学習",
    completedDates: [],
    createdAt: "2025-06-05T11:00:00.000Z",
    color: "#e74c3c",
  },
  {
    id: 5,
    name: "水を2L飲む",
    completedDates: ["2025-06-09", "2025-06-10", "2025-06-11", "2025-06-12"],
    createdAt: "2025-06-01T07:00:00.000Z",
    color: "#1abc9c",
  },
];
