# ============================================================
# server.py ― JWT 認証付きブログ API サーバー
# FastAPI + SQLAlchemy + JWT による本格的な認証・認可システム
#
# 【このファイルで学べること】
# - JWT（JSON Web Token）による認証フロー
# - bcrypt によるパスワードのハッシュ化
# - SQLAlchemy ORM によるデータベース操作
# - FastAPI の依存性注入（Depends）パターン
# - アクセストークンとリフレッシュトークンの使い分け
# - 認可（Authorization）: リソースの所有者チェック
# ============================================================

# --------------------------------------------------
# モジュールのインポート
# --------------------------------------------------
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone, timedelta

# 【SQLAlchemy とは？】
# Python の ORM（Object-Relational Mapping）ライブラリ。
# SQL を直接書かずに、Python のクラスでデータベースを操作できる。
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, Session, relationship

# 【JWT とは？】
# JSON Web Token の略。ユーザー認証情報を JSON 形式で
# エンコード・署名したトークン。サーバーはセッションを保持せず、
# トークンの署名を検証するだけで認証できる（ステートレス認証）。
import jwt

# 【bcrypt とは？】
# パスワードを安全にハッシュ化するライブラリ。
# ソルト（ランダムな文字列）を自動で付与し、同じパスワードでも
# 毎回異なるハッシュ値を生成する。元のパスワードに戻せない（一方向性）。
import bcrypt

# --------------------------------------------------
# 定数の定義
# --------------------------------------------------

# JWT の署名に使う秘密鍵（本番環境では環境変数から読み込むべき）
JWT_SECRET = "my-super-secret-key-for-educational-purposes"

# JWT の署名アルゴリズム（HS256 = HMAC-SHA256）
JWT_ALGORITHM = "HS256"

# アクセストークンの有効期限（30分）― API リクエストに使う短命なトークン
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# リフレッシュトークンの有効期限（7日）― アクセストークンの再発行に使う長命なトークン
REFRESH_TOKEN_EXPIRE_DAYS = 7

# --------------------------------------------------
# 1. データベースのセットアップ（SQLAlchemy）
#
# 【ORM（Object-Relational Mapping）とは？】
# データベースのテーブルを Python のクラスとして表現し、
# SQL 文を書かずにデータベース操作を行う仕組み。
# --------------------------------------------------

# SQLite データベースへの接続設定
# check_same_thread=False: FastAPI の非同期処理で必要
engine = create_engine(
    "sqlite:///blog.db",
    connect_args={"check_same_thread": False},
)

# セッションファクトリ: DB 操作のたびにセッションを生成する
# autocommit=False: 明示的に commit() するまで反映しない
# autoflush=False: 明示的に flush() するまで SQL を発行しない
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 全モデルの基底クラス（これを継承してテーブルを定義する）
Base = declarative_base()

# --------------------------------------------------
# 2. データベースモデルの定義
#
# 【リレーション（関連）とは？】
# テーブル間の参照関係。User は複数の Article を持ち、
# Article は 1 人の User（著者）に属する（1対多の関係）。
# --------------------------------------------------


class User(Base):
    """ユーザーテーブル"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # relationship: User.articles で関連する記事一覧を取得できる
    # back_populates: 双方向の関連を定義する（Article.author と対応）
    articles = relationship("Article", back_populates="author")


class Article(Base):
    """記事テーブル"""
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    body = Column(Text, nullable=False)

    # 【外部キー（Foreign Key）とは？】
    # 別テーブルの主キーを参照するカラム。
    # これにより Article と User の関連を DB レベルで保証する。
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))

    # relationship: Article.author で著者の User オブジェクトを取得できる
    author = relationship("User", back_populates="articles")


# --------------------------------------------------
# 3. Pydantic スキーマ（リクエスト/レスポンスの型定義）
#
# SQLAlchemy のモデル（DB の構造）と
# Pydantic のスキーマ（API の入出力）は役割が異なる。
# - モデル: DB テーブルの構造を定義
# - スキーマ: API で受け取る/返すデータの形を定義
# --------------------------------------------------

# --- ユーザー関連 ---

class UserCreate(BaseModel):
    """ユーザー登録時の入力スキーマ"""
    username: str = Field(min_length=2, max_length=50)
    email: str = Field(min_length=5, max_length=100)
    password: str = Field(min_length=6, max_length=100)


class UserResponse(BaseModel):
    """ユーザー情報のレスポンススキーマ（パスワードは含めない）"""
    id: int
    username: str
    email: str
    created_at: datetime

    # model_config: Pydantic v2 で ORM モデルからの変換を有効にする
    model_config = {"from_attributes": True}


class LoginRequest(BaseModel):
    """ログイン時の入力スキーマ"""
    email: str
    password: str


class TokenResponse(BaseModel):
    """トークンのレスポンススキーマ"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class RefreshRequest(BaseModel):
    """トークンリフレッシュ時の入力スキーマ"""
    refresh_token: str


