import type { Habit } from "../types";
import { HabitItem } from "./HabitItem";

interface HabitListProps {
  habits: Habit[];
  todayStr: string;
  onToggle: (id: number, date: string) => void;
  onDelete: (id: number) => void;
}

export function HabitList({ habits, todayStr, onToggle, onDelete }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div className="habit-list__empty">
        <p>習慣がまだありません。上のフォームから追加しましょう！</p>
      </div>
    );
  }

  return (
    <ul className="habit-list">
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          todayStr={todayStr}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
