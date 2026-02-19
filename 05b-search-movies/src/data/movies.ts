// ============================================================
// movies.ts ― 100件のモックデータ
//
// 【このファイルで学べること】
// - as const を使わずに型安全なデータ配列を定義する方法
// - picsum.photos を使ったプレースホルダー画像
// ============================================================

import type { Movie } from "../types";

export const movies: Movie[] = [
  // ── アクション（15本）──
  { id: 1, title: "東京バトルライン", director: "三池崇史", year: 2023, genre: "アクション", rating: 4.2, duration: 128, description: "東京を舞台にした壮大なアクション超大作。元特殊部隊員が巨大犯罪組織に立ち向かう。", posterUrl: "https://picsum.photos/seed/movie1/300/450" },
  { id: 2, title: "ラストサムライ・リターンズ", director: "黒沢明彦", year: 2022, genre: "アクション", rating: 3.8, duration: 142, description: "時代劇とモダンアクションの融合。現代に蘇った侍の戦いを描く。", posterUrl: "https://picsum.photos/seed/movie2/300/450" },
  { id: 3, title: "Speed Horizon", director: "James Cameron", year: 2024, genre: "アクション", rating: 4.5, duration: 135, description: "An adrenaline-fueled race across continents with cutting-edge visual effects.", posterUrl: "https://picsum.photos/seed/movie3/300/450" },
  { id: 4, title: "鉄拳レジェンド", director: "園子温", year: 2021, genre: "アクション", rating: 3.5, duration: 118, description: "地下格闘技の世界を描くバイオレンスアクション。", posterUrl: "https://picsum.photos/seed/movie4/300/450" },
  { id: 5, title: "The Dark Protocol", director: "Christopher Nolan", year: 2023, genre: "アクション", rating: 4.7, duration: 152, description: "A spy thriller with mind-bending plot twists and explosive action sequences.", posterUrl: "https://picsum.photos/seed/movie5/300/450" },
  { id: 6, title: "烈火の追跡者", director: "北野武", year: 2020, genre: "アクション", rating: 4.0, duration: 110, description: "元刑事が復讐のために闇社会に潜入する。", posterUrl: "https://picsum.photos/seed/movie6/300/450" },
  { id: 7, title: "Crimson Tide Rising", director: "Michael Bay", year: 2024, genre: "アクション", rating: 3.2, duration: 140, description: "Submarines, explosions, and a race against time to prevent nuclear war.", posterUrl: "https://picsum.photos/seed/movie7/300/450" },
  { id: 8, title: "影武者 ZERO", director: "押井守", year: 2022, genre: "アクション", rating: 4.3, duration: 125, description: "近未来の日本を舞台にしたサイバーパンクアクション。", posterUrl: "https://picsum.photos/seed/movie8/300/450" },
  { id: 9, title: "Storm Breaker", director: "Guy Ritchie", year: 2023, genre: "アクション", rating: 3.9, duration: 115, description: "British special forces on an impossible rescue mission in hostile territory.", posterUrl: "https://picsum.photos/seed/movie9/300/450" },
  { id: 10, title: "龍の咆哮", director: "ジョン・ウー", year: 2021, genre: "アクション", rating: 4.1, duration: 132, description: "香港ノワール風の銃撃アクション。二丁拳銃のガンファイトが炸裂。", posterUrl: "https://picsum.photos/seed/movie10/300/450" },
  { id: 11, title: "Velocity", director: "Chad Stahelski", year: 2024, genre: "アクション", rating: 4.4, duration: 120, description: "High-octane martial arts combined with car chases through neon-lit cities.", posterUrl: "https://picsum.photos/seed/movie11/300/450" },
  { id: 12, title: "鬼神の剣", director: "坂本浩一", year: 2020, genre: "アクション", rating: 3.6, duration: 105, description: "戦国時代を舞台にした剣戟アクション。一人の浪人の壮絶な戦い。", posterUrl: "https://picsum.photos/seed/movie12/300/450" },
  { id: 13, title: "Neon Assault", director: "David Leitch", year: 2023, genre: "アクション", rating: 4.0, duration: 108, description: "A neon-soaked action thriller set in the underground world of Tokyo nightlife.", posterUrl: "https://picsum.photos/seed/movie13/300/450" },
  { id: 14, title: "灼熱の戦場", director: "岡本喜八郎", year: 2022, genre: "アクション", rating: 3.7, duration: 138, description: "太平洋の孤島を舞台にしたミリタリーアクション。", posterUrl: "https://picsum.photos/seed/movie14/300/450" },
  { id: 15, title: "Apex Predator", director: "Gareth Evans", year: 2024, genre: "アクション", rating: 4.6, duration: 126, description: "Brutal hand-to-hand combat in a lawless Southeast Asian city.", posterUrl: "https://picsum.photos/seed/movie15/300/450" },

  // ── コメディ（14本）──
  { id: 16, title: "サラリーマン大逆転", director: "三谷幸喜", year: 2023, genre: "コメディ", rating: 4.1, duration: 112, description: "冴えないサラリーマンがひょんなことから社長になってしまうドタバタコメディ。", posterUrl: "https://picsum.photos/seed/movie16/300/450" },
  { id: 17, title: "家族はつらいよ リターンズ", director: "山田洋次", year: 2022, genre: "コメディ", rating: 3.9, duration: 108, description: "三世代家族が巻き起こす笑いと涙のホームコメディ。", posterUrl: "https://picsum.photos/seed/movie17/300/450" },
  { id: 18, title: "The Grand Misadventure", director: "Wes Anderson", year: 2024, genre: "コメディ", rating: 4.3, duration: 105, description: "A quirky tale of three siblings who accidentally start an international incident.", posterUrl: "https://picsum.photos/seed/movie18/300/450" },
  { id: 19, title: "爆笑キャンプ物語", director: "福田雄一", year: 2021, genre: "コメディ", rating: 3.4, duration: 98, description: "キャンプ初心者たちが繰り広げるドタバタアウトドアコメディ。", posterUrl: "https://picsum.photos/seed/movie19/300/450" },
  { id: 20, title: "Wedding Chaos", director: "Judd Apatow", year: 2023, genre: "コメディ", rating: 3.7, duration: 115, description: "Everything that could go wrong at a destination wedding does.", posterUrl: "https://picsum.photos/seed/movie20/300/450" },
  { id: 21, title: "転校生パニック", director: "矢口史靖", year: 2022, genre: "コメディ", rating: 4.0, duration: 102, description: "転校先の学校で巻き起こる予想外の事件の連続。青春コメディ。", posterUrl: "https://picsum.photos/seed/movie21/300/450" },
  { id: 22, title: "Neighbors from Mars", director: "Edgar Wright", year: 2024, genre: "コメディ", rating: 4.2, duration: 110, description: "When aliens move in next door, suburbia will never be the same.", posterUrl: "https://picsum.photos/seed/movie22/300/450" },
  { id: 23, title: "おばあちゃんVS AI", director: "本広克行", year: 2023, genre: "コメディ", rating: 3.8, duration: 95, description: "スマートホームと格闘するおばあちゃんの爆笑日常。", posterUrl: "https://picsum.photos/seed/movie23/300/450" },
  { id: 24, title: "The Intern Returns", director: "Nancy Meyers", year: 2022, genre: "コメディ", rating: 3.6, duration: 118, description: "A retired senior starts interning at a chaotic tech startup.", posterUrl: "https://picsum.photos/seed/movie24/300/450" },
  { id: 25, title: "珍道中 日本一周", director: "堤幸彦", year: 2021, genre: "コメディ", rating: 3.3, duration: 120, description: "凸凹コンビが軽自動車で日本一周する珍道中ロードムービー。", posterUrl: "https://picsum.photos/seed/movie25/300/450" },
  { id: 26, title: "Office Olympiad", director: "Taika Waititi", year: 2024, genre: "コメディ", rating: 4.4, duration: 100, description: "Bored office workers turn their mundane jobs into an Olympic competition.", posterUrl: "https://picsum.photos/seed/movie26/300/450" },
  { id: 27, title: "恋するロボット", director: "細田守", year: 2023, genre: "コメディ", rating: 3.9, duration: 92, description: "AIロボットが人間に恋をしてしまうラブコメディ。", posterUrl: "https://picsum.photos/seed/movie27/300/450" },
  { id: 28, title: "Dad's Secret Life", director: "Adam McKay", year: 2022, genre: "コメディ", rating: 3.5, duration: 108, description: "A suburban dad turns out to be living a double life as an underground DJ.", posterUrl: "https://picsum.photos/seed/movie28/300/450" },
  { id: 29, title: "居酒屋ウォーズ", director: "宮藤官九郎", year: 2024, genre: "コメディ", rating: 4.1, duration: 104, description: "隣り合う二つの居酒屋の仁義なき客の取り合い合戦。", posterUrl: "https://picsum.photos/seed/movie29/300/450" },

  // ── ドラマ（15本）──
  { id: 30, title: "海辺の約束", director: "是枝裕和", year: 2023, genre: "ドラマ", rating: 4.6, duration: 130, description: "海辺の小さな町で暮らす家族の絆と再生を描く感動作。", posterUrl: "https://picsum.photos/seed/movie30/300/450" },
  { id: 31, title: "Silent Letters", director: "Greta Gerwig", year: 2024, genre: "ドラマ", rating: 4.4, duration: 125, description: "A story of unspoken emotions between a mother and daughter, told through letters.", posterUrl: "https://picsum.photos/seed/movie31/300/450" },
  { id: 32, title: "桜の下で", director: "河瀬直美", year: 2022, genre: "ドラマ", rating: 4.2, duration: 118, description: "奈良の古都を舞台に、老夫婦の最後の春を描く。", posterUrl: "https://picsum.photos/seed/movie32/300/450" },
  { id: 33, title: "The Weight of Water", director: "Denis Villeneuve", year: 2023, genre: "ドラマ", rating: 4.5, duration: 145, description: "A fishing village faces an impossible choice between tradition and survival.", posterUrl: "https://picsum.photos/seed/movie33/300/450" },
  { id: 34, title: "冬のソナタ 東京篇", director: "岩井俊二", year: 2021, genre: "ドラマ", rating: 3.8, duration: 122, description: "東京で再会した元恋人たちの10年越しの物語。", posterUrl: "https://picsum.photos/seed/movie34/300/450" },
  { id: 35, title: "Broken Compass", director: "Barry Jenkins", year: 2024, genre: "ドラマ", rating: 4.3, duration: 135, description: "A war veteran's journey to find meaning in a world that has moved on.", posterUrl: "https://picsum.photos/seed/movie35/300/450" },
  { id: 36, title: "教室の片隅で", director: "李相日", year: 2023, genre: "ドラマ", rating: 4.0, duration: 110, description: "いじめと向き合う教師と生徒たちの物語。", posterUrl: "https://picsum.photos/seed/movie36/300/450" },
  { id: 37, title: "Homecoming Road", director: "Chloé Zhao", year: 2022, genre: "ドラマ", rating: 4.1, duration: 128, description: "An immigrant family's three-generation saga in rural America.", posterUrl: "https://picsum.photos/seed/movie37/300/450" },
  { id: 38, title: "遠い記憶", director: "山田洋次", year: 2020, genre: "ドラマ", rating: 4.4, duration: 140, description: "認知症の母と向き合う息子の日々を静かに描く。", posterUrl: "https://picsum.photos/seed/movie38/300/450" },
  { id: 39, title: "The Piano Teacher", director: "Michael Haneke", year: 2023, genre: "ドラマ", rating: 3.9, duration: 115, description: "A piano prodigy confronts the cost of perfection and parental pressure.", posterUrl: "https://picsum.photos/seed/movie39/300/450" },
  { id: 40, title: "約束の灯台", director: "西川美和", year: 2024, genre: "ドラマ", rating: 4.2, duration: 120, description: "離島の灯台守と都会から来た少女の交流を描く。", posterUrl: "https://picsum.photos/seed/movie40/300/450" },
  { id: 41, title: "Fading Light", director: "Alfonso Cuarón", year: 2021, genre: "ドラマ", rating: 4.7, duration: 138, description: "A photographer documents the last days of a disappearing culture.", posterUrl: "https://picsum.photos/seed/movie41/300/450" },
  { id: 42, title: "午後の遺言", director: "黒沢清", year: 2022, genre: "ドラマ", rating: 3.7, duration: 112, description: "亡き父の遺言をきっかけに兄弟が再会し、家族の秘密に向き合う。", posterUrl: "https://picsum.photos/seed/movie42/300/450" },
  { id: 43, title: "Between the Lines", director: "Paolo Sorrentino", year: 2024, genre: "ドラマ", rating: 4.0, duration: 132, description: "A retired journalist revisits the story that defined and destroyed his career.", posterUrl: "https://picsum.photos/seed/movie43/300/450" },
  { id: 44, title: "さよならの色", director: "新海誠", year: 2023, genre: "ドラマ", rating: 4.5, duration: 116, description: "色覚を失いつつある画家が最後の作品に込める想い。", posterUrl: "https://picsum.photos/seed/movie44/300/450" },

  // ── SF（14本）──
  { id: 45, title: "シンギュラリティ", director: "押井守", year: 2024, genre: "SF", rating: 4.3, duration: 148, description: "AIが自我を獲得した近未来。人間とAIの共存は可能か。", posterUrl: "https://picsum.photos/seed/movie45/300/450" },
  { id: 46, title: "Mars Colony One", director: "Ridley Scott", year: 2023, genre: "SF", rating: 4.1, duration: 155, description: "The first human colony on Mars faces an unexpected existential threat.", posterUrl: "https://picsum.photos/seed/movie46/300/450" },
  { id: 47, title: "量子の海", director: "樋口真嗣", year: 2022, genre: "SF", rating: 3.8, duration: 130, description: "量子コンピュータが作り出した仮想世界に閉じ込められた科学者たちの脱出劇。", posterUrl: "https://picsum.photos/seed/movie47/300/450" },
  { id: 48, title: "Echo Chamber", director: "Alex Garland", year: 2024, genre: "SF", rating: 4.5, duration: 118, description: "A scientist discovers she can communicate with parallel versions of herself.", posterUrl: "https://picsum.photos/seed/movie48/300/450" },
  { id: 49, title: "銀河鉄道2099", director: "庵野秀明", year: 2023, genre: "SF", rating: 4.0, duration: 142, description: "宇宙を旅する列車で繰り広げられる冒険と哲学的な問い。", posterUrl: "https://picsum.photos/seed/movie49/300/450" },
  { id: 50, title: "The Last Signal", director: "Christopher Nolan", year: 2022, genre: "SF", rating: 4.6, duration: 160, description: "Humanity receives a signal from deep space — but decoding it may be a mistake.", posterUrl: "https://picsum.photos/seed/movie50/300/450" },
  { id: 51, title: "ネオ東京 2077", director: "本広克行", year: 2021, genre: "SF", rating: 3.5, duration: 125, description: "2077年の東京。サイボーグ刑事が連続殺人事件を追う。", posterUrl: "https://picsum.photos/seed/movie51/300/450" },
  { id: 52, title: "Terraform", director: "Denis Villeneuve", year: 2024, genre: "SF", rating: 4.4, duration: 150, description: "Engineers tasked with making Venus habitable discover they are not alone.", posterUrl: "https://picsum.photos/seed/movie52/300/450" },
  { id: 53, title: "タイムリープ・ラブ", director: "細田守", year: 2023, genre: "SF", rating: 3.9, duration: 108, description: "タイムリープを繰り返す少女のSFラブストーリー。", posterUrl: "https://picsum.photos/seed/movie53/300/450" },
  { id: 54, title: "Gravity Well", director: "James Gray", year: 2022, genre: "SF", rating: 3.7, duration: 135, description: "A solo astronaut must navigate a gravitational anomaly to return home.", posterUrl: "https://picsum.photos/seed/movie54/300/450" },
  { id: 55, title: "メタバースの住人", director: "山崎貴", year: 2024, genre: "SF", rating: 3.6, duration: 122, description: "仮想世界で生活する人々と現実世界の境界が曖昧になっていく。", posterUrl: "https://picsum.photos/seed/movie55/300/450" },
  { id: 56, title: "Sentinel", director: "Gareth Edwards", year: 2023, genre: "SF", rating: 4.2, duration: 140, description: "An AI defense system goes rogue, and only its creator can stop it.", posterUrl: "https://picsum.photos/seed/movie56/300/450" },
  { id: 57, title: "深淵からの声", director: "塚本晋也", year: 2021, genre: "SF", rating: 3.4, duration: 100, description: "深海探査中に未知の知的生命体と遭遇する。", posterUrl: "https://picsum.photos/seed/movie57/300/450" },
  { id: 58, title: "Parallel Drift", director: "Jonathan Glazer", year: 2024, genre: "SF", rating: 4.0, duration: 112, description: "Two parallel universes begin to merge, threatening both realities.", posterUrl: "https://picsum.photos/seed/movie58/300/450" },

  // ── ホラー（14本）──
  { id: 59, title: "呪いの館", director: "中田秀夫", year: 2023, genre: "ホラー", rating: 3.8, duration: 98, description: "古い洋館に引っ越した家族を襲う怪異。Jホラーの真骨頂。", posterUrl: "https://picsum.photos/seed/movie59/300/450" },
  { id: 60, title: "The Hollow", director: "Jordan Peele", year: 2024, genre: "ホラー", rating: 4.3, duration: 115, description: "A small town discovers that the forest surrounding them is alive — and hungry.", posterUrl: "https://picsum.photos/seed/movie60/300/450" },
  { id: 61, title: "心霊写真", director: "清水崇", year: 2022, genre: "ホラー", rating: 3.5, duration: 92, description: "写真に写り込む謎の影。それは死者からのメッセージだった。", posterUrl: "https://picsum.photos/seed/movie61/300/450" },
  { id: 62, title: "Whisper in the Walls", director: "Ari Aster", year: 2023, genre: "ホラー", rating: 4.5, duration: 128, description: "A family inherits a house with walls that literally whisper secrets.", posterUrl: "https://picsum.photos/seed/movie62/300/450" },
  { id: 63, title: "闇遊び", director: "白石晃士", year: 2021, genre: "ホラー", rating: 3.2, duration: 88, description: "禁断の降霊術を試した大学生たちに次々と不幸が降りかかる。", posterUrl: "https://picsum.photos/seed/movie63/300/450" },
  { id: 64, title: "The Descent Below", director: "Mike Flanagan", year: 2024, genre: "ホラー", rating: 4.1, duration: 110, description: "Spelunkers discover an ancient civilization deep underground — one that still exists.", posterUrl: "https://picsum.photos/seed/movie64/300/450" },
  { id: 65, title: "学校の階段", director: "三池崇史", year: 2023, genre: "ホラー", rating: 3.6, duration: 95, description: "夜の学校で起こる怪談。七不思議が現実になる恐怖。", posterUrl: "https://picsum.photos/seed/movie65/300/450" },
  { id: 66, title: "Midnight Reckoning", director: "Robert Eggers", year: 2022, genre: "ホラー", rating: 4.4, duration: 120, description: "A 17th-century village faces a supernatural reckoning on the winter solstice.", posterUrl: "https://picsum.photos/seed/movie66/300/450" },
  { id: 67, title: "深夜バスの乗客", director: "黒沢清", year: 2024, genre: "ホラー", rating: 3.9, duration: 102, description: "深夜バスの乗客が一人ずつ消えていく。最後に残るのは誰か。", posterUrl: "https://picsum.photos/seed/movie67/300/450" },
  { id: 68, title: "Skin Deep", director: "Ti West", year: 2023, genre: "ホラー", rating: 3.7, duration: 98, description: "A beauty treatment promises eternal youth but delivers eternal horror.", posterUrl: "https://picsum.photos/seed/movie68/300/450" },
  { id: 69, title: "鏡の中の私", director: "園子温", year: 2021, genre: "ホラー", rating: 3.3, duration: 105, description: "鏡に映る自分が別の行動をとり始める。自我崩壊の恐怖。", posterUrl: "https://picsum.photos/seed/movie69/300/450" },
  { id: 70, title: "The Visitor", director: "James Wan", year: 2024, genre: "ホラー", rating: 4.0, duration: 108, description: "Security cameras capture something in the house that shouldn't be there.", posterUrl: "https://picsum.photos/seed/movie70/300/450" },
  { id: 71, title: "地下室の声", director: "高橋洋", year: 2022, genre: "ホラー", rating: 3.4, duration: 90, description: "引っ越し先のマンションの地下室から聞こえる不気味な声。", posterUrl: "https://picsum.photos/seed/movie71/300/450" },
  { id: 72, title: "Sleep No More", director: "Julia Ducournau", year: 2023, genre: "ホラー", rating: 4.2, duration: 115, description: "A sleep study goes terribly wrong when subjects begin sharing the same nightmare.", posterUrl: "https://picsum.photos/seed/movie72/300/450" },

  // ── アニメ（14本）──
  { id: 73, title: "天空のメロディ", director: "新海誠", year: 2024, genre: "アニメ", rating: 4.6, duration: 120, description: "音楽の力で空を飛ぶ少女の冒険ファンタジー。圧倒的な映像美。", posterUrl: "https://picsum.photos/seed/movie73/300/450" },
  { id: 74, title: "ロボット・フレンズ", director: "細田守", year: 2023, genre: "アニメ", rating: 4.2, duration: 105, description: "捨てられたロボットと孤独な少年の友情物語。", posterUrl: "https://picsum.photos/seed/movie74/300/450" },
  { id: 75, title: "Spirited Journey", director: "Hayao Miyazaki", year: 2022, genre: "アニメ", rating: 4.8, duration: 130, description: "A magical adventure through enchanted forests and floating islands.", posterUrl: "https://picsum.photos/seed/movie75/300/450" },
  { id: 76, title: "妖怪大戦争 令和", director: "湯浅政明", year: 2023, genre: "アニメ", rating: 3.9, duration: 110, description: "現代日本に妖怪たちが復活。人間との共存を模索するアニメ。", posterUrl: "https://picsum.photos/seed/movie76/300/450" },
  { id: 77, title: "The Cat Kingdom", director: "Isao Takahata", year: 2021, genre: "アニメ", rating: 4.1, duration: 98, description: "A girl stumbles into a kingdom ruled entirely by cats.", posterUrl: "https://picsum.photos/seed/movie77/300/450" },
  { id: 78, title: "星降る夜に", director: "原恵一", year: 2024, genre: "アニメ", rating: 4.3, duration: 115, description: "天文部の少女たちが流星群の謎を追う青春アニメ。", posterUrl: "https://picsum.photos/seed/movie78/300/450" },
  { id: 79, title: "Dragon Riders", director: "Dean DeBlois", year: 2023, genre: "アニメ", rating: 4.0, duration: 108, description: "Young warriors bond with dragons to protect their floating city.", posterUrl: "https://picsum.photos/seed/movie79/300/450" },
  { id: 80, title: "海底王国", director: "片渕須直", year: 2022, genre: "アニメ", rating: 4.4, duration: 125, description: "深海に広がる王国と地上の少年の交流を描くファンタジー。", posterUrl: "https://picsum.photos/seed/movie80/300/450" },
  { id: 81, title: "時計仕掛けの街", director: "今敏", year: 2021, genre: "アニメ", rating: 4.5, duration: 100, description: "時間が止まった街で唯一動ける少女の不思議な冒険。", posterUrl: "https://picsum.photos/seed/movie81/300/450" },
  { id: 82, title: "Wind Dancer", director: "Pete Docter", year: 2024, genre: "アニメ", rating: 4.2, duration: 95, description: "A young wind spirit learns what it means to be grounded.", posterUrl: "https://picsum.photos/seed/movie82/300/450" },
  { id: 83, title: "花咲く丘で", director: "米林宏昌", year: 2023, genre: "アニメ", rating: 3.8, duration: 102, description: "田舎に引っ越した少女と不思議な花の精の物語。", posterUrl: "https://picsum.photos/seed/movie83/300/450" },
  { id: 84, title: "Shadow Puppet", director: "Mamoru Oshii", year: 2022, genre: "アニメ", rating: 3.7, duration: 112, description: "In a world of living shadows, one puppet dreams of becoming real.", posterUrl: "https://picsum.photos/seed/movie84/300/450" },
  { id: 85, title: "虹色のパレット", director: "新房昭之", year: 2024, genre: "アニメ", rating: 4.0, duration: 90, description: "色を失った世界に色を取り戻す少女画家の物語。", posterUrl: "https://picsum.photos/seed/movie85/300/450" },
  { id: 86, title: "小さな勇者たち", director: "宮崎吾朗", year: 2021, genre: "アニメ", rating: 3.6, duration: 95, description: "小人の世界を舞台にした冒険アニメ。勇気と友情の物語。", posterUrl: "https://picsum.photos/seed/movie86/300/450" },

  // ── ドキュメンタリー（14本）──
  { id: 87, title: "職人の手", director: "河瀬直美", year: 2023, genre: "ドキュメンタリー", rating: 4.3, duration: 95, description: "日本各地の伝統工芸の職人たちを追ったドキュメンタリー。", posterUrl: "https://picsum.photos/seed/movie87/300/450" },
  { id: 88, title: "Ocean's Memory", director: "James Cameron", year: 2024, genre: "ドキュメンタリー", rating: 4.5, duration: 110, description: "A deep-sea exploration revealing ocean ecosystems never before filmed.", posterUrl: "https://picsum.photos/seed/movie88/300/450" },
  { id: 89, title: "東京の24時間", director: "想田和弘", year: 2022, genre: "ドキュメンタリー", rating: 3.9, duration: 100, description: "東京の一日を様々な人々の視点から追う観察映画。", posterUrl: "https://picsum.photos/seed/movie89/300/450" },
  { id: 90, title: "The Last Glacier", director: "Werner Herzog", year: 2023, genre: "ドキュメンタリー", rating: 4.4, duration: 92, description: "A meditative journey to the world's last remaining glaciers.", posterUrl: "https://picsum.photos/seed/movie90/300/450" },
  { id: 91, title: "食卓の向こう側", director: "森達也", year: 2021, genre: "ドキュメンタリー", rating: 4.0, duration: 105, description: "食料問題の裏側に迫るドキュメンタリー。私たちの食を考える。", posterUrl: "https://picsum.photos/seed/movie91/300/450" },
  { id: 92, title: "Chasing Light", director: "Terrence Malick", year: 2024, genre: "ドキュメンタリー", rating: 4.2, duration: 88, description: "Photographers from around the world share their pursuit of the perfect light.", posterUrl: "https://picsum.photos/seed/movie92/300/450" },
  { id: 93, title: "消えゆく言葉", director: "土本典昭", year: 2023, genre: "ドキュメンタリー", rating: 4.1, duration: 98, description: "消滅危機にある日本の方言を記録するドキュメンタリー。", posterUrl: "https://picsum.photos/seed/movie93/300/450" },
  { id: 94, title: "Code Breakers", director: "David Fincher", year: 2022, genre: "ドキュメンタリー", rating: 3.8, duration: 115, description: "The untold stories of the hackers who shaped the modern internet.", posterUrl: "https://picsum.photos/seed/movie94/300/450" },
  { id: 95, title: "里山の四季", director: "小林正樹", year: 2024, genre: "ドキュメンタリー", rating: 4.3, duration: 85, description: "日本の里山の一年を美しい映像で綴る自然ドキュメンタリー。", posterUrl: "https://picsum.photos/seed/movie95/300/450" },
  { id: 96, title: "Street Kitchen", director: "David Gelb", year: 2023, genre: "ドキュメンタリー", rating: 4.0, duration: 90, description: "Street food vendors from six continents share their recipes and stories.", posterUrl: "https://picsum.photos/seed/movie96/300/450" },
  { id: 97, title: "祭りの記憶", director: "原一男", year: 2021, genre: "ドキュメンタリー", rating: 3.7, duration: 108, description: "コロナ禍で中止された祭りと地域の人々の思いを追う。", posterUrl: "https://picsum.photos/seed/movie97/300/450" },
  { id: 98, title: "Sonic Landscapes", director: "Wim Wenders", year: 2024, genre: "ドキュメンタリー", rating: 4.1, duration: 95, description: "A journey through the world's most unique soundscapes, from ice caves to rainforests.", posterUrl: "https://picsum.photos/seed/movie98/300/450" },
  { id: 99, title: "技術の系譜", director: "是枝裕和", year: 2022, genre: "ドキュメンタリー", rating: 4.2, duration: 102, description: "町工場の技術者たちが受け継ぐ匠の技と未来への挑戦。", posterUrl: "https://picsum.photos/seed/movie99/300/450" },
  { id: 100, title: "The Human Thread", director: "Ken Burns", year: 2023, genre: "ドキュメンタリー", rating: 4.4, duration: 120, description: "The history of textiles and how they wove together human civilization.", posterUrl: "https://picsum.photos/seed/movie100/300/450" },
];
