# 解答集 — Habit Tracker 穴埋めアプリ

> **注意**: まず自力で挑戦してください。わからないときだけ確認しましょう。

---

## Q1: Habit インターフェース (`src/types.ts`)

**ファイル**: `src/types.ts`

```typescript
export interface Habit {
  id: number;
  name: string;
  completedDates: string[];
  createdAt: string;
  color: string;
}
```

**解説**: TypeScript の `interface` でオブジェクトの「形」を定義します。各プロパティに型を指定することで、間違ったデータを渡すとコンパイル時にエラーになります。`completedDates` は文字列の配列 (`string[]`) で、完了した日付を ISO 形式 (`"2025-01-15"`) で格納します。

---

## Q2: HabitAction 判別共用体型 (`src/types.ts`)

**ファイル**: `src/types.ts`

```typescript
export type HabitAction =
  | { type: "ADD"; payload: Omit<Habit, "id" | "completedDates" | "createdAt"> }
  | { type: "TOGGLE"; payload: { id: number; date: string } }
  | { type: "DELETE"; payload: number }
  | { type: "LOAD"; payload: Habit[] };
```

**解説**: 判別共用体（Discriminated Union）は、共通の `type` フィールドで分岐できるユニオン型です。`switch (action.type)` で分岐すると、TypeScript が各 case の `payload` の型を自動的に絞り込みます。`Omit<Habit, "id" | "completedDates" | "createdAt">` は Habit から指定プロパティを除いた型を作るユーティリティ型です。

---

## Q3: habitReducer の switch ケース (`src/reducers/habitReducer.ts`)

**ファイル**: `src/reducers/habitReducer.ts`

```typescript
export function habitReducer(state: HabitState, action: HabitAction): HabitState {
  switch (action.type) {
    case "LOAD":
      return {
        ...state,
        habits: action.payload,
      };

    case "ADD":
      return {
        ...state,
        habits: [
          ...state.habits,
          {
            ...action.payload,
            id: Date.now(),
            completedDates: [],
            createdAt: new Date().toISOString(),
          },
        ],
      };

    case "TOGGLE": {
      const { id, date } = action.payload;
      return {
        ...state,
        habits: state.habits.map((habit) =>
          habit.id === id
            ? {
                ...habit,
                completedDates: habit.completedDates.includes(date)
                  ? habit.completedDates.filter((d) => d !== date)
                  : [...habit.completedDates, date],
              }
            : habit
        ),
      };
    }

    case "DELETE":
      return {
        ...state,
        habits: state.habits.filter((habit) => habit.id !== action.payload),
      };

    default:
      return state;
  }
}
```

**解説**: Reducer は `(state, action) => newState` の純粋関数です。スプレッド構文 (`...state`) で既存の state をコピーし、変更箇所だけ上書きする「イミュータブル更新」がポイントです。TOGGLE では、日付が含まれていれば `filter` で除去、なければ `[...array, item]` で追加します。

---

## Q4: ThemeProvider の実装 (`src/contexts/ThemeContext.tsx`)

**ファイル**: `src/contexts/ThemeContext.tsx`

```typescript
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("theme");
    return (saved === "light" || saved === "dark") ? saved : "light";
  });

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      return next;
    });
  }, []);

  const isDark = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

**解説**: Context API の Provider パターンです。`useState` の遅延初期化（引数に関数を渡す）で、localStorage の読み込みは初回レンダリング時だけ実行されます。`useCallback` で `toggleTheme` をメモ化し、不要な再生成を防ぎます。`Provider` の `value` に渡したオブジェクトが、子孫コンポーネントで `useContext` で取得できます。

---

## Q5: useHabits カスタムフック (`src/hooks/useHabits.ts`)

**ファイル**: `src/hooks/useHabits.ts`

```typescript
export function useHabits(): UseHabitsReturn {
  const [state, dispatch] = useReducer(habitReducer, { habits: loadHabits() });

  useEffect(() => {
    saveHabits(state.habits);
  }, [state.habits]);

  const addHabit = useCallback((name: string, color: string) => {
    dispatch({ type: "ADD", payload: { name, color } });
  }, []);

  const toggleHabit = useCallback((id: number, date: string) => {
    dispatch({ type: "TOGGLE", payload: { id, date } });
  }, []);

  const deleteHabit = useCallback((id: number) => {
    dispatch({ type: "DELETE", payload: id });
  }, []);

  return {
    habits: state.habits,
    addHabit,
    toggleHabit,
    deleteHabit,
  };
}
```

**解説**: `useReducer` は `useState` の高機能版で、複雑な状態管理に適しています。`useEffect` で `state.habits` の変更を監視し、localStorage に自動保存します。各操作関数は `useCallback` でメモ化し、`dispatch` でアクションを発行します。

---

## Q6: React.memo + useCallback (`src/components/HabitItem.tsx`)

**ファイル**: `src/components/HabitItem.tsx`

```typescript
function HabitItemInner({ habit, todayStr, onToggle, onDelete }: HabitItemProps) {
  const isDoneToday = habit.completedDates.includes(todayStr);

  const handleToggle = useCallback(() => {
    onToggle(habit.id, todayStr);
  }, [habit.id, todayStr, onToggle]);

  const handleDelete = useCallback(() => {
    onDelete(habit.id);
  }, [habit.id, onDelete]);

  // ... 残りの JSX
}

