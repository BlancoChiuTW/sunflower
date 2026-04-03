# Sunflower Protocol — Demo 完整資產需求清單

> 版本: v4.0 | 對應劇本: `dialogues.ts` 覆寫版 (Ch1-5 + H-scene)
> 用途: 發包美術 / 音效製作依據
> 最後掃描日期: 2026-04-03

---

## 1. 角色立繪 (Character Sprites)

每位角色需要一張**基底全身立繪**，搭配多套**差分表情**。
對話系統會透過 `portrait` 欄位切換差分。

### 主要角色

| #   | 角色     | 角色 ID          | 差分表情 (共) | 差分列表                                                                         |
| --- | -------- | ---------------- | :-----------: | -------------------------------------------------------------------------------- |
| 1   | 阿典     | `a-dian`         |      10       | 冷靜、通訊（持手機）、思索、決心、戰鬥、突入（踹門動作）、關心、苦笑、微笑、絕望 |
| 2   | 林雅晴   | `ya-qing`        |      14       | 通訊（持手機）、指揮、嚴肅、焦急、低語、冷靜、震怒、勝利（舉文件）、微笑、決死、**動搖**、**喘息(H)**、**沉醉**、**屈辱** |
| 3   | 陳萱萱   | `xuan-xuan`      |      10       | 驚恐、焦急、擔憂、廣播（持麥克風）、釋然、微笑、**羞澀**、**喘息**、**沉醉**、**屈辱** |
| 4   | 王乃蓉   | `nai-rong`       |      11       | 死守（扛門姿態）、喘息、不爽、決心、戰鬥（揮棒）、焦急、微笑、**羞紅**、**沉醉**、**屈辱** |
| 5   | 白狼校長 | `boss-principal` |       3       | 廣播（對麥克風冷笑）、冷笑、驚恐                                                 |

### 次要角色 / 泛用

| #   | 角色             | 用途                                |        差分        |
| --- | ---------------- | ----------------------------------- | :----------------: |
| 6   | 赤星學生（泛用） | 對話中所有赤星敵人共用              | 1（猥瑣/傲慢通用） |
| 7   | 系統提示框       | `portrait: '系統'` 時顯示的 UI 圖標 |         1          |

> **合計：49 張差分立繪**（含 5 張基底全身圖）
> 其中 H-scene 新增 11 張：雅晴 +4、萱萱 +4、乃蓉 +3（乃蓉 (喘息) 已有，羞紅為新增）

---

## 2. 場景背景 (Backgrounds)

每個場景需要**一張 1920x1080 背景圖**，部分場景需要日/夜或損壞變體。

| #   | 場景名稱           | 場景 ID               | 使用章節        | 變體            | 描述                                           |
| --- | ------------------ | --------------------- | --------------- | --------------- | ---------------------------------------------- |
| 1   | 主選單             | `bg_menu`             | Menu            | 1               | 向日葵學園全景遠景，黃昏色調，帶有壓迫感的暗雲 |
| 2   | 西棟走廊（樓梯口） | `bg_west_corridor`    | Ch1             | 2 (正常/破損)   | 有樓梯的走廊，地上散落課桌椅，日光燈管閃爍     |
| 3   | 二樓走廊（暗）     | `bg_corridor_dark`    | Ch2 intro       | 1               | 昏暗的長廊，日光燈忽明忽暗，氣氛壓迫           |
| 4   | 控制室             | `bg_control_room`     | Ch2             | 2 (完整/被破壞) | 廣播設備、監控螢幕牆、控制台，密閉空間感       |
| 5   | 大廳（禮堂）       | `bg_main_hall`        | Ch3             | 1               | 大型室內空間，折疊椅散落，多個出入口           |
| 6   | 校長室             | `bg_principal_office` | Ch4             | 2 (完整/戰鬥後) | 紅木門、辦公桌、保險櫃、監控螢幕、昂貴裝飾     |
| 7   | 校門廣場（黎明前） | `bg_gate_night`       | Ch5 intro       | 1               | 夜色中的校門，赤星人潮壓境                     |
| 8   | 校門廣場（黎明）   | `bg_gate_dawn`        | Ch5 event/outro | 1               | 同場景但晨曦灑落，暖色調，氣氛逆轉             |

> **合計：11 張背景圖**（含變體）

---

## 3. 事件插畫 (Event CG)

從劇本中挑選最具視覺衝擊力的 5 個瞬間，建議製作成 **1920x1080 滿版插畫**。

| #   | CG 名稱  | CG ID             | 章節      | 畫面描述                                                                                                 | 情緒基調       |
| --- | -------- | ----------------- | --------- | -------------------------------------------------------------------------------------------------------- | -------------- |
| 1   | 校門崩塌 | `cg_gate_breach`  | Ch1 intro | 赤星裝甲車撞破鐵柵欄的瞬間，碎片飛散，阿典在走廊另一端回頭望向濃煙。                                     | 震撼、危機爆發 |
| 2   | 踹門突入 | `cg_door_breach`  | Ch2 intro | 阿典一腳踹開控制室大門的動態特寫，門板碎裂，光從走廊射入黑暗房間。                                       | 英雄登場、緊迫 |
| 3   | 乃蓉死守 | `cg_nairong_hold` | Ch3 intro | 乃蓉以肩膀頂住正在被撞擊的大門，汗水沿著臉頰滴落，表情堅毅。背後是蹲在角落的學生們。                     | 悲壯、堅定     |
| 4   | 證據在手 | `cg_evidence`     | Ch4 outro | 雅晴舉起文件夾面對白狼校長，校長面如死灰。辦公室被打得一片狼藉，晨光從窗戶照入。                         | 逆轉、正義     |
| 5   | 黎明反擊 | `cg_dawn_rally`   | Ch5 event | 全校學生如潮水湧入廣場的大遠景。乃蓉揮棒在最前方，萱萱的廣播聲化為視覺上的音波線。背景是正在升起的太陽。 | 熱血、希望     |