# --- 記事関連 ---

class ArticleCreate(BaseModel):
    """記事作成時の入力スキーマ"""
    title: str = Field(min_length=1, max_length=200)
    body: str = Field(min_length=1)


class ArticleUpdate(BaseModel):
    """記事更新時の入力スキーマ（部分更新: 全フィールド Optional）"""
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    body: Optional[str] = Field(default=None, min_length=1)


class AuthorInfo(BaseModel):
    """記事レスポンスに含める著者情報"""
    id: int
    username: str
    model_config = {"from_attributes": True}


class ArticleResponse(BaseModel):
    """記事のレスポンススキーマ"""
    id: int
    title: str
    body: str
    author: AuthorInfo
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}


# --------------------------------------------------
# 4. 認証ユーティリティ関数
#
# 【認証（Authentication）と認可（Authorization）の違い】
# 認証: 「あなたは誰？」を確認する（ログイン）
# 認可: 「あなたに権限がある？」を確認する（自分の記事か？）
# --------------------------------------------------

# FastAPI の Bearer トークン認証スキーム
# Authorization: Bearer <token> ヘッダーからトークンを抽出する
security = HTTPBearer()
# auto_error=False 版: トークンがなくてもエラーにしない（公開 API 用）
optional_security = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    """パスワードをハッシュ化する

    bcrypt.hashpw() でソルト付きハッシュを生成する。
    同じパスワードでも毎回異なるハッシュ値になる（ソルトが異なるため）。
    """
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    """パスワードとハッシュを照合する

    ユーザーが入力したパスワードを同じアルゴリズムでハッシュ化し、
    保存済みのハッシュと比較する。一致すれば True。
    """
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


