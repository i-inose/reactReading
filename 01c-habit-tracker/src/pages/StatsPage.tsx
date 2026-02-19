import { useMemo } from "react";
import { useHabits } from "../hooks/useHabits";

export function StatsPage() {
  const { habits } = useHabits();

  const weekDays = useMemo(() => {
    const days: string[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }
    return days;
  }, []);

  const totalCompletions = useMemo(() => {
    return habits.reduce((sum, h) => sum + h.completedDates.length, 0);
  }, [habits]);

  const bestHabit = useMemo(() => {
    if (habits.length === 0) return null;
    return habits.reduce((best, h) =>
      h.completedDates.length > best.completedDates.length ? h : best
    );
  }, [habits]);

  return (
    <div className="stats-page">
      <h1 className="stats-page__title">統計ページ</h1>

      <div className="stats-page__overview">
        <div className="stats-page__card">
          <span className="stats-page__card-label">習慣の数</span>
          <span className="stats-page__card-value">{habits.length}</span>
        </div>
        <div className="stats-page__card">
          <span className="stats-page__card-label">合計完了回数</span>
          <span className="stats-page__card-value">{totalCompletions}</span>
        </div>
        <div className="stats-page__card">
          <span className="stats-page__card-label">最も達成した習慣</span>
          <span className="stats-page__card-value">
            {bestHabit ? `${bestHabit.name} (${bestHabit.completedDates.length}回)` : "-"}
          </span>
        </div>
      </div>

      <h2 className="stats-page__subtitle">過去7日間</h2>
      <div className="stats-page__grid">
        <div className="stats-page__grid-header">
          <span className="stats-page__grid-label">習慣</span>
          {weekDays.map((day) => (
            <span key={day} className="stats-page__grid-day">
              {day.slice(5)}
            </span>
          ))}
        </div>
        {habits.map((habit) => (
          <div key={habit.id} className="stats-page__grid-row">
            <span
              className="stats-page__grid-name"
              style={{ borderLeftColor: habit.color }}
            >
              {habit.name}
            </span>
            {weekDays.map((day) => (
              <span
                key={day}
                className={`stats-page__grid-cell ${
                  habit.completedDates.includes(day)
                    ? "stats-page__grid-cell--done"
                    : ""
                }`}
                style={
                  habit.completedDates.includes(day)
                    ? { backgroundColor: habit.color }
                    : undefined
                }
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