### H-Scene CG — 戰敗 (R18)

| # | CG 名稱 | CG ID | 章節 | 畫面描述 | 情緒基調 |
|---|---------|-------|------|---------|---------|
| 6 | 萱萱陷落 | `cg_defeat_xuanxuan` | Ch2 defeat | 萱萱被壓在控制台上，制服衣領被扯開，赤星幹部的手伸向她的身體。螢幕的藍光映照著她含淚的眼角。 | 屈辱、無助 |
| 7 | 乃蓉陷落 | `cg_defeat_nairong` | Ch3 defeat | 乃蓉被多名暴徒按倒在地，運動外套被拉開，汗濕的運動內衣半脫。球棒滾落在一旁，她咬著牙忍住屈辱。 | 悲憤、不屈 |
| 8 | 雅晴陷落 | `cg_defeat_yaqing` | Ch4 defeat | 雅晴被保安反扣在紅木辦公桌上，制服鈕扣崩落。白狼校長在一旁冷笑。她的眼鏡掉在地板上。 | 壓迫、不甘 |

### H-Scene CG — 勝利福利 (R18)

| # | CG 名稱 | CG ID | 章節 | 畫面描述 | 情緒基調 |
|---|---------|-------|------|---------|---------|
| 9 | 萱萱・控制室 | `cg_reward_xuanxuan` | Ch2 reward | 控制室微光中，萱萱靠在阿典懷裡，臉頰泛紅，手指纏著他的衣角。近距離的親密構圖，表情羞澀而信賴。 | 溫柔、羞澀 |
| 10 | 乃蓉・樓梯間 | `cg_reward_nairong` | Ch3 reward | 樓梯轉角，乃蓉靠在牆上，外套拉鍊半開，運動內衣若隱若現。阿典的手在她身上，她臉紅地別過頭。 | 傲嬌、心動 |
| 11 | 雅晴・校長室 | `cg_reward_yaqing` | Ch4 reward | 月光灑入校長室，雅晴坐在辦公桌邊，制服鈕扣半解，眼鏡摘下。阿典靠近她，兩人額頭相觸。 | 深情、釋放 |

> **合計：11 張事件 CG**（劇情 5 張 + 戰敗 H 3 張 + 勝利 H 3 張）

---

## 4. 音效與音樂 (BGM & SE)

### 4-A. 背景音樂 (BGM)

| #   | 曲目名稱         | BGM ID               | 使用場景                 | 情緒 / 風格                                 | 預估長度   |
| --- | ---------------- | -------------------- | ------------------------ | ------------------------------------------- | ---------- |
| 1   | 主選單           | `bgm_menu`           | 主選單畫面               | 低沉電子音，帶有壓迫感的弦樂，暗示危機      | 90s loop   |
| 2   | 劇情對話（緊張） | `bgm_story_tense`    | Ch1-Ch4 intro/outro 對話 | 低音弦樂+鋼琴，懸疑，節奏緩慢               | 120s loop  |
| 3   | 防守戰           | `bgm_battle_defend`  | Ch1 戰鬥                 | 中速鼓點+緊迫弦樂，防禦感，逐漸加壓         | 120s loop  |
| 4   | 潛入/救援        | `bgm_battle_stealth` | Ch2 戰鬥                 | 電子節拍+低頻 bass，暗光走廊氛圍            | 120s loop  |
| 5   | 護送撤離         | `bgm_battle_escort`  | Ch3 戰鬥                 | 快速弦樂+軍鼓，緊急撤離的急迫感             | 120s loop  |
| 6   | Boss 戰          | `bgm_battle_boss`    | Ch4 戰鬥                 | 重型打擊樂+管弦齊奏，壓倒性壓力感           | 150s loop  |
| 7   | 黎明反擊         | `bgm_dawn_rally`     | Ch5 event 後戰鬥         | 熱血管弦+合唱元素，從低谷到高潮的反轉曲     | 150s loop  |
| 8   | 黎明主題曲       | `bgm_dawn_theme`     | Ch5 outro / 結局         | 溫暖鋼琴+弦樂，釋然與希望，帶有校歌旋律元素 | 120s loop  |
| 9   | 勝利             | `bgm_victory`        | 關卡勝利過場             | 短促銅管 fanfare                            | 8s 一次性  |
| 10  | 敗北             | `bgm_defeat`         | 關卡失敗畫面             | 低沉弦樂下行，結尾靜默                      | 10s 一次性 |
| 11  | 親密場景         | `bgm_intimate`       | Ch2-4 勝利福利 H-scene   | 緩慢鋼琴+環境音，曖昧而溫柔，帶有心跳節拍感 | 120s loop  |

> **合計：11 首 BGM**

### 4-B. 音效 (SE)

