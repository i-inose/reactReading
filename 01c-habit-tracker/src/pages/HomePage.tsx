import { useState, useMemo } from "react";
import { useHabits } from "../hooks/useHabits";
import { HabitForm } from "../components/HabitForm";
import { HabitList } from "../components/HabitList";
import { HabitStats } from "../components/HabitStats";
import { Modal } from "../components/Modal";

export function HomePage() {
  const { habits, addHabit, toggleHabit, deleteHabit } = useHabits();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const todayStr = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  return (
    <div className="home-page">
      <h1 className="home-page__title">今日の習慣</h1>

      <HabitStats habits={habits} />
      <HabitForm onAdd={addHabit} />
      <HabitList
        habits={habits}
        todayStr={todayStr}
        onToggle={toggleHabit}
        onDelete={deleteHabit}
      />

      <button
        className="home-page__help-btn"
        onClick={() => setIsHelpOpen(true)}
      >
        使い方
      </button>

      <Modal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="使い方"
      >
        <div className="help-content">
          <h3>習慣を追加する</h3>
          <p>上部のフォームに習慣の名前を入力し、色を選んで「追加」を押してください。</p>

          <h3>習慣を完了にする</h3>
          <p>習慣の左にある丸をクリックすると、今日の完了を記録できます。もう一度押すと取り消せます。</p>

          <h3>統計を見る</h3>
          <p>ヘッダーの「統計」リンクから、詳しい達成状況を確認できます。</p>

          <h3>データの保存</h3>
          <p>データはブラウザの localStorage に自動保存されます。リロードしても消えません。</p>
        </div>
      </Modal>
    </div>
  );
}