export const HabitItem = memo(HabitItemInner);
```

**解説**: `memo()` はコンポーネントの Props が変わらなければ再レンダリングをスキップする高階コンポーネントです。`useCallback` でイベントハンドラをメモ化し、依存配列に必要な値を入れます。これにより、親コンポーネントが再レンダリングされても、Props が同じなら子はスキップされます。

---

## Q7: useState + onSubmit (`src/components/HabitForm.tsx`)

**ファイル**: `src/components/HabitForm.tsx`

```typescript
export function HabitForm({ onAdd }: HabitFormProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLORS[0]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), color);
    setName("");
  };

  // ... 残りの JSX
}
```

**解説**: `useState` でフォームの入力値を管理する「制御されたコンポーネント (Controlled Component)」パターンです。`e.preventDefault()` でフォームのデフォルト送信（ページリロード）を防ぎ、`onAdd` で親に値を渡した後、`setName("")` で入力欄をリセットします。

---

## Q8: useMemo で統計計算 (`src/components/HabitStats.tsx`)

**ファイル**: `src/components/HabitStats.tsx`

```typescript
const stats = useMemo(() => {
  const totalHabits = habits.length;
  const todayStr = new Date().toISOString().split("T")[0];
  const completedToday = habits.filter((h) =>
    h.completedDates.includes(todayStr)
  ).length;
  const completionRate =
    totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  return { totalHabits, completedToday, completionRate, todayStr };
}, [habits]);
```

**解説**: `useMemo` は計算結果をキャッシュするフックです。依存配列 `[habits]` に指定した値が変わったときだけ再計算されます。習慣の一覧が変わるたびに統計を再計算しますが、無関係な再レンダリングでは前回の結果を再利用します。

---

## Q9: createPortal でモーダル描画 (`src/components/Modal.tsx`)

**ファイル**: `src/components/Modal.tsx`

```typescript
return createPortal(
  <div
    className="modal-overlay"
    onClick={onClose}
    role="dialog"
    aria-modal="true"
  >
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal__header">
        <h2 className="modal__title">{title}</h2>
        <button className="modal__close" onClick={onClose} aria-label="閉じる">
          &#10005;
        </button>
      </div>
      <div className="modal__body">{children}</div>
    </div>
  </div>,
  document.body
);
```

**解説**: `createPortal(JSX, DOM要素)` は、React ツリーの親子関係を保ちつつ、DOM 上では指定した要素（ここでは `document.body`）の直下にレンダリングします。これにより、親の `overflow: hidden` などの CSS の影響を受けません。`e.stopPropagation()` でモーダル本体のクリックがオーバーレイの `onClick` に伝播するのを防ぎます。

---

## Q10: React Router の設定 (`src/App.tsx`)

**ファイル**: `src/App.tsx`

```typescript
function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<div className="page-loading">読み込み中...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/stats" element={<StatsPage />} />
              <Route path="*" element={
                <div className="not-found">
                  <h1>404</h1>
                  <p>ページが見つかりません</p>
                </div>
              } />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
```

**解説**: React Router の基本的なルーティング設定です。`BrowserRouter` で URL ベースのルーティングを有効にし、`Routes` の中に `Route` を並べます。`path="/"` はトップページ、`path="/stats"` は統計ページ、`path="*"` はどのルートにもマッチしなかった場合の 404 ページです。`Layout` でヘッダーとフッターを共通化し、`Suspense` で遅延読み込み中の表示を制御します。