以下為劇本中 `sfx` 欄位標註的所有音效 + 戰鬥系統所需的 UI/戰鬥音效。

#### 劇情音效（來自 dialogues.ts 標註）

| #   | 音效名稱   | SE ID                | 觸發場景             | 描述                                     |
| --- | ---------- | -------------------- | -------------------- | ---------------------------------------- |
| 1   | 校內廣播   | `se_radio_broadcast` | Ch1 intro, Ch4 intro | 廣播系統開啟的「嗶——」聲 + 迴音感        |
| 2   | 校門撞破   | `se_gate_crash`      | Ch1 intro            | 金屬柵欄被撞擊的巨大碰撞聲               |
| 3   | 警報觸發   | `se_alarm_trigger`   | Ch2 intro            | 刺耳的走廊警報聲（短促，2-3秒）          |
| 4   | 踹門       | `se_door_kick`       | Ch2 intro            | 重物踹擊木門 + 門板碎裂聲                |
| 5   | 無線電通訊 | `se_radio_comm`      | Ch3 intro            | 對講機雜訊 + 通話接通音                  |
| 6   | 通風口破裂 | `se_vent_break`      | Ch3 intro            | 鐵網被踢開的金屬撕裂聲                   |
| 7   | 電子鎖解除 | `se_electronic_lock` | Ch4 intro            | 電子門禁「嗶嗶——卡嚓」解鎖聲             |
| 8   | 大門撞開   | `se_door_break`      | Ch4 intro            | 厚重紅木門被撞開的沉悶撞擊聲             |
| 9   | 密道啟動   | `se_secret_door`     | Ch4 outro            | 機關運轉的齒輪聲 + 鐵門關閉              |
| 10  | 校歌響起   | `se_school_anthem`   | Ch5 event            | 廣播喇叭播放校歌的前奏（帶有擴音器質感） |

#### 戰鬥 / UI 音效

| #   | 音效名稱         | SE ID                | 觸發場景            | 描述                             |
| --- | ---------------- | -------------------- | ------------------- | -------------------------------- |
| 11  | 普通攻擊（盾擊） | `se_hit_bash`        | 盾擊 / 普攻         | 鈍器擊中的悶響                   |
| 12  | 警棍突刺         | `se_skill_baton`     | 阿典技能            | 銳利的揮擊破風聲 + 擊中音        |
| 13  | 球棒揮擊         | `se_skill_bat`       | 乃蓉技能            | 金屬球棒橫掃的破風聲（寬範圍感） |
| 14  | 治療             | `se_skill_heal`      | 雅晴技能            | 繃帶撕開 + 溫暖的回復音效        |
| 15  | 噪音干擾         | `se_skill_noise`     | 萱萱技能            | 刺耳的電子雜訊（短促）           |
| 16  | 擊退碰撞         | `se_push_collision`  | 推撞到牆壁/其他單位 | 身體撞擊牆面的重擊聲             |
| 17  | 路障架設         | `se_barricade_build` | Ch1 互動路障        | 桌椅堆疊的木頭碰撞聲             |
| 18  | 互動確認         | `se_interact`        | 控制台 / 保險櫃互動 | 電子設備啟動的確認音             |
| 19  | 陷阱警告         | `se_trap_alert`      | Ch4 Boss 放置陷阱   | 地板機關啟動的「嗶嗶」聲         |
| 20  | 陷阱觸發         | `se_trap_trigger`    | 踩到陷阱格          | 電擊 / 蒸氣噴射的短促聲          |
| 21  | 敵人增援         | `se_reinforcement`   | 增援波次出現        | 急促的腳步聲 + 警告蜂鳴          |
| 22  | NPC 撤離         | `se_evacuate`        | Ch3 學生到達出口    | 門打開 + 腳步遠去的安心音效      |
| 23  | 單位選擇         | `se_ui_select`       | 選擇己方角色        | 清脆的 UI 點擊音                 |
| 24  | 回合切換         | `se_turn_switch`     | 玩家/敵方回合交替   | 短促的鼓聲過渡音                 |

> **合計：24 個音效**

---

## 資產命名規範

所有資產統一放置於 `public/assets/` 下，依類別分資料夾：

```
public/assets/
├── characters/          # 角色立繪
│   ├── char_adian_calm.png        # {char}_{角色ID}_{表情}.png
│   ├── char_adian_battle.png
│   ├── char_yaqing_command.png
│   ├── char_xuanxuan_broadcast.png
│   ├── char_nairong_hold.png
│   ├── char_principal_broadcast.png
│   └── char_redstar_generic.png
│
├── backgrounds/         # 場景背景
│   ├── bg_menu.png                # {bg}_{場景ID}.png
│   ├── bg_west_corridor.png
│   ├── bg_west_corridor_damaged.png  # 變體加後綴
│   ├── bg_control_room.png
│   └── bg_gate_dawn.png
│
├── cg/                  # 事件插畫
│   ├── cg_gate_breach.png         # {cg}_{事件ID}.png
│   ├── cg_door_breach.png
│   ├── cg_nairong_hold.png
│   ├── cg_evidence.png
│   └── cg_dawn_rally.png
│
├── bgm/                 # 背景音樂
│   ├── bgm_menu.ogg               # {bgm}_{曲目ID}.ogg
│   ├── bgm_battle_defend.ogg
│   ├── bgm_battle_boss.ogg
│   └── bgm_dawn_theme.ogg
│
└── se/                  # 音效
    ├── se_radio_broadcast.ogg     # {se}_{音效ID}.ogg
    ├── se_gate_crash.ogg
    ├── se_hit_bash.ogg
    └── se_ui_select.ogg
```

