# ============================================================
# server.py ― FastAPI + SQLAlchemy による REST API サーバー
# 商品管理 API を通して REST API の設計パターンを学ぶ
#
# 【このファイルで学べること】
# 1. SQLAlchemy ORM でのデータベース操作（モデル定義、CRUD）
# 2. ページネーション（offset/limit パターン）
# 3. 動的フィルタリング（クエリパラメータからの条件構築）
# 4. 動的ソート（カラム名バリデーション + asc/desc）
# 5. バックグラウンドタスク（CSV 一括インポート）
# 6. 依存性注入（Depends パターン）
# 7. カスタム例外ハンドラー
# 8. 起動時のシードデータ投入
# ============================================================

# --------------------------------------------------
# モジュールのインポート
# --------------------------------------------------
from fastapi import FastAPI, HTTPException, Depends, Query, BackgroundTasks, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone
import uuid
import csv
import io

# 【SQLAlchemy とは？】
# Python の代表的な ORM（Object-Relational Mapping）ライブラリ。
# SQL を直接書かずに Python オブジェクトでデータベースを操作できる。
# TypeScript の Prisma や TypeORM に相当する。
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, func
from sqlalchemy.orm import sessionmaker, declarative_base, Session, relationship

# --------------------------------------------------
# データベース接続設定
#
# 【SQLite とは？】
# ファイルベースの軽量 RDBMS。サーバー不要で .db ファイルに保存される。
# 開発や学習に最適。本番では PostgreSQL や MySQL を使うことが多い。
# --------------------------------------------------

# Engine: データベースへの接続を管理するオブジェクト
# "sqlite:///products.db" → 同じディレクトリに products.db を作成
# connect_args: SQLite 固有の設定（マルチスレッド対応）
engine = create_engine(
    "sqlite:///products.db",
    connect_args={"check_same_thread": False},
)

# 【Session とは？】
# データベースとの「会話」を管理する単位。
# 変更をまとめて commit したり、エラー時に rollback したりする。
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base: 全てのモデルクラスの親クラス（宣言的マッピング）
Base = declarative_base()


# --------------------------------------------------
# データベースモデル定義
#
# 【ORM モデルとは？】
# データベースのテーブルを Python クラスとして表現する。
# TypeScript の Prisma スキーマに相当する。
# --------------------------------------------------

class CategoryModel(Base):
    """カテゴリテーブル"""
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    # relationship: 1対多の関連を定義する
    # back_populates: 逆参照の属性名を指定する
    products = relationship("ProductModel", back_populates="category")


class ProductModel(Base):
    """商品テーブル"""
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, default="")
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0)

    # ForeignKey: 外部キー制約。categories テーブルの id を参照する
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))

    # relationship: カテゴリオブジェクトへの参照を取得できる
    category = relationship("CategoryModel", back_populates="products")


# テーブルを作成する（存在しない場合のみ）
Base.metadata.create_all(bind=engine)


# --------------------------------------------------
# Pydantic スキーマ（リクエスト/レスポンスの型定義）
#
# ORM モデルとは別に、API の入出力の型を定義する。
# これにより入力バリデーションと出力の整形を分離できる。
# --------------------------------------------------

class CategorySchema(BaseModel):
    """カテゴリの出力スキーマ"""
    id: int
    name: str

    model_config = {"from_attributes": True}


class ProductSchema(BaseModel):
    """商品の出力スキーマ"""
    id: int
    name: str
    description: str
    price: float
    stock: int
    category_id: int
    category_name: str = ""
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ProductCreateSchema(BaseModel):
    """商品作成の入力スキーマ"""
    name: str = Field(min_length=1, max_length=200)
    description: str = ""
    price: float = Field(gt=0)
    stock: int = Field(ge=0, default=0)
    category_id: int


class ProductUpdateSchema(BaseModel):
    """商品更新の入力スキーマ（全フィールド Optional = PATCH 用）"""
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)
    category_id: Optional[int] = None


