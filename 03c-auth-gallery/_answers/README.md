# Auth Gallery - 回答集

## Q1: User, GalleryImage, AuthState インターフェースの定義（src/types.ts）

**学習ポイント**: TypeScript のインターフェース定義、ユニオン型（`User | null`）

```typescript
export interface User {
  id: string;           // ユーザーID（"user-1717000000000" 形式）
  username: string;     // ログイン用ユーザー名
  password: string;     // パスワード（学習用のため平文。実際はハッシュ化すべき）
  displayName: string;  // 表示名
}

export interface GalleryImage {
  id: string;           // 画像ID（"img-1717000000000" 形式）
  url: string;          // 画像の URL
  title: string;        // 画像タイトル
  description: string;  // 画像の説明
  ownerId: string;      // 投稿者のユーザーID
  ownerName: string;    // 投稿者の表示名
  createdAt: string;    // 作成日時（ISO 8601 形式）
}

export interface AuthState {
  user: User | null;          // ログイン中のユーザー（未ログインなら null）
  token: string | null;       // 認証トークン（未認証なら null）
  isAuthenticated: boolean;   // ログイン済みかどうか
}
```

**解説**: `User | null` はユニオン型と呼ばれ、「User 型か null のどちらか」を表します。ログイン前は null、ログイン後は User オブジェクトが入ります。

---

## Q2: AuthContext の作成と AuthProvider（src/contexts/AuthContext.tsx）

**学習ポイント**: createContext, Provider パターン, useEffect による状態復元

```typescript
// コンテキストの作成
export const AuthContext = createContext<AuthContextType | null>(null);

// useEffect による認証状態の復元
useEffect(() => {
  const tokenStr = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (tokenStr && userStr) {
    try {
      const user = JSON.parse(userStr) as User;
      setAuthState({
        user,
        token: tokenStr,
        isAuthenticated: true,
      });
    } catch {
      // パースに失敗したら認証情報をクリア
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }
}, []);

// Provider のラップ
return (
  <AuthContext.Provider value={{ authState, login, register, logout }}>
    {children}
  </AuthContext.Provider>
);
```

**解説**: `createContext<AuthContextType | null>(null)` で初期値 null のコンテキストを作成します。Provider でラップされた子コンポーネントだけが値にアクセスできます。useEffect の依存配列 `[]` は「マウント時に1回だけ実行」を意味します。

---

## Q3: useAuth カスタムフック（src/hooks/useAuth.ts）

**学習ポイント**: useContext のラッパーフック、null チェックによる型の絞り込み

```typescript
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error('useAuth は AuthProvider の内部で使用してください');
  }

  return context;
}
```

**解説**: `useContext(AuthContext)` の戻り値は `AuthContextType | null` ですが、null チェック後は TypeScript が自動で `AuthContextType` に絞り込みます。これを「型の絞り込み（Narrowing）」と呼びます。

---

## Q4: 擬似認証ユーティリティ（src/api.ts）

**学習ポイント**: localStorage の読み書き、トークンパターンのシミュレーション

```typescript
export function checkAuth(token: string): User | null {
  if (!token.startsWith('user-')) return null;

  // token 形式: "user-user-1-1717000000000"
  // userId 部分を抽出（最後の "-数字" がタイムスタンプ）
  const lastDashIndex = token.lastIndexOf('-');
  const userId = token.substring(5, lastDashIndex); // "user-" の後からタイムスタンプの前まで

  const usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!usersJson) return null;

  try {
    const users: User[] = JSON.parse(usersJson);
    return users.find((u) => u.id === userId) ?? null;
  } catch {
    return null;
  }
}

export function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}
```

**解説**: 03-auth-blog では実際の HTTP リクエストで `Authorization: Bearer <token>` ヘッダーを送信していました。このアプリではバックエンドがないため localStorage でシミュレートしていますが、パターンは同じです。`Record<string, string>` は「文字列キーと文字列値のオブジェクト」を表す型です。

---

## Q5: ProtectedRoute の実装（src/components/ProtectedRoute.tsx）

**学習ポイント**: Navigate コンポーネント、useLocation、認証ガードパターン

```typescript
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { authState } = useAuth();
  const location = useLocation();

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
```

**解説**: `Navigate` は React Router のリダイレクトコンポーネントです。`state` プロパティで現在のパスを渡し、ログイン後に元のページに戻れるようにします。`replace` を付けると履歴に残らず「置換」になります。

---

## Q6: LoginForm の実装（src/components/LoginForm.tsx）