### 命名規則摘要

| 類別     | 前綴    | 格式                       | 範例                          |
| -------- | ------- | -------------------------- | ----------------------------- |
| 角色立繪 | `char_` | `char_{角色ID}_{表情}.png` | `char_adian_battle.png`       |
| 場景背景 | `bg_`   | `bg_{場景ID}[_{變體}].png` | `bg_control_room_damaged.png` |
| 事件插畫 | `cg_`   | `cg_{事件ID}.png`          | `cg_dawn_rally.png`           |
| 背景音樂 | `bgm_`  | `bgm_{曲目ID}.ogg`         | `bgm_battle_boss.ogg`         |
| 音效     | `se_`   | `se_{音效ID}.ogg`          | `se_door_kick.ogg`            |

> ⚠️ **音訊格式注意**：需求清單命名為 `.ogg`，但程式碼實際載入路徑為 `.mp3`。
> 發行前需統一：建議素材提供 MP3 格式（Electron 相容性佳），或修改程式碼副檔名。
> 立繪與 CG 使用 **PNG**（支援透明通道）。背景可用 **JPG**（無透明需求，檔案較小）。

---

## 5. 戰鬥視覺效果系統（CSS 生成，無需額外素材）

以下效果已透過 CSS 動畫實作，不需要額外的圖片或音效素材。
記錄於此作為設計規格參考，以及未來如需替換為精靈動畫的參考依據。

### 5-A. 技能施放特效

每種技能類型在目標格子上顯示不同的 CSS 動畫效果（持續 ~600ms）：

| 特效類型 | CSS 類別 | 對應技能 | 視覺效果描述 |
|---------|---------|---------|-------------|
| 斬擊 | `skill-fx-slash` | 警棍突刺、球棒揮擊 | 白色對角線閃光，旋轉放大後消失 |
| 重擊 | `skill-fx-heavy` | 全壘打 | 金紅色徑向漸層脈衝，中心發光 |
| 治療 | `skill-fx-heal` | 治療 | 綠色圓形光暈，柔和擴散 |
| 增益 | `skill-fx-buff` | 盾牆防禦、指揮集結 | 天藍色圓形光暈，向外擴散 |
| 減益 | `skill-fx-debuff` | 噪音干擾 | 紫色脈衝，收縮感 |
| 範圍 | `skill-fx-aoe` | 恐慌廣播 | 橘色徑向擴散，影響範圍內所有格子 |

### 5-B. 擊殺獎勵特效

敵人被擊殺時在該格子上方顯示獎勵文字動畫（持續 ~2s）：

| 特效類型 | CSS 類別 | 觸發條件 | 視覺效果描述 |
|---------|---------|---------|-------------|
| 一般擊殺 | `reward-kill` | 擊敗一般敵人 | 橘色「擊破 {名稱}！」文字上浮消失 |
| 連鎖擊殺 | `reward-chain` | 擊殺連鎖觸發 | 金色發光「連鎖 xN！額外行動！」文字 |
| Boss 擊殺 | `reward-bonus` | 擊敗 Boss | 紫色發光「擊破 {名稱}！」文字 |

### 5-C. 戰鬥地圖主題

每個關卡根據 `background` 設定自動套用不同的格子底色與邊框風格：

| 主題 | CSS 類別 | 對應背景 ID | 視覺風格描述 |
|-----|---------|-----------|-------------|
| 走廊 | `map-corridor` | `bg_west_corridor` | 深藍灰色調，低對比度格子 |
| 科技 | `map-tech` | `bg_control_room` | 深藍底色，藍色發光邊框 |
| 大廳 | `map-hall` | `bg_main_hall` | 深靛青色漸層，寬敞感 |
| 辦公 | `map-office` | `bg_principal_office` | 暗棕色調，溫暖色溫 |
| 夜晚 | `map-night` | `bg_gate_night` | 深紫黑色底，紫色發光邊框 |

> **升級方向**：未來可將 CSS 特效替換為 Spine/Lottie 精靈動畫。
> 擊殺獎勵可搭配 `se_kill` 音效增強回饋感。
> 地圖主題可升級為 tileset 圖片背景（需額外的 tileset 素材）。

---

### 表情 ID 對照表（供美術參考）

為確保程式端 `portrait` 欄位與檔案名稱一致，以下為完整對照：