class PaginatedResponse(BaseModel):
    """ページネーション付きレスポンス

    【ページネーションとは？】
    大量のデータを一度に返さず、ページ単位に分割して返すパターン。
    data: 現在のページのデータ配列
    total: 全件数
    page: 現在のページ番号
    limit: 1ページあたりの件数
    totalPages: 総ページ数
    """
    data: list[dict]
    total: int
    page: int
    limit: int
    totalPages: int


class JobStatus(BaseModel):
    """バックグラウンドジョブのステータス"""
    job_id: str
    status: str  # "pending" | "processing" | "completed" | "failed"
    message: str
    processed: int = 0
    total: int = 0


# --------------------------------------------------
# カスタム例外クラス
#
# 【カスタム例外とは？】
# 標準の Exception を継承して独自のエラー型を定義する。
# FastAPI の exception_handler と組み合わせて、
# エラーの種類に応じた HTTP レスポンスを自動生成する。
# --------------------------------------------------

class ProductNotFoundError(Exception):
    """商品が見つからない場合の例外"""
    def __init__(self, product_id: int):
        self.product_id = product_id
        self.message = f"商品 ID {product_id} が見つかりません"


class CategoryNotFoundError(Exception):
    """カテゴリが見つからない場合の例外"""
    def __init__(self, category_id: int):
        self.category_id = category_id
        self.message = f"カテゴリ ID {category_id} が見つかりません"


# --------------------------------------------------
# FastAPI アプリケーション作成
# --------------------------------------------------
app = FastAPI(title="商品管理 API - REST API Design Patterns")

# CORS 設定（開発用に全オリジン許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# カスタム例外ハンドラー
#
# @app.exception_handler で例外クラスと HTTP レスポンスを紐づける。
# 特定の例外が raise されると、自動でこのハンドラーが呼ばれる。
# --------------------------------------------------

from fastapi.responses import JSONResponse
from fastapi import Request

@app.exception_handler(ProductNotFoundError)
async def product_not_found_handler(_request: Request, exc: ProductNotFoundError):
    """ProductNotFoundError → 404 レスポンスに変換"""
    return JSONResponse(status_code=404, content={"detail": exc.message})


@app.exception_handler(CategoryNotFoundError)
async def category_not_found_handler(_request: Request, exc: CategoryNotFoundError):
    """CategoryNotFoundError → 404 レスポンスに変換"""
    return JSONResponse(status_code=404, content={"detail": exc.message})


# --------------------------------------------------
# 依存性注入（Dependency Injection）
#
# 【Depends パターンとは？】
# FastAPI の DI 機構。エンドポイント関数の引数に
# Depends(関数) を指定すると、その関数の戻り値が自動で注入される。
# DB セッションの管理に使うのが典型的なパターン。
# --------------------------------------------------

