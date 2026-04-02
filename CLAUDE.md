# Sunflower Protocol — 向日葵議定書

## 專案概述

這是一款以 **Vue 3 + TypeScript + Pinia** 開發的戰略視覺小說遊戲 Demo，預計上架 Steam。
遊戲結合**回合制戰棋戰鬥**與**視覺小說劇情演出**，包含 R18 成人內容（戰敗/勝利 H-scene）。
使用 Electron 包裝為桌面應用程式。

## 技術棧

- **框架**: Vue 3 (Composition API) + TypeScript
- **狀態管理**: Pinia 3
- **路由**: Vue Router 5
- **樣式**: Tailwind CSS 4
- **建置**: Vite 7
- **桌面端**: Electron 41
- **Lint**: ESLint + OxLint + Prettier

## 開發指令

```bash
npm run dev          # 啟動開發伺服器
npm run build        # 型別檢查 + 建置（vue-tsc + vite build）
npm run type-check   # 僅型別檢查（vue-tsc --build）
npm run lint         # 執行 oxlint + eslint 修復
npm run format       # Prettier 格式化
```

> **重要**: 每次完成功能實作後，務必執行 `npm run build` 確認零型別錯誤。

## 目錄結構

```
src/
├── App.vue                    # 根元件，管理遊戲狀態切換
├── main.ts                    # 進入點
├── index.css                  # Tailwind 全域樣式
├── components/
│   ├── MainMenu.vue           # 主選單畫面
│   ├── DialogueBox.vue        # 視覺小說對話框（含立繪、背景、CG、BGM）
│   ├── BattleGrid.vue         # 戰棋戰鬥系統（格子地圖、角色移動、技能、動畫）
│   ├── StoryOverlay.vue       # 劇情過場覆蓋層
│   ├── PauseMenu.vue          # 暫停選單
│   └── SaveLoadMenu.vue       # 存檔/讀檔介面
├── stores/
│   └── gameStore.ts           # 核心遊戲狀態（戰鬥邏輯、回合管理、對話系統、存檔）
├── data/
│   ├── characters.ts          # 角色模板定義（屬性、技能）
│   ├── dialogues.ts           # 全部劇情對話資料（Ch1-5 + H-scene）
│   └── levels.ts              # 關卡配置（地圖、敵人配置、勝敗條件、增援）
├── types/
│   └── game.ts                # 全域型別定義（Entity, Skill, Dialogue, LevelConfig 等）
└── router/
    └── index.ts               # 路由設定
```

## 遊戲架構概念

### 核心流程
`主選單 → 劇情對話 (intro) → 戰棋戰鬥 → 劇情對話 (outro) → 下一關`

### gameStore.ts 狀態機
- `MENU` → `STORY` → `PLAYING` → `WIN/LOSE` → `STORY` → 下一關或 `END_CREDITS`
- 戰鬥中回合交替: `PLAYER` ↔ `ENEMY`

### 資料驅動
- 新增角色 → 編輯 `characters.ts`
- 新增劇情 → 編輯 `dialogues.ts`（使用 `Dialogue` 型別）
- 新增關卡 → 編輯 `levels.ts`（使用 `LevelConfig` 型別）
- 型別定義 → `types/game.ts`

## 素材資源規範

所有素材放置於 `public/assets/`，詳細命名規範見 `docs/asset-requirements.md`。

| 類別 | 路徑 | 命名格式 | 檔案格式 |
|------|------|----------|----------|
| 角色立繪 | `public/assets/characters/` | `char_{角色ID}_{表情}.png` | PNG |
| 場景背景 | `public/assets/backgrounds/` | `bg_{場景ID}.png` | PNG/JPG |
| 事件插畫 | `public/assets/cg/` | `cg_{事件ID}.png` | PNG |
| 背景音樂 | `public/assets/bgm/` | `bgm_{曲目ID}.ogg` | OGG |
| 音效 | `public/assets/se/` | `se_{音效ID}.ogg` | OGG |

## 編輯注意事項

- 本專案包含**繁體中文**內容（角色名、對話文本），編輯時務必保持 UTF-8 編碼，避免亂碼
- 對話資料中的 `portrait` 欄位格式為 `角色名 (表情)`，例如 `雅晴 (指揮)`
- `dialogues.ts` 檔案較大，修改時建議分段讀取，不要一次讀取整個檔案
- H-scene 內容的 CG ID 使用 `cg_defeat_` (戰敗) 和 `cg_reward_` (勝利) 前綴區分