| 角色 | portrait 值（劇本中） | 對應檔名後綴 |
| ---- | --------------------- | ------------ |
| 阿典 | 阿典 (冷靜)           | `calm`       |
|      | 阿典 (通訊)           | `radio`      |
|      | 阿典 (思索)           | `think`      |
|      | 阿典 (決心)           | `resolve`    |
|      | 阿典 (戰鬥)           | `battle`     |
|      | 阿典 (突入)           | `breach`     |
|      | 阿典 (關心)           | `concern`    |
|      | 阿典 (苦笑)           | `wry`        |
|      | 阿典 (微笑)           | `smile`      |
|      | 阿典 (絕望)           | `despair`    |
| 雅晴 | 雅晴 (通訊)           | `radio`      |
|      | 雅晴 (指揮)           | `command`    |
|      | 雅晴 (嚴肅)           | `serious`    |
|      | 雅晴 (焦急)           | `anxious`    |
|      | 雅晴 (低語)           | `whisper`    |
|      | 雅晴 (冷靜)           | `calm`       |
|      | 雅晴 (震怒)           | `fury`       |
|      | 雅晴 (勝利)           | `victory`    |
|      | 雅晴 (微笑)           | `smile`      |
|      | 雅晴 (決死)           | `laststand`  |
|      | **雅晴 (動搖)**       | `shaken`     |
|      | **雅晴 (喘息)**       | `h_panting`  |
|      | **雅晴 (沉醉)**       | `ecstasy`    |
|      | **雅晴 (屈辱)**       | `humiliated` |
| 萱萱 | 萱萱 (驚恐)           | `scared`     |
|      | 萱萱 (焦急)           | `anxious`    |
|      | 萱萱 (擔憂)           | `worry`      |
|      | 萱萱 (廣播)           | `broadcast`  |
|      | 萱萱 (釋然)           | `relief`     |
|      | 萱萱 (微笑)           | `smile`      |
|      | **萱萱 (羞澀)**       | `shy`        |
|      | **萱萱 (喘息)**       | `h_panting`  |
|      | **萱萱 (沉醉)**       | `ecstasy`    |
|      | **萱萱 (屈辱)**       | `humiliated` |
| 乃蓉 | 乃蓉 (死守)           | `hold`       |
|      | 乃蓉 (喘息)           | `panting`    |
|      | 乃蓉 (不爽)           | `annoyed`    |
|      | 乃蓉 (決心)           | `resolve`    |
|      | 乃蓉 (戰鬥)           | `battle`     |
|      | 乃蓉 (焦急)           | `anxious`    |
|      | 乃蓉 (微笑)           | `smile`      |
|      | **乃蓉 (羞紅)**       | `blushing`   |
|      | **乃蓉 (沉醉)**       | `ecstasy`    |
|      | **乃蓉 (屈辱)**       | `humiliated` |
| 校長 | 校長 (廣播)           | `broadcast`  |
|      | 校長 (冷笑)           | `sneer`      |
|      | 校長 (驚恐)           | `panic`      |
| 赤星 | 赤星學生              | `generic`    |
| 系統 | 系統                  | `system`     |

---

## 6. 程式碼引用 vs 素材實作狀態（掃描報告）

> 此節由自動掃描產生，記錄程式碼中所有素材引用的實際載入狀態。

### 6-A. 程式碼中實際載入的素材路徑

以下為程式碼中會 **真正發出 HTTP 請求** 的素材路徑：

| 類別 | 路徑模式 | 引用位置 | 載入方式 |
|------|---------|---------|---------|
| 背景圖 | `/assets/backgrounds/${bg}.png` | `App.vue:14`, `DialogueBox.vue:34` | `<img :src>` 動態綁定 |
| 事件 CG | `/assets/cg/${cg}.png` | `DialogueBox.vue:39` | `<img :src>` 動態綁定 |
| 對話立繪 | `/assets/characters/char_${id}.png` | `DialogueBox.vue:85` | `<img :src>` 動態綁定（透過 PORTRAIT_MAP 映射） |
| 戰棋頭像 | `/assets/characters/char_${id}_normal.png` | `BattleGrid.vue:533,705` | CSS `background-image` + `<img :src>` |
| 背景音樂 | `/assets/bgm/${bgm}.mp3` | `App.vue:85` | `<audio>` 元素（全域 BGM 系統） |
| 對話音效 | `/assets/se/se_${sfxId}.mp3` | `DialogueBox.vue:91` | `new Audio()` 動態播放 |
| 戰鬥音效 | `/assets/se/${id}.mp3` | `gameStore.ts:961` | `new Audio()` 透過 `playSfx()` |
| 網站圖示 | `/favicon.ico` | `index.html:5` | `<link rel="icon">` |

### 6-B. 程式碼引用但尚未實作載入的素材

| 類別 | 資料欄位 | 資料位置 | 狀態 | 說明 |
|------|---------|---------|------|------|
| 音效 (SFX) | `sfx` 欄位 | `dialogues.ts` (11 處) | ✅ 已實作 | `DialogueBox.vue` 透過 watcher 播放 `se_{sfxId}.mp3` |
| 對話立繪 | `portrait` 欄位 | `dialogues.ts` (160 處) | ✅ 已實作 | `DialogueBox.vue` 使用 PORTRAIT_MAP 映射載入立繪圖片 |
| 對話特效 | `effect` 欄位 | `dialogues.ts` | ✅ 已實作 | `light_flicker`, `shake`, `fade_out` 三種 CSS 動畫效果 |

### 6-C. 戰棋頭像引用——實際需要的檔案

程式碼中 `getPortraitId()` 將實體 ID 映射為角色前綴，再加上 `_normal` 後綴：

| 檔案名稱 | 對應實體 ID | 引用位置 |
|---------|-----------|---------|
| `char_a_dian_normal.png` | `player-adian` | `BattleGrid.vue:207` |
| `char_ya_qing_normal.png` | `player-yaqing` | `BattleGrid.vue:208` |
| `char_nai_rong_normal.png` | `player-nairong` | `BattleGrid.vue:209` |
| `char_xuan_xuan_normal.png` | `player-xuanxuan`, `npc-xuanxuan` | `BattleGrid.vue:210-211` |

