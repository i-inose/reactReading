// ============================================================
// employees.ts ― モック社員データ（60名）
//
// 【このファイルで学べること】
// 1. 型安全なモックデータの定義
// 2. as const を使わず、型注釈で型安全性を確保する方法
// ============================================================

import type { Employee } from "../types";

// --------------------------------------------------
// 60名の社員データ
//
// 5部署（engineering, sales, marketing, hr, finance）に
// 各12名ずつ配置。日本語の氏名とリアルなデータ。
// --------------------------------------------------
export const employees: Employee[] = [
  // ===== エンジニアリング部 (engineering) =====
  { id: 1, name: "田中 太郎", department: "engineering", position: "シニアエンジニア", email: "tanaka.taro@example.com", hireDate: "2018-04-01", salary: 8500000 },
  { id: 2, name: "佐藤 花子", department: "engineering", position: "テックリード", email: "sato.hanako@example.com", hireDate: "2016-04-01", salary: 9800000 },
  { id: 3, name: "鈴木 一郎", department: "engineering", position: "ジュニアエンジニア", email: "suzuki.ichiro@example.com", hireDate: "2023-04-01", salary: 4500000 },
  { id: 4, name: "高橋 美咲", department: "engineering", position: "フロントエンドエンジニア", email: "takahashi.misaki@example.com", hireDate: "2020-10-01", salary: 6800000 },
  { id: 5, name: "伊藤 健太", department: "engineering", position: "バックエンドエンジニア", email: "ito.kenta@example.com", hireDate: "2019-04-01", salary: 7200000 },
  { id: 6, name: "渡辺 さくら", department: "engineering", position: "DevOps エンジニア", email: "watanabe.sakura@example.com", hireDate: "2021-07-01", salary: 7500000 },
  { id: 7, name: "山本 大輔", department: "engineering", position: "エンジニアリングマネージャー", email: "yamamoto.daisuke@example.com", hireDate: "2015-04-01", salary: 11000000 },
  { id: 8, name: "中村 愛", department: "engineering", position: "QA エンジニア", email: "nakamura.ai@example.com", hireDate: "2022-01-01", salary: 5500000 },
  { id: 9, name: "小林 翔太", department: "engineering", position: "インフラエンジニア", email: "kobayashi.shota@example.com", hireDate: "2017-10-01", salary: 8000000 },
  { id: 10, name: "加藤 真由美", department: "engineering", position: "データエンジニア", email: "kato.mayumi@example.com", hireDate: "2020-04-01", salary: 7000000 },
  { id: 11, name: "吉田 隆", department: "engineering", position: "セキュリティエンジニア", email: "yoshida.takashi@example.com", hireDate: "2019-07-01", salary: 8200000 },
  { id: 12, name: "山田 恵子", department: "engineering", position: "モバイルエンジニア", email: "yamada.keiko@example.com", hireDate: "2021-04-01", salary: 6500000 },

  // ===== 営業部 (sales) =====
  { id: 13, name: "松本 拓也", department: "sales", position: "営業部長", email: "matsumoto.takuya@example.com", hireDate: "2014-04-01", salary: 10500000 },
  { id: 14, name: "井上 美香", department: "sales", position: "シニア営業", email: "inoue.mika@example.com", hireDate: "2017-04-01", salary: 7800000 },
  { id: 15, name: "木村 雄太", department: "sales", position: "営業担当", email: "kimura.yuta@example.com", hireDate: "2021-04-01", salary: 5200000 },
  { id: 16, name: "林 千尋", department: "sales", position: "アカウントマネージャー", email: "hayashi.chihiro@example.com", hireDate: "2018-10-01", salary: 7200000 },
  { id: 17, name: "斎藤 勇気", department: "sales", position: "営業担当", email: "saito.yuki@example.com", hireDate: "2022-04-01", salary: 4800000 },
  { id: 18, name: "清水 奈々", department: "sales", position: "インサイドセールス", email: "shimizu.nana@example.com", hireDate: "2020-07-01", salary: 5500000 },
  { id: 19, name: "森 大地", department: "sales", position: "フィールドセールス", email: "mori.daichi@example.com", hireDate: "2019-04-01", salary: 6500000 },
  { id: 20, name: "池田 裕子", department: "sales", position: "カスタマーサクセス", email: "ikeda.yuko@example.com", hireDate: "2020-01-01", salary: 6000000 },
  { id: 21, name: "橋本 翼", department: "sales", position: "営業企画", email: "hashimoto.tsubasa@example.com", hireDate: "2016-10-01", salary: 7500000 },
  { id: 22, name: "阿部 麻衣", department: "sales", position: "セールスエンジニア", email: "abe.mai@example.com", hireDate: "2021-10-01", salary: 6800000 },
  { id: 23, name: "石川 健一", department: "sales", position: "パートナーセールス", email: "ishikawa.kenichi@example.com", hireDate: "2018-04-01", salary: 7000000 },
  { id: 24, name: "前田 ゆかり", department: "sales", position: "営業アシスタント", email: "maeda.yukari@example.com", hireDate: "2023-04-01", salary: 4200000 },

  // ===== マーケティング部 (marketing) =====
  { id: 25, name: "藤田 智也", department: "marketing", position: "マーケティング部長", email: "fujita.tomoya@example.com", hireDate: "2015-04-01", salary: 10000000 },
  { id: 26, name: "岡田 彩花", department: "marketing", position: "コンテンツマーケター", email: "okada.ayaka@example.com", hireDate: "2020-04-01", salary: 5800000 },
  { id: 27, name: "後藤 大樹", department: "marketing", position: "デジタルマーケター", email: "goto.daiki@example.com", hireDate: "2019-07-01", salary: 6500000 },
  { id: 28, name: "長谷川 美月", department: "marketing", position: "ブランドマネージャー", email: "hasegawa.mizuki@example.com", hireDate: "2017-04-01", salary: 8000000 },
  { id: 29, name: "村上 陸", department: "marketing", position: "SNS マーケター", email: "murakami.riku@example.com", hireDate: "2022-04-01", salary: 4800000 },
  { id: 30, name: "近藤 結衣", department: "marketing", position: "PR 担当", email: "kondo.yui@example.com", hireDate: "2021-01-01", salary: 5500000 },
  { id: 31, name: "坂本 龍之介", department: "marketing", position: "SEO スペシャリスト", email: "sakamoto.ryunosuke@example.com", hireDate: "2020-10-01", salary: 6200000 },
  { id: 32, name: "遠藤 真理", department: "marketing", position: "イベントプランナー", email: "endo.mari@example.com", hireDate: "2018-04-01", salary: 5800000 },
  { id: 33, name: "青木 悠人", department: "marketing", position: "広告運用担当", email: "aoki.yuto@example.com", hireDate: "2021-07-01", salary: 5200000 },
  { id: 34, name: "藤井 陽菜", department: "marketing", position: "マーケティングアナリスト", email: "fujii.hina@example.com", hireDate: "2019-04-01", salary: 6800000 },
  { id: 35, name: "西村 蓮", department: "marketing", position: "グロースハッカー", email: "nishimura.ren@example.com", hireDate: "2022-10-01", salary: 5500000 },
  { id: 36, name: "福田 さやか", department: "marketing", position: "CRM 担当", email: "fukuda.sayaka@example.com", hireDate: "2020-07-01", salary: 5600000 },

  // ===== 人事部 (hr) =====
  { id: 37, name: "太田 誠", department: "hr", position: "人事部長", email: "ota.makoto@example.com", hireDate: "2013-04-01", salary: 10200000 },
  { id: 38, name: "三浦 優花", department: "hr", position: "採用マネージャー", email: "miura.yuka@example.com", hireDate: "2017-04-01", salary: 7500000 },
  { id: 39, name: "藤原 大和", department: "hr", position: "労務担当", email: "fujiwara.yamato@example.com", hireDate: "2019-04-01", salary: 5800000 },
  { id: 40, name: "岡本 理恵", department: "hr", position: "研修担当", email: "okamoto.rie@example.com", hireDate: "2020-10-01", salary: 5500000 },
  { id: 41, name: "松田 航", department: "hr", position: "人事企画", email: "matsuda.wataru@example.com", hireDate: "2018-04-01", salary: 6800000 },
  { id: 42, name: "中島 由美", department: "hr", position: "採用担当", email: "nakajima.yumi@example.com", hireDate: "2021-04-01", salary: 5000000 },
  { id: 43, name: "小川 竜也", department: "hr", position: "組織開発", email: "ogawa.tatsuya@example.com", hireDate: "2016-07-01", salary: 7800000 },
  { id: 44, name: "竹内 彩乃", department: "hr", position: "福利厚生担当", email: "takeuchi.ayano@example.com", hireDate: "2022-04-01", salary: 4800000 },
  { id: 45, name: "金子 浩二", department: "hr", position: "人事システム管理", email: "kaneko.koji@example.com", hireDate: "2019-10-01", salary: 6200000 },
  { id: 46, name: "和田 桃子", department: "hr", position: "ダイバーシティ推進", email: "wada.momoko@example.com", hireDate: "2020-04-01", salary: 6000000 },
  { id: 47, name: "石井 拓海", department: "hr", position: "給与計算担当", email: "ishii.takumi@example.com", hireDate: "2021-07-01", salary: 5200000 },
  { id: 48, name: "上田 春香", department: "hr", position: "社内コミュニケーション", email: "ueda.haruka@example.com", hireDate: "2023-04-01", salary: 4500000 },

  // ===== 経理部 (finance) =====
  { id: 49, name: "原田 正義", department: "finance", position: "経理部長", email: "harada.masayoshi@example.com", hireDate: "2012-04-01", salary: 10800000 },
  { id: 50, name: "酒井 麗奈", department: "finance", position: "経理マネージャー", email: "sakai.reina@example.com", hireDate: "2016-04-01", salary: 8500000 },
  { id: 51, name: "関口 亮太", department: "finance", position: "財務アナリスト", email: "sekiguchi.ryota@example.com", hireDate: "2019-04-01", salary: 6800000 },
  { id: 52, name: "野口 志穂", department: "finance", position: "経理担当", email: "noguchi.shiho@example.com", hireDate: "2021-04-01", salary: 5200000 },
  { id: 53, name: "田村 康平", department: "finance", position: "管理会計", email: "tamura.kohei@example.com", hireDate: "2018-04-01", salary: 7200000 },
  { id: 54, name: "中野 美波", department: "finance", position: "税務担当", email: "nakano.minami@example.com", hireDate: "2020-04-01", salary: 6000000 },
  { id: 55, name: "杉山 大介", department: "finance", position: "内部監査", email: "sugiyama.daisuke@example.com", hireDate: "2017-07-01", salary: 7800000 },
  { id: 56, name: "新井 沙織", department: "finance", position: "予算管理", email: "arai.saori@example.com", hireDate: "2019-10-01", salary: 6500000 },
  { id: 57, name: "大西 翔", department: "finance", position: "決算担当", email: "onishi.sho@example.com", hireDate: "2022-04-01", salary: 5000000 },
  { id: 58, name: "堀 真紀", department: "finance", position: "資金管理", email: "hori.maki@example.com", hireDate: "2020-07-01", salary: 6200000 },
  { id: 59, name: "菊地 雅人", department: "finance", position: "経営企画", email: "kikuchi.masato@example.com", hireDate: "2015-04-01", salary: 9000000 },
  { id: 60, name: "平野 あかり", department: "finance", position: "IR 担当", email: "hirano.akari@example.com", hireDate: "2021-10-01", salary: 5800000 },
];