def create_access_token(user_id: int) -> str:
    """アクセストークンを生成する

    【JWT の構造】
    Header.Payload.Signature の3部分で構成される。
    - Header: アルゴリズム情報
    - Payload: ユーザー情報 + 有効期限（クレーム）
    - Signature: Header + Payload を秘密鍵で署名したもの
    """
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(user_id),   # sub（subject）: トークンの主体（ユーザー ID）
        "exp": expire,          # exp（expiration）: トークンの有効期限
        "type": "access",       # トークンの種類（アクセス or リフレッシュ）
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: int) -> str:
    """リフレッシュトークンを生成する

    アクセストークンより長い有効期限を持つ。
    アクセストークンが期限切れになったとき、
    リフレッシュトークンで新しいアクセストークンを取得する。
    """
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {
        "sub": str(user_id),
        "exp": expire,
        "type": "refresh",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


# --------------------------------------------------
# 5. 依存性注入（Dependency Injection）関数
#
# 【Depends とは？】
# FastAPI の DI（依存性注入）機能。エンドポイント関数の引数に
# Depends(関数) を指定すると、その関数の戻り値が自動で注入される。
# DB セッション管理や認証チェックに使う。
# --------------------------------------------------

def get_db():
    """DB セッションを生成・管理する（yield パターン）

    yield でセッションを返し、リクエスト終了後に finally で閉じる。
    これにより、エンドポイント関数内でセッションを使い終わったあと
    自動的にリソースが解放される。
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """認証済みユーザーを取得する（認証必須エンドポイント用）

    処理の流れ:
    1. Authorization ヘッダーから Bearer トークンを抽出
    2. JWT をデコードしてユーザー ID を取得
    3. DB からユーザーを検索して返す
    """
    token = credentials.credentials
    try:
        # JWT をデコード（署名検証 + 有効期限チェック）
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])

        # トークンの種類を確認（リフレッシュトークンは使えない）
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="無効なトークン種類です")

        user_id = int(payload["sub"])
    except jwt.ExpiredSignatureError:
        # トークンの有効期限切れ
        raise HTTPException(status_code=401, detail="トークンの有効期限が切れています")
    except jwt.InvalidTokenError:
        # トークンが不正（改ざん・形式エラーなど）
        raise HTTPException(status_code=401, detail="無効なトークンです")

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="ユーザーが見つかりません")

    return user


def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(optional_security),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """認証済みユーザーを取得する（任意認証: 未ログインでも OK）

    公開 API で「ログインしていれば追加情報を返す」ようなケースに使う。
    """
    if credentials is None:
        return None
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            return None
        user_id = int(payload["sub"])
        return db.query(User).filter(User.id == user_id).first()
    except (jwt.InvalidTokenError, ValueError):
        return None


# --------------------------------------------------
# FastAPI アプリケーションの作成
# --------------------------------------------------
app = FastAPI(title="JWT認証ブログ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# 6. 認証エンドポイント
#
# 【認証フロー】
# 1. ユーザー登録（POST /api/auth/register）
#    → パスワードをハッシュ化して DB に保存
# 2. ログイン（POST /api/auth/login）
#    → パスワード照合 → アクセス + リフレッシュトークンを返す
# 3. トークンリフレッシュ（POST /api/auth/refresh）
#    → リフレッシュトークンで新しいアクセストークンを取得
# --------------------------------------------------


@app.post("/api/auth/register", response_model=TokenResponse, status_code=201)
def register(body: UserCreate, db: Session = Depends(get_db)):
    """ユーザー登録エンドポイント

    status_code=201: Created（リソースの新規作成成功）
    """
    # ユーザー名・メールの重複チェック
    if db.query(User).filter(User.username == body.username).first():
        raise HTTPException(status_code=400, detail="このユーザー名は既に使用されています")
    if db.query(User).filter(User.email == body.email).first():
        raise HTTPException(status_code=400, detail="このメールアドレスは既に登録されています")

    # ユーザーを作成して DB に保存
    user = User(
        username=body.username,
        email=body.email,
        hashed_password=hash_password(body.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)  # DB が自動生成した id, created_at を取得

    # トークンを生成して返す（登録直後にログイン状態にする）
    return TokenResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
        user=UserResponse.model_validate(user),
    )


@app.post("/api/auth/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    """ログインエンドポイント

    メールアドレスとパスワードで認証し、トークンを返す。
    セキュリティ上、「メールが存在しない」「パスワードが違う」を
    区別せず同じエラーメッセージを返す（情報漏洩防止）。
    """
    user = db.query(User).filter(User.email == body.email).first()

    # ユーザーが存在しない or パスワードが不一致
    if user is None or not verify_password(body.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="メールアドレスまたはパスワードが正しくありません",
        )

    return TokenResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
        user=UserResponse.model_validate(user),
    )


@app.post("/api/auth/refresh", response_model=TokenResponse)
def refresh_token(body: RefreshRequest, db: Session = Depends(get_db)):
    """トークンリフレッシュエンドポイント

    リフレッシュトークンを受け取り、新しいアクセストークンと
    リフレッシュトークンのペアを返す。
    """
    try:
        payload = jwt.decode(body.refresh_token, JWT_SECRET, algorithms=[JWT_ALGORITHM])

        # リフレッシュトークンであることを確認
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="無効なトークン種類です")

        user_id = int(payload["sub"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="リフレッシュトークンの有効期限が切れています")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="無効なリフレッシュトークンです")

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="ユーザーが見つかりません")

    return TokenResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
        user=UserResponse.model_validate(user),
    )


@app.get("/api/users/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """ログイン中のユーザー情報を取得するエンドポイント

    Depends(get_current_user) により、認証済みユーザーが自動で注入される。
    未認証の場合は get_current_user 内で 401 エラーが発生する。
    """
    return UserResponse.model_validate(current_user)


# --------------------------------------------------
# 7. 記事エンドポイント
#
# 【CRUD 操作】
# Create（作成）、Read（読み取り）、Update（更新）、Delete（削除）
# の頭文字を取った、データ操作の基本パターン。
# --------------------------------------------------


@app.get("/api/articles", response_model=list[ArticleResponse])
def get_articles(author_id: Optional[int] = None, db: Session = Depends(get_db)):
    """記事一覧を取得するエンドポイント（公開 API）

    author_id クエリパラメータで特定ユーザーの記事だけに絞り込める。
    例: GET /api/articles?author_id=1
    """
    query = db.query(Article)

    # 著者でフィルタリング（指定された場合のみ）
    if author_id is not None:
        query = query.filter(Article.author_id == author_id)

    # 新しい順にソートして返す
    articles = query.order_by(Article.created_at.desc()).all()
    return [ArticleResponse.model_validate(a) for a in articles]


@app.get("/api/articles/{article_id}", response_model=ArticleResponse)
def get_article(article_id: int, db: Session = Depends(get_db)):
    """記事の詳細を取得するエンドポイント（公開 API）"""
    article = db.query(Article).filter(Article.id == article_id).first()
    if article is None:
        raise HTTPException(status_code=404, detail="記事が見つかりません")

    return ArticleResponse.model_validate(article)


@app.post("/api/articles", response_model=ArticleResponse, status_code=201)
def create_article(
    body: ArticleCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """記事を作成するエンドポイント（認証必須）

    Depends(get_current_user) で認証チェックを行い、
    ログイン中のユーザーを自動で著者として設定する。
    """
    article = Article(
        title=body.title.strip(),
        body=body.body.strip(),
        author_id=current_user.id,
    )
    db.add(article)
    db.commit()
    db.refresh(article)

    return ArticleResponse.model_validate(article)


@app.patch("/api/articles/{article_id}", response_model=ArticleResponse)
def update_article(
    article_id: int,
    body: ArticleUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """記事を更新するエンドポイント（認証 + 著者のみ）

    【認可チェック】
    認証（ログイン済み）に加えて、記事の著者であることを確認する。
    他人の記事は編集できない。
    """
    article = db.query(Article).filter(Article.id == article_id).first()
    if article is None:
        raise HTTPException(status_code=404, detail="記事が見つかりません")

    # 認可チェック: 著者のみ編集可能
    # 403 Forbidden: 認証はされているが、権限がない
    if article.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="この記事を編集する権限がありません")

    # 送信されたフィールドのみ更新する（部分更新）
    if body.title is not None:
        article.title = body.title.strip()
    if body.body is not None:
        article.body = body.body.strip()

    article.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(article)

    return ArticleResponse.model_validate(article)


@app.delete("/api/articles/{article_id}", status_code=204)
def delete_article(
    article_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """記事を削除するエンドポイント（認証 + 著者のみ）

    status_code=204: No Content（削除成功・レスポンスボディなし）
    """
    article = db.query(Article).filter(Article.id == article_id).first()
    if article is None:
        raise HTTPException(status_code=404, detail="記事が見つかりません")

    # 認可チェック: 著者のみ削除可能
    if article.author_id != current_user.id:
        raise HTTPException(status_code=403, detail="この記事を削除する権限がありません")

    db.delete(article)
    db.commit()
    return None


# --------------------------------------------------
# 8. サーバー起動 + シードデータ投入
#
# テーブルの自動作成と、開発用のサンプルデータを投入する。
# --------------------------------------------------

def seed_data():
    """サンプルデータを投入する（DB が空の場合のみ）"""
    db = SessionLocal()
    try:
        # 既にデータがあればスキップ
        if db.query(User).count() > 0:
            return

        # サンプルユーザーを作成（パスワードは全員 "password123"）
        users = [
            User(username="testuser1", email="user1@example.com",
                 hashed_password=hash_password("password123")),
            User(username="testuser2", email="user2@example.com",
                 hashed_password=hash_password("password123")),
            User(username="testuser3", email="user3@example.com",
                 hashed_password=hash_password("password123")),
        ]
        db.add_all(users)
        db.commit()

        # ID を取得するために refresh
        for u in users:
            db.refresh(u)

        # サンプル記事を作成
        articles = [
            Article(
                title="React Hooks 入門ガイド",
                body="React Hooks は関数コンポーネントで状態管理や副作用を扱うための機能です。\n\n"
                     "useState は最も基本的な Hook で、コンポーネントに状態を持たせることができます。\n"
                     "useEffect は副作用（API 呼び出し、DOM 操作など）を扱うための Hook です。\n\n"
                     "これらを組み合わせることで、クラスコンポーネントなしに複雑なロジックを実装できます。",
                author_id=users[0].id,
            ),
            Article(
                title="TypeScript の型システムを理解する",
                body="TypeScript の型システムは JavaScript に静的型付けを追加する強力な機能です。\n\n"
                     "基本型（string, number, boolean）から始まり、\n"
                     "interface や type エイリアスでオブジェクトの形状を定義できます。\n"
                     "ジェネリクスを使えば、再利用可能な型安全なコードが書けます。",
                author_id=users[0].id,
            ),
            Article(
                title="FastAPI で REST API を構築する",
                body="FastAPI は Python の高性能 Web フレームワークです。\n\n"
                     "型ヒントを活用した自動バリデーション、\n"
                     "自動生成される API ドキュメント（Swagger UI）、\n"
                     "非同期処理のサポートが特徴です。\n\n"
                     "Pydantic との統合により、リクエスト/レスポンスの型安全性が保証されます。",
                author_id=users[1].id,
            ),
            Article(
                title="JWT 認証の仕組みと実装",
                body="JWT（JSON Web Token）はステートレスな認証方式です。\n\n"
                     "従来のセッション認証はサーバー側で状態を保持する必要がありましたが、\n"
                     "JWT はトークン自体に認証情報を含むため、サーバーの負荷を軽減できます。\n\n"
                     "トークンは Header.Payload.Signature の3部分で構成され、\n"
                     "秘密鍵による署名で改ざんを検知できます。",
                author_id=users[1].id,
            ),
            Article(
                title="SQLAlchemy ORM の基礎",
                body="SQLAlchemy は Python の代表的な ORM ライブラリです。\n\n"
                     "テーブルを Python のクラスとして定義し、\n"
                     "SQL 文を書かずにデータベース操作が行えます。\n\n"
                     "リレーションシップ（1対多、多対多）の定義や、\n"
                     "クエリビルダーによる柔軟な検索が可能です。",
                author_id=users[2].id,
            ),
            Article(
                title="React Router でルーティングを実装する",
                body="React Router はシングルページアプリケーション（SPA）に\n"
                     "ページ遷移の概念を追加するライブラリです。\n\n"
                     "BrowserRouter でアプリ全体をラップし、\n"
                     "Route コンポーネントで URL とコンポーネントの対応を定義します。\n\n"
                     "useNavigate や useParams などのフックで、\n"
                     "プログラムからの遷移やパラメータの取得が可能です。",
                author_id=users[2].id,
            ),
            Article(
                title="CSS 設計手法 BEM の紹介",
                body="BEM（Block Element Modifier）は CSS のクラス命名規則です。\n\n"
                     "Block: 独立したコンポーネント（.card）\n"
                     "Element: Block の構成要素（.card__title）\n"
                     "Modifier: 状態やバリエーション（.card--featured）\n\n"
                     "BEM を使うことでクラス名の衝突を防ぎ、\n"
                     "コンポーネントの構造が明確になります。",
                author_id=users[0].id,
            ),
        ]
        db.add_all(articles)
        db.commit()
        print("シードデータを投入しました")
    finally:
        db.close()


if __name__ == "__main__":
    import uvicorn

    # テーブルを自動作成する（存在しなければ CREATE TABLE を実行）
    Base.metadata.create_all(bind=engine)

    # サンプルデータを投入する
    seed_data()

    # FastAPI サーバーを起動する
    # port=8000: Vite のプロキシ設定と合わせる
    uvicorn.run(app, host="0.0.0.0", port=8000)