**学習ポイント**: useState によるフォーム状態管理、FormEvent、async/await

```typescript
const [username, setUsername] = useState('');
const [password, setPassword] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  try {
    await onSubmit(username, password);
  } finally {
    setIsSubmitting(false);
  }
};
```

**解説**: `useState('')` は空文字列を初期値とする状態を作成します。`e.preventDefault()` はフォームのデフォルト動作（ページリロード）を防止します。`finally` ブロックは成功・失敗に関わらず必ず実行されます。

---

## Q7: useGallery カスタムフック（src/hooks/useGallery.ts）

**学習ポイント**: localStorage CRUD、useCallback によるメモ化、配列操作

```typescript
const loadImages = useCallback(() => {
  setIsLoading(true);
  setError(null);
  try {
    const json = localStorage.getItem(STORAGE_KEYS.IMAGES);
    const data: GalleryImage[] = json ? JSON.parse(json) : [];
    // 新しい順にソート
    data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setImages(data);
  } catch (e) {
    setError(e instanceof Error ? e.message : '画像の読み込みに失敗しました');
  } finally {
    setIsLoading(false);
  }
}, []);

const addImage = useCallback((image: Omit<GalleryImage, 'id' | 'createdAt'>) => {
  const json = localStorage.getItem(STORAGE_KEYS.IMAGES);
  const data: GalleryImage[] = json ? JSON.parse(json) : [];

  const newImage: GalleryImage = {
    ...image,
    id: `img-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  data.push(newImage);
  localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(data));
  loadImages();
}, [loadImages]);

const deleteImage = useCallback((id: string, currentUserId: string) => {
  const json = localStorage.getItem(STORAGE_KEYS.IMAGES);
  const data: GalleryImage[] = json ? JSON.parse(json) : [];

  const target = data.find((img) => img.id === id);
  if (!target) {
    setError('画像が見つかりません');
    return;
  }
  if (target.ownerId !== currentUserId) {
    setError('この画像を削除する権限がありません');
    return;
  }

  const filtered = data.filter((img) => img.id !== id);
  localStorage.setItem(STORAGE_KEYS.IMAGES, JSON.stringify(filtered));
  loadImages();
}, [loadImages]);
```

**解説**: `Omit<GalleryImage, 'id' | 'createdAt'>` は GalleryImage 型から id と createdAt を除いた型を表します。useCallback は関数をメモ化し、不要な再生成を防ぎます。

---

## Q8: ImageCard の実装（src/components/ImageCard.tsx）

**学習ポイント**: 条件付きレンダリング、認証状態に応じた UI 出し分け

```typescript
const { authState } = useAuth();
const isOwner = authState.user?.id === image.ownerId;

// JSX の中で:
{isOwner && (
  <button
    className="image-card__delete"
    onClick={() => onDelete(image.id)}
  >
    削除
  </button>
)}
```

**解説**: `authState.user?.id` はオプショナルチェーンで、user が null/undefined の場合は undefined を返します。`{isOwner && <button>...</button>}` は && 演算子による条件付きレンダリングで、isOwner が true のときだけ削除ボタンを表示します。

---

## Q9: GalleryPage の実装（src/pages/GalleryPage.tsx）

**学習ポイント**: useEffect による初回データ取得、map による一覧表示

```typescript
// useEffect で初回読み込み
useEffect(() => {
  loadImages();
}, [loadImages]);

// JSX の中で:
{authState.isAuthenticated && (
  <Link to="/add" className="page__add-button">画像を追加</Link>
)}

// 画像一覧:
{images.map((image) => (
  <ImageCard key={image.id} image={image} onDelete={handleDelete} />
))}
```

**解説**: `useEffect(() => { ... }, [loadImages])` でマウント時に画像を読み込みます。`images.map()` で配列を JSX の配列に変換し、`key={image.id}` で React に各要素を一意に識別させます。

---

## Q10: React Router のルーティング設定（src/App.tsx）

**学習ポイント**: BrowserRouter, Routes, Route, ネストルート, ProtectedRoute

```typescript
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            {/* 公開ルート */}
            <Route path="/" element={<GalleryPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* 保護ルート（ProtectedRoute でラップ） */}
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <AddImagePage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

**解説**: `<Route element={<Layout />}>` はネストルートの親で、Layout の `<Outlet />` の位置に子ルートがレンダリングされます。`<ProtectedRoute>` で囲むと、未認証ユーザーはログインページにリダイレクトされます。AuthProvider は BrowserRouter の内側に配置し、すべてのルートで認証状態を共有できるようにします。