def get_db():
    """データベースセッションを生成するジェネレータ

    yield で一時停止し、エンドポイント処理完了後に finally で閉じる。
    これにより、セッションの開閉が自動化される。
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --------------------------------------------------
# バックグラウンドジョブのステータス管理（インメモリ）
# 本番環境では Redis や Celery を使う
# --------------------------------------------------
job_store: dict[str, JobStatus] = {}


# --------------------------------------------------
# ヘルパー関数
# --------------------------------------------------

def product_to_dict(product: ProductModel) -> dict:
    """ORM モデルを辞書に変換する（カテゴリ名を含める）"""
    return {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "stock": product.stock,
        "category_id": product.category_id,
        "category_name": product.category.name if product.category else "",
        "created_at": product.created_at.isoformat() if product.created_at else "",
        "updated_at": product.updated_at.isoformat() if product.updated_at else "",
    }


# --------------------------------------------------
# API エンドポイント: カテゴリ
# --------------------------------------------------

@app.get("/api/categories")
def get_categories(db: Session = Depends(get_db)):
    """全カテゴリを取得する"""
    categories = db.query(CategoryModel).all()
    return [{"id": c.id, "name": c.name} for c in categories]


# --------------------------------------------------
# API エンドポイント: 商品一覧（ページネーション + フィルタ + ソート）
#
# 【クエリパラメータとは？】
# URL の ? 以降に付与するパラメータ。
# 例: /api/products?page=1&limit=10&search=コーヒー
# FastAPI では関数の引数として宣言するだけで自動的にパースされる。
# --------------------------------------------------

@app.get("/api/products")
def get_products(
    # Query: クエリパラメータにバリデーションを付与する
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    sort: str = Query("created_at"),
    order: str = Query("desc"),
    db: Session = Depends(get_db),
):
    """商品一覧を取得する（ページネーション + フィルタリング + ソート）

    【動的クエリ構築パターン】
    ベースクエリに条件を順次追加していく。
    条件が指定されていない場合はスキップする。
    """
    # ベースクエリを構築する
    query = db.query(ProductModel).join(CategoryModel)

    # --- フィルタリング ---
    # 検索キーワード: 商品名と説明文を部分一致で検索
    if search:
        query = query.filter(
            (ProductModel.name.ilike(f"%{search}%")) |
            (ProductModel.description.ilike(f"%{search}%"))
        )

    # カテゴリフィルタ: カテゴリ名で絞り込む
    if category:
        query = query.filter(CategoryModel.name == category)

    # 価格範囲フィルタ
    if min_price is not None:
        query = query.filter(ProductModel.price >= min_price)
    if max_price is not None:
        query = query.filter(ProductModel.price <= max_price)

    # --- ソート ---
    # 【カラム名バリデーション】
    # ユーザー入力をそのまま SQL に使うのは危険（SQL インジェクション）。
    # 許可リストで検証し、安全なカラムのみ受け付ける。
    allowed_sort = {"name", "price", "created_at", "stock"}
    if sort not in allowed_sort:
        sort = "created_at"

    # getattr で動的にカラムオブジェクトを取得する
    sort_column = getattr(ProductModel, sort)
    if order == "asc":
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())

    # --- ページネーション ---
    # total: フィルタ後の全件数（count クエリ）
    total = query.count()

    # offset: スキップする件数 = (ページ番号 - 1) * 1ページの件数
    offset = (page - 1) * limit
    products = query.offset(offset).limit(limit).all()

    # totalPages: 総ページ数（切り上げ計算）
    total_pages = (total + limit - 1) // limit

    return PaginatedResponse(
        data=[product_to_dict(p) for p in products],
        total=total,
        page=page,
        limit=limit,
        totalPages=total_pages,
    )


# --------------------------------------------------
# API エンドポイント: 商品詳細
# --------------------------------------------------

@app.get("/api/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    """商品を1件取得する"""
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise ProductNotFoundError(product_id)
    return product_to_dict(product)


# --------------------------------------------------
# API エンドポイント: 商品作成
# --------------------------------------------------

@app.post("/api/products", status_code=201)
def create_product(body: ProductCreateSchema, db: Session = Depends(get_db)):
    """新しい商品を作成する"""
    # カテゴリの存在チェック
    cat = db.query(CategoryModel).filter(CategoryModel.id == body.category_id).first()
    if not cat:
        raise CategoryNotFoundError(body.category_id)

    product = ProductModel(
        name=body.name.strip(),
        description=body.description,
        price=body.price,
        stock=body.stock,
        category_id=body.category_id,
    )
    db.add(product)
    db.commit()
    # refresh: commit 後に DB が生成した値（id, created_at 等）を取得する
    db.refresh(product)
    return product_to_dict(product)


# --------------------------------------------------
# API エンドポイント: 商品更新（PATCH = 部分更新）
# --------------------------------------------------

@app.patch("/api/products/{product_id}")
def update_product(product_id: int, body: ProductUpdateSchema, db: Session = Depends(get_db)):
    """商品を部分更新する

    【PATCH vs PUT】
    PATCH: 変更したいフィールドのみ送信する（部分更新）
    PUT: 全フィールドを送信する（全体置換）
    REST API では PATCH が実用的でよく使われる。
    """
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise ProductNotFoundError(product_id)

    # model_dump(exclude_unset=True): 明示的に設定されたフィールドのみ取得
    # None でないフィールドだけを更新する
    update_data = body.model_dump(exclude_unset=True)

    # カテゴリ変更がある場合は存在チェック
    if "category_id" in update_data:
        cat = db.query(CategoryModel).filter(CategoryModel.id == update_data["category_id"]).first()
        if not cat:
            raise CategoryNotFoundError(update_data["category_id"])

    # setattr で動的にモデルの属性を更新する
    for key, value in update_data.items():
        setattr(product, key, value)

    product.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(product)
    return product_to_dict(product)


# --------------------------------------------------
# API エンドポイント: 商品削除
# --------------------------------------------------

@app.delete("/api/products/{product_id}", status_code=204)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """商品を削除する"""
    product = db.query(ProductModel).filter(ProductModel.id == product_id).first()
    if not product:
        raise ProductNotFoundError(product_id)

    db.delete(product)
    db.commit()
    return None


# --------------------------------------------------
# バックグラウンドタスク: CSV 一括インポート
#
# 【BackgroundTasks とは？】
# FastAPI が提供するバックグラウンド処理の仕組み。
# レスポンスを先に返してから、裏側で重い処理を実行する。
# Celery のような外部キューなしで非同期処理ができる。
# --------------------------------------------------

def process_csv_import(job_id: str, content: str):
    """CSV ファイルを処理してデータベースに商品を登録する"""
    db = SessionLocal()
    try:
        reader = csv.DictReader(io.StringIO(content))
        rows = list(reader)
        job_store[job_id].total = len(rows)
        job_store[job_id].status = "processing"

        for i, row in enumerate(rows):
            # カテゴリを取得または作成する
            cat = db.query(CategoryModel).filter(CategoryModel.name == row.get("category", "未分類")).first()
            if not cat:
                cat = CategoryModel(name=row.get("category", "未分類"))
                db.add(cat)
                db.commit()
                db.refresh(cat)

            # 商品を作成する
            product = ProductModel(
                name=row.get("name", ""),
                description=row.get("description", ""),
                price=float(row.get("price", 0)),
                stock=int(row.get("stock", 0)),
                category_id=cat.id,
            )
            db.add(product)
            db.commit()

            # 進捗を更新する
            job_store[job_id].processed = i + 1

        job_store[job_id].status = "completed"
        job_store[job_id].message = f"{len(rows)} 件の商品をインポートしました"

    except Exception as e:
        job_store[job_id].status = "failed"
        job_store[job_id].message = f"インポートに失敗しました: {str(e)}"
    finally:
        db.close()


@app.post("/api/products/import", status_code=202)
async def import_products(file: UploadFile, background_tasks: BackgroundTasks):
    """CSV ファイルから商品を一括インポートする

    status_code=202: Accepted（受け付けたが処理はまだ完了していない）
    クライアントは job_id を使って進捗を問い合わせる。
    """
    # ジョブ ID を生成する（UUID: 一意な識別子）
    job_id = str(uuid.uuid4())

    # ジョブステータスを初期化する
    job_store[job_id] = JobStatus(
        job_id=job_id,
        status="pending",
        message="インポートを開始します",
    )

    # ファイル内容を読み込む
    content = (await file.read()).decode("utf-8")

    # バックグラウンドタスクに登録する
    # add_task: レスポンス送信後に実行される関数を登録する
    background_tasks.add_task(process_csv_import, job_id, content)

    return {"job_id": job_id, "message": "インポートジョブを受け付けました"}


@app.get("/api/jobs/{job_id}")
def get_job_status(job_id: str):
    """ジョブの進捗状況を取得する"""
    job = job_store.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="ジョブが見つかりません")
    return job


# --------------------------------------------------
# 起動時イベント: シードデータの投入
#
# 【lifespan とは？】
# FastAPI のライフサイクルイベント。
# アプリ起動時に初期データを投入するために使う。
# --------------------------------------------------

@app.on_event("startup")
def seed_database():
    """初回起動時にサンプルデータを投入する"""
    db = SessionLocal()
    try:
        # 既にデータがあればスキップする
        if db.query(CategoryModel).count() > 0:
            return

        # カテゴリを作成する
        categories_data = ["電子機器", "食品・飲料", "書籍", "衣類", "家具", "スポーツ"]
        categories: dict[str, CategoryModel] = {}
        for name in categories_data:
            cat = CategoryModel(name=name)
            db.add(cat)
            db.commit()
            db.refresh(cat)
            categories[name] = cat

        # 商品データ（50件以上）
        products_data = [
            # 電子機器 (10)
            ("ワイヤレスイヤホン Pro", "高音質ノイズキャンセリング対応", 15800, 45, "電子機器"),
            ("USB-C ハブ 7in1", "HDMI/USB3.0/SD カード対応", 4980, 120, "電子機器"),
            ("メカニカルキーボード", "Cherry MX 赤軸搭載、RGB バックライト", 12800, 30, "電子機器"),
            ("ポータブル SSD 1TB", "USB 3.2 Gen2 対応、最大読込 1050MB/s", 11800, 55, "電子機器"),
            ("ウェブカメラ 4K", "オートフォーカス、マイク内蔵", 8900, 40, "電子機器"),
            ("ワイヤレスマウス", "静音クリック、Bluetooth 5.0", 3480, 200, "電子機器"),
            ("モバイルバッテリー 20000mAh", "PD 対応、急速充電", 4580, 80, "電子機器"),
            ("スマートウォッチ", "心拍数・血中酸素・睡眠計測", 24800, 25, "電子機器"),
            ("Bluetooth スピーカー", "IPX7 防水、360度サウンド", 6980, 60, "電子機器"),
            ("USB マイク コンデンサー", "配信・録音向け、ポップガード付き", 7800, 35, "電子機器"),
            # 食品・飲料 (10)
            ("スペシャルティコーヒー豆 200g", "エチオピア イルガチェフ G1", 1980, 150, "食品・飲料"),
            ("有機抹茶パウダー 100g", "京都宇治産、石臼挽き", 2480, 80, "食品・飲料"),
            ("マヌカハニー UMF10+", "ニュージーランド産、500g", 4980, 40, "食品・飲料"),
            ("プロテインバー 12本セット", "高タンパク低糖質、チョコ味", 3280, 200, "食品・飲料"),
            ("オーガニック ルイボスティー 40包", "ノンカフェイン、南アフリカ産", 1280, 300, "食品・飲料"),
            ("ドライフルーツ ミックス 500g", "マンゴー・パイン・クランベリー", 1580, 120, "食品・飲料"),
            ("国産はちみつ 300g", "非加熱・天然100%、百花蜜", 2280, 60, "食品・飲料"),
            ("グラノーラ 400g", "ナッツ＆フルーツ、食物繊維豊富", 980, 180, "食品・飲料"),
            ("炭酸水 500ml x 24本", "天然水使用、強炭酸", 2180, 500, "食品・飲料"),
            ("エナジーバー 6本セット", "オーツ麦ベース、自然素材", 1480, 250, "食品・飲料"),
            # 書籍 (10)
            ("リーダブルコード", "より良いコードを書くためのシンプルで実践的なテクニック", 2640, 100, "書籍"),
            ("Clean Architecture", "ソフトウェア構造と設計の原則", 3520, 70, "書籍"),
            ("プログラミング TypeScript", "型安全なJavaScript開発入門", 3740, 50, "書籍"),
            ("React ハンズオンラーニング 第2版", "Webアプリケーション開発のベストプラクティス", 3520, 45, "書籍"),
            ("SQL アンチパターン", "よくある間違いから学ぶDB設計", 3080, 60, "書籍"),
            ("Web API の設計", "RESTful API の設計原則とベストプラクティス", 3960, 40, "書籍"),
            ("Docker 実践ガイド", "コンテナ技術の基礎から運用まで", 3300, 55, "書籍"),
            ("データ指向アプリケーションデザイン", "信頼性・拡張性・保守性の高い分散システム", 4620, 30, "書籍"),
            ("入門 監視", "モダンなモニタリングのためのデザインパターン", 3080, 65, "書籍"),
            ("マイクロサービスアーキテクチャ", "分散システムの設計と実装", 3960, 35, "書籍"),
            # 衣類 (8)
            ("オーガニックコットン Tシャツ", "無地、厚手 7.0oz", 3980, 150, "衣類"),
            ("デニムパンツ スリムフィット", "ストレッチ素材、日本製", 8900, 60, "衣類"),
            ("メリノウール カーディガン", "チクチクしない、洗濯機OK", 7800, 40, "衣類"),
            ("撥水マウンテンパーカー", "3レイヤー、止水ジップ", 14800, 35, "衣類"),
            ("リネンシャツ", "フレンチリネン100%、ゆったりシルエット", 6480, 70, "衣類"),
            ("ランニングソックス 3足セット", "吸湿速乾、アーチサポート", 1980, 200, "衣類"),
            ("ダウンベスト", "撥水加工、パッカブル仕様", 9800, 45, "衣類"),
            ("スウェットパンツ", "裏起毛、テーパードシルエット", 4980, 90, "衣類"),
            # 家具 (7)
            ("デスクライト LED", "調光調色、USB ポート付き", 5980, 80, "家具"),
            ("オフィスチェア メッシュ", "ヘッドレスト付き、ロッキング機能", 24800, 20, "家具"),
            ("スタンディングデスク 電動式", "高さメモリ機能、天板 120cm", 39800, 15, "家具"),
            ("本棚 3段", "天然木、幅60cm、組立簡単", 8900, 40, "家具"),
            ("モニターアーム シングル", "ガスシリンダー式、VESA対応", 4980, 100, "家具"),
            ("ケーブルトレー", "デスク下取付、配線整理", 2480, 150, "家具"),
            ("デスクマット 大判", "PU レザー、防水・防汚", 2980, 120, "家具"),
            # スポーツ (7)
            ("ヨガマット 6mm", "TPE素材、両面滑り止め", 3480, 100, "スポーツ"),
            ("ダンベル 可変式 24kg", "ダイヤル調整、15段階", 19800, 30, "スポーツ"),
            ("トレーニングバンド 5本セット", "強度別カラー、収納袋付き", 2480, 200, "スポーツ"),
            ("フォームローラー", "筋膜リリース、EVA素材", 2980, 80, "スポーツ"),
            ("プロテインシェイカー 600ml", "BPA フリー、目盛付き", 1280, 300, "スポーツ"),
            ("スポーツタオル 速乾", "マイクロファイバー、携帯ケース付き", 1580, 250, "スポーツ"),
            ("ジャンプロープ", "ベアリング式、長さ調整可能", 1980, 150, "スポーツ"),
        ]

        for name, desc, price, stock, cat_name in products_data:
            product = ProductModel(
                name=name,
                description=desc,
                price=price,
                stock=stock,
                category_id=categories[cat_name].id,
            )
            db.add(product)

        db.commit()
        print(f"シードデータを投入しました: {len(products_data)} 商品")

    finally:
        db.close()


# --------------------------------------------------
# サーバー起動設定
# --------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