> **注意**：戰棋頭像與對話立繪使用不同的命名慣例。
> - 戰棋頭像：`char_a_dian_normal.png`（底線分隔 + `_normal` 後綴）
> - 對話立繪：`char_a_dian_calm.png`（底線分隔 + 表情後綴，透過 `DialogueBox.vue` PORTRAIT_MAP 映射）
> - 第 1 節需求清單：`char_adian_calm.png`（無底線分隔名字）
> 發包時需統一命名慣例，建議以程式碼中的 `a_dian` 格式為準。

### 6-D. 背景圖——程式碼實際引用的完整清單

| 背景 ID | 引用來源 | 第 2 節是否已列 |
|---------|---------|:------------:|
| `bg_west_corridor` | `levels.ts:38`, `dialogues.ts:15,84` | ✅ |
| `bg_corridor_dark` | `dialogues.ts:141` | ✅ |
| `bg_control_room` | `levels.ts:126`, `dialogues.ts:182,218,647,711` | ✅ |
| `bg_main_hall` | `levels.ts:205`, `dialogues.ts:274,332,804` | ✅ |
| `bg_principal_office` | `levels.ts:287`, `dialogues.ts:388,464,961,1025` | ✅ |
| `bg_gate_night` | `levels.ts:353`, `dialogues.ts:528` | ✅ |
| `bg_gate_dawn` | `dialogues.ts:553,603` | ✅ |
| `bg_menu` | — | ⚠️ 列於需求但程式碼未引用 |
| `bg_west_corridor_damaged` | — | ⚠️ 列於需求但程式碼未引用 |
| `bg_principal_office` 戰鬥後變體 | — | ⚠️ 列於需求但程式碼未引用 |
| `bg_control_room` 破壞變體 | — | ⚠️ 列於需求但程式碼未引用 |

### 6-E. BGM——程式碼實際引用的完整清單

| BGM ID | 引用來源 | 第 4-A 節是否已列 |
|--------|---------|:---------------:|
| `bgm_story_tense` | `dialogues.ts` (12 處) | ✅ |
| `bgm_battle_defend` | `levels.ts:39` | ✅ |
| `bgm_battle_stealth` | `levels.ts:127` | ✅ |
| `bgm_battle_escort` | `levels.ts:206` | ✅ |
| `bgm_battle_boss` | `levels.ts:288` | ✅ |
| `bgm_dawn_rally` | `levels.ts:354`, `dialogues.ts:552` | ✅ |
| `bgm_dawn_theme` | `dialogues.ts:602` | ✅ |
| `bgm_intimate` | `dialogues.ts:712,869,1026` | ✅ |
| `bgm_victory` | `gameStore.ts:474` | ✅ |
| `bgm_defeat` | `gameStore.ts:481` | ✅ |
| `bgm_menu` | `App.vue:69,103` | ✅ |

### 6-F. SFX——對話 SFX 播放狀態

以下 SFX ID 存在於 `dialogues.ts` 的 `sfx` 欄位，**已透過 `DialogueBox.vue` watcher 實作播放**（路徑：`/assets/se/se_{sfxId}.mp3`）：

| SFX ID (不含 `se_` 前綴) | dialogues.ts 行號 | asset-requirements.md 第 4-B 節是否已列 |
|-------------------------|-------------------|:-----------------------------------:|
| `radio_broadcast` | 23, 396 | ✅ |
| `gate_crash` | 36 | ✅ |
| `alarm_trigger` | 173 | ✅ |
| `door_kick` | 189 | ✅ |
| `radio_comm` | 296 | ✅ |
| `vent_break` | 321 | ✅ |
| `electronic_lock` | 427 | ✅ |
| `door_break` | 436 | ✅ |
| `secret_door` | 485 | ✅ |
| `school_anthem` | 551 | ✅ |

> **注意**：第 4-B 節的 14 個戰鬥/UI 音效（se_hit_bash ~ se_turn_switch）已全部在 `gameStore.ts` 中透過 `playSfx()` 連接。
> 包含：互動音效 `se_interact`、路障架設 `se_barricade_build`、陷阱警告 `se_trap_alert`、陷阱觸發 `se_trap_trigger` 等。

### 6-G. 事件 CG——程式碼引用 vs 需求清單比對

| CG ID | dialogues.ts 行號 | 第 3 節是否已列 |
|-------|-------------------|:------------:|
| `cg_gate_breach` | 38 | ✅ |
| `cg_door_breach` | 190 | ✅ |
| `cg_nairong_hold` | 276 | ✅ |
| `cg_evidence` | 478 | ✅ |
| `cg_dawn_rally` | 554 | ✅ |
| `cg_defeat_xuanxuan` | 667 | ✅ |
| `cg_reward_xuanxuan` | 731 | ✅ |
| `cg_defeat_nairong` | 824 | ✅ |
| `cg_reward_nairong` | 894 | ✅ |
| `cg_defeat_yaqing` | 981 | ✅ |
| `cg_reward_yaqing` | 1063 | ✅ |

> CG 清單完全吻合，無遺漏。

### 6-H. 字體資源

| 字體 | 載入方式 | 引用位置 | 狀態 |
|------|---------|---------|------|
| Noto Sans TC (400,500,700,900) | Google Fonts CDN | `index.html:10` | ✅ 外部載入 |
| Rajdhani (500,600,700) | Google Fonts CDN | `index.html:10` | ✅ 外部載入 |

