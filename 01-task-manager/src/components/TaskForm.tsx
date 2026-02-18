// ============================================================
// TaskForm.tsx ― タスク追加フォームコンポーネント
//
// 【このファイルで学べること】
// - useState で入力値を管理する（制御コンポーネント）
// - useRef で DOM 要素に直接アクセスする
// - フォームのイベントハンドリング（onSubmit, onChange）
// - as const を使った型の絞り込み
// ============================================================

// React のフックをインポートする
import {
  useState,    // 状態管理フック
  useRef,      // DOM への参照を保持するフック
  useCallback, // 関数をメモ化するフック
} from "react";

// 型定義をインポートする
import type { FormEvent, ChangeEvent } from "react"; // イベントの型
import type { CreateTaskInput, Priority } from "../types";

// --------------------------------------------------
// Props の型定義
// --------------------------------------------------
interface TaskFormProps {
  // 親コンポーネントから渡されるタスク追加関数
  onAdd: (input: CreateTaskInput) => Promise<void>;
}

// --------------------------------------------------
// 優先度の選択肢を定数として定義する
// as const を使うと、配列の要素が readonly かつリテラル型になる
// ["low", "medium", "high"] → readonly ["low", "medium", "high"]
// --------------------------------------------------
const PRIORITIES = [
  { value: "low" as const, label: "低" },       // value は "low" リテラル型
  { value: "medium" as const, label: "中" },     // value は "medium" リテラル型
  { value: "high" as const, label: "高" },       // value は "high" リテラル型
];

// --------------------------------------------------
// TaskForm コンポーネント
// --------------------------------------------------
export function TaskForm({ onAdd }: TaskFormProps) {
  // --------------------------------------------------
  // useState: コンポーネント内の状態を管理するフック
  // const [値, 更新関数] = useState(初期値);
  // 値が変わるとコンポーネントが再レンダリングされる
  // --------------------------------------------------
  const [title, setTitle] = useState("");                       // タイトル入力値
  const [priority, setPriority] = useState<Priority>("medium"); // 優先度

  // --------------------------------------------------
  // useRef: DOM 要素への参照を保持するフック
  // useState と違い、値が変わっても再レンダリングされない
  // .current プロパティで参照先にアクセスする
  // --------------------------------------------------
  // HTMLInputElement | null 型: input 要素またはまだ未接続の null
  const inputRef = useRef<HTMLInputElement>(null);

  // --------------------------------------------------
  // フォーム送信ハンドラ
  // FormEvent: form の onSubmit イベントの型
  // --------------------------------------------------
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      // デフォルトのフォーム送信（ページリロード）を防止する
      e.preventDefault();

      // 空白だけの入力を弾く
      const trimmed = title.trim();
      if (!trimmed) return;

      // 親から渡された関数を呼んでタスクを追加する
      await onAdd({ title: trimmed, priority });

      // フォームをリセットする
      setTitle("");           // 入力値をクリア
      setPriority("medium");  // 優先度をデフォルトに戻す

      // useRef を使って input 要素にフォーカスを当てる
      // ?. はオプショナルチェーン: null の場合はエラーにならず undefined を返す
      inputRef.current?.focus();
    },
    [title, priority, onAdd] // これらの値が変わったときだけ関数を再生成する
  );

  // --------------------------------------------------
  // 入力値の変更ハンドラ
  // ChangeEvent<HTMLInputElement>: input の onChange イベントの型
  // --------------------------------------------------
  const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    // e.target.value で入力された文字列を取得する
    setTitle(e.target.value);
  }, []); // 依存なし: setTitle は React が安定性を保証する

  // 優先度の変更ハンドラ
  const handlePriorityChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    // as Priority で型をアサートする（select の value は string 型のため）
    setPriority(e.target.value as Priority);
  }, []);

  return (
    // onSubmit: フォーム送信時のイベントハンドラ
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="task-form__fields">
        {/* 制御コンポーネント: value と onChange で React が入力値を管理する */}
        {/* ref={inputRef} で useRef の参照先をこの input 要素にする */}
        <input
          ref={inputRef}
          type="text"
          className="task-form__input"
          placeholder="新しいタスクを入力..."
          value={title}              // React の state が表示値を制御する
          onChange={handleTitleChange} // キー入力のたびに state を更新する
          // maxLength: HTML の属性もそのまま使える
          maxLength={100}
        />

        {/* select 要素も制御コンポーネントにする */}
        <select
          className="task-form__select"
          value={priority}
          onChange={handlePriorityChange}
        >
          {/* 配列を map で回して option 要素を生成する */}
          {/* JSX でリストを描画するときは必ず key を指定する */}
          {PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>

        {/* type="submit" でフォームの onSubmit を発火させる */}
        <button type="submit" className="task-form__btn">
          追加
        </button>
      </div>
    </form>
  );
}