> 目前依賴 Google Fonts CDN。離線 / Steam 發行時需要本地化字體檔案。

---

## 7. 素材盤點（磁碟 vs 程式碼引用）

> 盤點日期: 2026-04-03
> 掃描路徑: `public/assets/`

### 7-A. 角色立繪 `characters/` — ✅ 完備（53 檔）

**對話立繪**（DialogueBox.vue PORTRAIT_MAP → `char_{id}.png`）：

| 角色 | 需求數 | 磁碟數 | 狀態 | 缺少 |
|------|:-----:|:-----:|:----:|------|
| 阿典 | 10 | 10 | ✅ | — |
| 雅晴 | 14 | 14 | ✅ | — |
| 萱萱 | 10 | 10 | ✅ | — |
| 乃蓉 | 10 | 10 | ✅ | — |
| 校長 | 3 | 3 | ✅ | — |
| 赤星學生 | 1 | 1 | ✅ | — |

**戰棋頭像**（BattleGrid.vue getPortraitId → `char_{id}_normal.png`）：

| 檔案 | 狀態 |
|------|:----:|
| `char_a_dian_normal.png` | ✅ |
| `char_ya_qing_normal.png` | ✅ |
| `char_nai_rong_normal.png` | ✅ |
| `char_xuan_xuan_normal.png` | ✅ |

**磁碟上有但程式碼未引用**（額外檔案）：

| 檔案 | 說明 |
|------|------|
| `char_nai_rong_battle_ball.png` | 疑似乃蓉戰鬥揮棒差分備選，未被任何程式碼引用 |

### 7-B. 場景背景 `backgrounds/` — ❌ 全缺（目錄不存在）

程式碼引用 7 張背景圖，**全部缺少**：

| 需要的檔案 | 引用來源 | 狀態 |
|-----------|---------|:----:|
| `bg_west_corridor.png` | `levels.ts`, `dialogues.ts` | ❌ |
| `bg_corridor_dark.png` | `dialogues.ts` | ❌ |
| `bg_control_room.png` | `levels.ts`, `dialogues.ts` | ❌ |
| `bg_main_hall.png` | `levels.ts`, `dialogues.ts` | ❌ |
| `bg_principal_office.png` | `levels.ts`, `dialogues.ts` | ❌ |
| `bg_gate_night.png` | `levels.ts`, `dialogues.ts` | ❌ |
| `bg_gate_dawn.png` | `dialogues.ts` | ❌ |

需求清單另有 4 張變體（damaged 等），程式碼尚未引用，可暫不製作。

### 7-C. 事件插畫 `cg/` — ❌ 全缺（目錄不存在）

程式碼引用 11 張 CG，**全部缺少**：

| 需要的檔案 | 章節 | 類型 | 狀態 |
|-----------|------|------|:----:|
| `cg_gate_breach.png` | Ch1 | 劇情 | ❌ |
| `cg_door_breach.png` | Ch2 | 劇情 | ❌ |
| `cg_nairong_hold.png` | Ch3 | 劇情 | ❌ |
| `cg_evidence.png` | Ch4 | 劇情 | ❌ |
| `cg_dawn_rally.png` | Ch5 | 劇情 | ❌ |
| `cg_defeat_xuanxuan.png` | Ch2 | H-戰敗 | ❌ |
| `cg_defeat_nairong.png` | Ch3 | H-戰敗 | ❌ |
| `cg_defeat_yaqing.png` | Ch4 | H-戰敗 | ❌ |
| `cg_reward_xuanxuan.png` | Ch2 | H-勝利 | ❌ |
| `cg_reward_nairong.png` | Ch3 | H-勝利 | ❌ |
| `cg_reward_yaqing.png` | Ch4 | H-勝利 | ❌ |

### 7-D. 背景音樂 `bgm/` — ✅ 完備（11 檔）

| 檔案 | 程式碼引用 | 狀態 |
|------|----------|:----:|
| `bgm_menu.mp3` | `App.vue:69,103` | ✅ |
| `bgm_story_tense.mp3` | `dialogues.ts` (12 處) | ✅ |
| `bgm_battle_defend.mp3` | `levels.ts` | ✅ |
| `bgm_battle_stealth.mp3` | `levels.ts` | ✅ |
| `bgm_battle_escort.mp3` | `levels.ts` | ✅ |
| `bgm_battle_boss.mp3` | `levels.ts` | ✅ |
| `bgm_dawn_rally.mp3` | `levels.ts`, `dialogues.ts` | ✅ |
| `bgm_dawn_theme.mp3` | `dialogues.ts` | ✅ |
| `bgm_intimate.mp3` | `dialogues.ts` (3 處) | ✅ |
| `bgm_victory.mp3` | `gameStore.ts` | ✅ |
| `bgm_defeat.mp3` | `gameStore.ts` | ✅ |

### 7-E. 音效 `se/` — ✅ 完備（24 檔）

**劇情音效**（DialogueBox.vue → `se_{sfxId}.mp3`）：

| 檔案 | 狀態 |
|------|:----:|
| `se_radio_broadcast.mp3` | ✅ |
| `se_gate_crash.mp3` | ✅ |
| `se_alarm_trigger.mp3` | ✅ |
| `se_door_kick.mp3` | ✅ |
| `se_radio_comm.mp3` | ✅ |
| `se_vent_break.mp3` | ✅ |
| `se_electronic_lock.mp3` | ✅ |
| `se_door_break.mp3` | ✅ |
| `se_secret_door.mp3` | ✅ |
| `se_school_anthem.mp3` | ✅ |

**戰鬥/UI 音效**（gameStore.ts `playSfx()` → `se_{id}.mp3`）：

| 檔案 | 觸發場景 | 狀態 |
|------|---------|:----:|
| `se_ui_select.mp3` | 選擇角色 | ✅ |
| `se_hit_bash.mp3` | 盾擊/推撞 | ✅ |
| `se_skill_baton.mp3` | 阿典技能 | ✅ |
| `se_skill_bat.mp3` | 乃蓉技能 | ✅ |
| `se_skill_heal.mp3` | 雅晴技能 | ✅ |
| `se_skill_noise.mp3` | 萱萱技能 | ✅ |
| `se_push_collision.mp3` | 推撞碰撞 | ✅ |
| `se_barricade_build.mp3` | Ch1 路障 | ✅ |
| `se_interact.mp3` | 互動確認 | ✅ |
| `se_trap_alert.mp3` | 陷阱警告 | ✅ |
| `se_trap_trigger.mp3` | 陷阱觸發 | ✅ |
| `se_reinforcement.mp3` | 敵人增援 | ✅ |
| `se_evacuate.mp3` | NPC 撤離 | ✅ |
| `se_turn_switch.mp3` | 回合切換 | ✅ |

### 7-F. 盤點總結

| 類別 | 需求數 | 磁碟數 | 缺少數 | 完成率 |
|------|:-----:|:-----:|:-----:|:-----:|
| 角色立繪（對話） | 48 | 48 | 0 | **100%** |
| 角色頭像（戰棋） | 4 | 4 | 0 | **100%** |
| 場景背景 | 7 | 0 | **7** | **0%** |
| 事件 CG | 11 | 0 | **11** | **0%** |
| BGM | 11 | 11 | 0 | **100%** |
| SE | 24 | 24 | 0 | **100%** |
| **合計** | **105** | **87** | **18** | **83%** |

> 額外檔案：`char_nai_rong_battle_ball.png`（1 檔，未被引用）

---

## 8. 待處理項目清單

### 🔴 高優先（缺少素材，影響遊戲顯示）

| # | 項目 | 數量 | 說明 |
|---|------|:----:|------|
| 1 | **場景背景圖** | 7 張 | `backgrounds/` 目錄不存在，全部背景缺失。程式碼有 `@error` fallback 但無圖顯示黑屏 |
| 2 | **事件 CG 插畫** | 11 張 | `cg/` 目錄不存在，劇情 CG + H-scene CG 全缺。CG 覆蓋層無圖時不顯示 |

### ✅ 已完成

| # | 項目 | 完成狀態 |
|---|------|---------|
| 1 | **SFX 播放系統** | ✅ `DialogueBox.vue` watcher + `gameStore.ts` `playSfx()` 已全部連接 |
| 2 | **對話立繪圖片載入** | ✅ `DialogueBox.vue` 使用 PORTRAIT_MAP 映射，48 張全部到位 |
| 3 | **對話特效** | ✅ `light_flicker`, `shake`, `fade_out` 三種 CSS 動畫效果已實作 |
| 4 | **戰鬥/UI 音效全部連接** | ✅ 24 個音效全部透過 `playSfx()` 連接且檔案到位 |
| 5 | **主選單 BGM** | ✅ `App.vue` 全域 BGM 系統，11 首全部到位 |
| 6 | **技能施放特效增強** | ✅ 6 種技能 CSS 特效（多層效果、偽元素粒子、衝擊波環） |
| 7 | **角色立繪素材** | ✅ 48 張對話立繪 + 4 張戰棋頭像全部到位 |
| 8 | **音效素材** | ✅ 24 個 SE 檔案全部到位（MP3 格式） |
| 9 | **BGM 素材** | ✅ 11 首 BGM 檔案全部到位（MP3 格式） |

### 🟡 中優先（命名 & 格式不一致）

| # | 項目 | 說明 | 建議 |
|---|------|------|------|
| 1 | **角色 ID 命名不一致** | 需求清單第 1 節用 `char_adian`，程式碼與實際檔案用 `char_a_dian`（底線分隔） | 統一修改需求清單第 1 節為底線分隔格式 |
| 2 | **音訊副檔名不一致** | 需求清單命名 `.ogg`，實際檔案與程式碼皆為 `.mp3` | 已統一為 MP3，需更新需求清單第 4 節命名規範 |
| 3 | **額外未引用檔案** | `char_nai_rong_battle_ball.png` 存在但無程式碼引用 | 確認是否為備選素材，或移除 |

### 🟢 低優先（規劃項目）

| # | 項目 | 說明 | 建議 |
|---|------|------|------|
| 1 | **背景圖變體** | damaged/戰鬥後共 4 張變體列於需求但程式碼無切換邏輯 | 待劇情系統支援場景切換時再加 |
| 2 | **Google Fonts 離線化** | 目前依賴 CDN，Steam 離線環境可能無法載入 | 發行前需下載 woff2 檔案並改為本地載入 |
| 3 | **教學系統圖示** | `TutorialOverlay.vue` 使用 Iconify CDN 圖示 | 若需離線可替換為本地 SVG |
