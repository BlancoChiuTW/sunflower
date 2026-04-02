import type { EntityType, Dialogue, Skill, LevelConfig, EntityConfig, EnvironmentTile } from '@/types/game';
import { characterTemplates } from './characters';

const getChar = (key: string, id: string, x: number, y: number): EntityConfig => {
  const t = characterTemplates[key]!;
  return {
    id,
    name: t.name,
    x,
    y,
    hp: t.hp,
    maxHp: t.maxHp,
    type: t.type,
    attack: t.attack,
    skills: t.skills,
  };
};

export const levels: LevelConfig[] = [
  // ================================================================
  // Chapter 1 — 西側貨運樓梯防守戰 (8×8)
  //
  // 設計理念：教學關。阿典單人防守，學會利用路障+擊退+地形。
  // 勝利條件：撐過 6 回合。
  // 失敗條件：阿典陣亡 或 3 名敵人突破防線(y≥7)。
  //
  // 數值驗算：
  //   阿典 DPS：盾擊 6 + 碰撞 2 = 8/回合，或警棍 8 + 碰撞×2 = 12/回合
  //   阿典 30HP vs 敵方攻擊 2~4，大約能承受 8~15 次攻擊
  //   敵方總 HP = 10+10+10+10+12+12+12+16 = 92
  //   不需要全殺，只要擊退+路障拖延 6 回合
  //   路障（共5面）可吸收大量傷害，策略核心是阻擋缺口
  // ================================================================
  {
    id: 'chapter-1',
    title: '第一關：西側貨運樓梯防守戰',
    gridSize: { width: 8, height: 8 },
    background: 'bg_west_corridor',
    bgm: 'bgm_battle_defend',
    entities: [
      getChar('a-dian', 'player-adian', 4, 5),
      // ── 路障防線（y=3）：中央3格封住，左右兩側有缺口 ──
      { id: 'desk-1', name: '課桌椅', x: 3, y: 3, hp: 14, maxHp: 14, type: 'OBSTACLE' },
      { id: 'desk-2', name: '課桌椅', x: 4, y: 3, hp: 14, maxHp: 14, type: 'OBSTACLE' },
      { id: 'desk-3', name: '課桌椅', x: 5, y: 3, hp: 14, maxHp: 14, type: 'OBSTACLE' },
      // ── 材料堆：玩家可互動建造額外路障，封住缺口 ──
      { id: 'barricade-1', name: '材料堆', x: 2, y: 4, hp: 5, maxHp: 5, type: 'INTERACTABLE' },
      { id: 'barricade-2', name: '材料堆', x: 6, y: 4, hp: 5, maxHp: 5, type: 'INTERACTABLE' },
      // ── 急救箱：互動回復 15 HP（一次性） ──
      { id: 'medkit-1', name: '急救箱', x: 4, y: 6, hp: 99, maxHp: 99, type: 'INTERACTABLE' },
      // ── 初始敵人（第1回合）：2 名推進兵從正面進攻 ──
      { id: 'pusher-01', name: '推進兵', x: 3, y: 0, hp: 10, maxHp: 10, type: 'ENEMY', attack: 2 },
      { id: 'pusher-02', name: '推進兵', x: 5, y: 0, hp: 10, maxHp: 10, type: 'ENEMY', attack: 2 },
    ],
    openingStory: [],
    missionBriefing: {
      objective: '防守走廊 6 回合，不讓 3 名以上敵人突破防線（紅線）',
      tips: [
        '點擊阿典 → 點擊空格移動，或點擊敵人進行盾擊',
        '點擊技能按鈕 → 選擇目標使用「警棍突刺」擊退敵人',
        '金色閃爍的「材料堆」可以互動，建造額外路障封住缺口',
        '「急救箱」可回復 15 HP，善加利用',
        '不需要殺光敵人，撐過 6 回合就是勝利！',
      ],
      failCondition: '阿典陣亡 或 3 名敵人突破底部紅線 → 任務失敗',
    },
    winCondition: {
      surviveTurns: 6,
    },
    loseCondition: {
      breachLine: { y: 7, maxBreaches: 3 },
      requiredAlive: ['player-adian'],
    },
    reinforcements: [
      {
        // 第2回合：左右兩翼各1推進兵，測試玩家封堵缺口
        turn: 2,
        entities: [
          { id: 'pusher-03', name: '推進兵', x: 1, y: 0, hp: 10, maxHp: 10, type: 'ENEMY', attack: 2 },
          { id: 'pusher-04', name: '推進兵', x: 7, y: 0, hp: 10, maxHp: 10, type: 'ENEMY', attack: 2 },
        ],
      },
      {
        // 第3回合：2盾牌兵（更硬），正面施壓
        turn: 3,
        entities: [
          { id: 'shield-01', name: '盾牌兵', x: 4, y: 0, hp: 12, maxHp: 12, type: 'ENEMY', attack: 3 },
          { id: 'shield-02', name: '盾牌兵', x: 6, y: 0, hp: 12, maxHp: 12, type: 'ENEMY', attack: 3 },
        ],
      },
      {
        // 第4回合：1盾牌兵繞側翼
        turn: 4,
        entities: [
          { id: 'shield-03', name: '盾牌兵', x: 0, y: 0, hp: 12, maxHp: 12, type: 'ENEMY', attack: 3 },
        ],
      },
      {
        // 第5回合：小隊長壓陣（最後1回合的壓力高潮）
        turn: 5,
        entities: [
          { id: 'squad-leader', name: '小隊長', x: 4, y: 0, hp: 16, maxHp: 16, type: 'ENEMY', attack: 4 },
        ],
      },
    ],
  },

  // ================================================================
  // Chapter 2 — 控制室破門突入戰 (10×6)
  //
  // 設計理念：限時突襲。阿典+雅晴 從左側突入，消滅幹部+搶主控台。
  // 勝利條件：消滅全部幹部 + 互動主控台。
  // 失敗條件：超過 8 回合 / 萱萱陣亡 / 阿典陣亡。
  //
  // 數值驗算：
  //   阿典 DPS：8（警棍）或 6（盾擊）+ 碰撞加成
  //   雅晴 DPS：3（盾擊）+ 每回合可補 11HP
  //   幹部 HP=12，阿典 2 回合可殺 1 個（8+6=14 > 12）
  //   3 幹部需約 6 回合清完，8 回合留有餘裕去互動主控台
  //   門控鈕（可選）：關閉後阻止第5回合增援，獎勵探索型玩家
  // ================================================================
  {
    id: 'chapter-2',
    title: '第二關：控制室破門突入戰',
    gridSize: { width: 10, height: 6 },
    background: 'bg_control_room',
    bgm: 'bgm_battle_stealth',
    entities: [
      getChar('a-dian', 'player-adian', 0, 2),
      getChar('ya-qing', 'player-yaqing', 0, 3),
      // ── 3 名赤星幹部分散在房間內 ──
      { id: 'officer-01', name: '赤星幹部', x: 5, y: 1, hp: 12, maxHp: 12, type: 'ENEMY', attack: 4 },
      { id: 'officer-02', name: '赤星幹部', x: 7, y: 3, hp: 12, maxHp: 12, type: 'ENEMY', attack: 4 },
      { id: 'officer-03', name: '赤星幹部', x: 8, y: 1, hp: 12, maxHp: 12, type: 'ENEMY', attack: 4 },
      // ── 萱萱 NPC（被救對象） ──
      { id: 'npc-xuanxuan', name: '萱萱', x: 9, y: 4, hp: 15, maxHp: 15, type: 'NPC' },
      // ── 主控台（勝利必須互動） ──
      { id: 'control-panel', name: '主控台', x: 9, y: 2, hp: 99, maxHp: 99, type: 'INTERACTABLE' },
      // ── 門控鈕（可選：關閉後阻止增援） ──
      { id: 'door-switch', name: '門控鈕', x: 4, y: 0, hp: 99, maxHp: 99, type: 'INTERACTABLE' },
      // ── 走廊障礙物（提供掩體） ──
      { id: 'cabinet-1', name: '鐵櫃', x: 3, y: 1, hp: 12, maxHp: 12, type: 'OBSTACLE' },
      { id: 'cabinet-2', name: '鐵櫃', x: 3, y: 4, hp: 12, maxHp: 12, type: 'OBSTACLE' },
      // ── 伺服器機架（走廊中段掩體） ──
      { id: 'server-rack', name: '伺服器', x: 6, y: 3, hp: 10, maxHp: 10, type: 'OBSTACLE' },
    ],
    openingStory: [],
    missionBriefing: {
      objective: '消滅所有赤星幹部，然後互動「主控台」奪回控制權',
      tips: [
        '⚔️ 先消滅 3 名赤星幹部（紅色單位），再去操作主控台',
        '🎯 走到金色「主控台」旁邊，點擊它即可互動',
        '🚪 可選：走到「門控鈕」互動，可以阻止第 5 回合的敵方增援',
        '💊 雅晴的「急救包」技能可以遠程補血（射程 2 格）',
        '📢 雅晴的「指揮號令」可以讓阿典下次攻擊 +4 傷害',
        '⚠️ 注意保護萱萱（綠色 NPC），她被殺就會任務失敗',
      ],
      failCondition: '超過 8 回合 / 阿典陣亡 / 萱萱被殺 → 任務失敗',
    },
    environmentTiles: [
      // ALARM tiles: stepping on these triggers reinforcement warning
      { x: 5, y: 0, effect: 'ALARM' },
      { x: 5, y: 5, effect: 'ALARM' },
    ],
    winCondition: {
      defeatAll: true,
      interactTargets: ['control-panel'],
    },
    loseCondition: {
      turnLimit: 8,
      npcLost: ['npc-xuanxuan'],
      requiredAlive: ['player-adian'],
    },
    reinforcements: [
      {
        // 第5回合：走廊追兵（可被門控鈕阻止）
        turn: 5,
        entities: [
          { id: 'ch2-reinf-1', name: '追兵', x: 0, y: 0, hp: 8, maxHp: 8, type: 'ENEMY', attack: 3 },
          { id: 'ch2-reinf-2', name: '追兵', x: 0, y: 5, hp: 8, maxHp: 8, type: 'ENEMY', attack: 3 },
        ],
      },
    ],
  },

  // ================================================================
  // Chapter 3 — 大廳解圍撤離戰 (10×10)
  //
  // 設計理念：護送關。保護學生 NPC 到達出口，同時壓制包圍的暴徒。
  // 勝利條件：5 名以上學生撤離到 y≥9。
  // 失敗條件：阿典或乃蓉陣亡。
  //
  // 數值驗算：
  //   學生 NPC 自動向下移動 1 格/回合，從 y=4~7 到 y=9 需 2~5 回合
  //   阿典(y=8)+雅晴(y=8) 從南方接應，乃蓉(y=4) 從前線頂住
  //   暴徒 HP=10，阿典盾擊 6+碰撞即可 1~2 回合擊殺
  //   乃蓉第3回合加入，球棒橫掃 8×3 = 24 傷害（同時打 3 個）
  //   8 學生需撤離 5，容許損失 3 人
  //   第5回合增援+第7回合精英增加後期壓力
  // ================================================================
  {
    id: 'chapter-3',
    title: '第三關：大廳解圍撤離戰',
    gridSize: { width: 10, height: 10 },
    background: 'bg_main_hall',
    bgm: 'bgm_battle_escort',
    entities: [
      getChar('a-dian', 'player-adian', 3, 8),
      getChar('ya-qing', 'player-yaqing', 4, 8),
      // ── 乃蓉（NPC→第3回合加入玩家） ──
      { id: 'player-nairong', name: '王乃蓉', x: 5, y: 4, hp: 40, maxHp: 40, type: 'NPC', attack: 8,
        skills: [{ id: 'bat_swing', name: '球棒揮擊', description: '橫掃前方 3 格造成 ATK 傷害並擊退', type: 'target' as const, range: 1, cooldown: 1 }] },
      // ── 學生 NPC（8人，分佈在中段和下半部） ──
      { id: 'student-1', name: '學生', x: 2, y: 4, hp: 10, maxHp: 10, type: 'NPC' },
      { id: 'student-2', name: '學生', x: 8, y: 4, hp: 10, maxHp: 10, type: 'NPC' },
      { id: 'student-3', name: '學生', x: 3, y: 5, hp: 10, maxHp: 10, type: 'NPC' },
      { id: 'student-4', name: '學生', x: 7, y: 5, hp: 10, maxHp: 10, type: 'NPC' },
      { id: 'student-5', name: '學生', x: 4, y: 6, hp: 10, maxHp: 10, type: 'NPC' },
      { id: 'student-6', name: '學生', x: 6, y: 6, hp: 10, maxHp: 10, type: 'NPC' },
      { id: 'student-7', name: '學生', x: 2, y: 7, hp: 10, maxHp: 10, type: 'NPC' },
      { id: 'student-8', name: '學生', x: 8, y: 7, hp: 10, maxHp: 10, type: 'NPC' },
      // ── 初始暴徒（北側包圍，阻擋學生去路） ──
      { id: 'thug-01', name: '赤星暴徒', x: 3, y: 1, hp: 10, maxHp: 10, type: 'ENEMY', attack: 3 },
      { id: 'thug-02', name: '赤星暴徒', x: 7, y: 1, hp: 10, maxHp: 10, type: 'ENEMY', attack: 3 },
      { id: 'thug-03', name: '赤星暴徒', x: 1, y: 3, hp: 10, maxHp: 10, type: 'ENEMY', attack: 3 },
      { id: 'thug-04', name: '赤星暴徒', x: 9, y: 3, hp: 10, maxHp: 10, type: 'ENEMY', attack: 3 },
    ],
    openingStory: [],
    missionBriefing: {
      objective: '護送至少 5 名學生撤離到地圖底部（綠色區域）',
      tips: [
        '🏃 學生（綠色 NPC）每回合會自動向下移動 1 格',
        '🛡️ 清除前方暴徒，替學生打開逃生通道',
        '⚔️ 第 3 回合乃蓉會從前線加入戰鬥（可操作）',
        '🔥 第 4 回合暴徒會縱火，注意迴避火焰地格',
        '💪 乃蓉的「球棒揮擊」可橫掃 3 格，適合清群',
        '8 名學生中撤離 5 名即可，容許損失 3 人',
      ],
      failCondition: '阿典或乃蓉陣亡 → 任務失敗',
    },
    winCondition: {
      escortCount: 5,
      escortExit: { x: 5, y: 9 },
    },
    loseCondition: {
      requiredAlive: ['player-adian', 'player-nairong'],
    },
    reinforcements: [
      {
        // 第5回合：左右兩翼增援
        turn: 5,
        entities: [
          { id: 'thug-05', name: '赤星暴徒', x: 0, y: 0, hp: 10, maxHp: 10, type: 'ENEMY', attack: 3 },
          { id: 'thug-06', name: '赤星暴徒', x: 9, y: 0, hp: 10, maxHp: 10, type: 'ENEMY', attack: 3 },
        ],
      },
      {
        // 第7回合：精英追兵，增加後期壓力
        turn: 7,
        entities: [
          { id: 'thug-elite', name: '赤星精英', x: 5, y: 0, hp: 16, maxHp: 16, type: 'ENEMY', attack: 5 },
        ],
      },
    ],
  },

  // ================================================================
  // Chapter 4 — 校長室最終 Boss 戰 (8×8)
  //
  // 設計理念：4人全員 Boss 戰。校長不動但每回合召喚+放陷阱。
  // 勝利條件：擊敗校長 + 互動保險櫃。
  // 失敗條件：超過 10 回合 / 阿典或雅晴陣亡。
  //
  // 數值驗算：
  //   Boss 50HP，4人每回合約輸出：
  //   阿典 8 + 乃蓉 8 + 萱萱 3(弱化) + 雅晴 3(盾擊) = 22/回合
  //   但要分心處理保全(14HP)+召喚兵(8HP)+陷阱(2dmg)
  //   預計 4~6 回合擊殺 Boss，剩餘回合互動保險櫃
  //   萱萱的弱化可完全消除保全傷害（4→0），是關鍵角色
  //   雅晴負責補血，每回合補 11 扛住陷阱+保全傷害
  //   10 回合限制寬鬆但不無腦，需要集火策略
  // ================================================================
  {
    id: 'chapter-4',
    title: '第四關：校長室突襲',
    gridSize: { width: 8, height: 8 },
    background: 'bg_principal_office',
    bgm: 'bgm_battle_boss',
    entities: [
      getChar('a-dian', 'player-adian', 2, 7),
      getChar('ya-qing', 'player-yaqing', 3, 7),
      getChar('nai-rong', 'player-nairong', 4, 7),
      getChar('xuan-xuan', 'player-xuanxuan', 5, 7),
      // ── Boss：白狼校長（不移動不攻擊，靠召喚+陷阱） ──
      { id: 'boss-principal', name: '白狼校長', x: 3, y: 1, hp: 50, maxHp: 50, type: 'BOSS', attack: 0 },
      // ── 初始重裝保全 ──
      { id: 'guard-01', name: '重裝保全', x: 2, y: 3, hp: 14, maxHp: 14, type: 'ENEMY', attack: 4 },
      { id: 'guard-02', name: '重裝保全', x: 5, y: 3, hp: 14, maxHp: 14, type: 'ENEMY', attack: 4 },
      // ── 辦公桌（掩體，擋在 Boss 前面） ──
      { id: 'desk-boss', name: '辦公桌', x: 3, y: 2, hp: 16, maxHp: 16, type: 'OBSTACLE' },
      // ── 書櫃（側翼掩體） ──
      { id: 'bookshelf-1', name: '書櫃', x: 0, y: 3, hp: 12, maxHp: 12, type: 'OBSTACLE' },
      { id: 'bookshelf-2', name: '書櫃', x: 7, y: 3, hp: 12, maxHp: 12, type: 'OBSTACLE' },
      // ── 保險櫃（勝利必須互動） ──
      { id: 'safe-evidence', name: '保險櫃', x: 6, y: 0, hp: 99, maxHp: 99, type: 'INTERACTABLE' },
    ],
    openingStory: [],
    missionBriefing: {
      objective: '擊敗白狼校長，並打開保險櫃取得證據',
      tips: [
        '👊 集中火力攻擊白狼校長（紫色 Boss），他不會主動移動',
        '⚠️ 校長每回合會召喚 1 名保全 + 放置地板陷阱（紅色 ! 格）',
        '📢 萱萱的「噪音干擾」可以弱化保全（攻擊歸零 1 回合）',
        '🔑 擊敗校長後，走到金色「保險櫃」旁互動取得證據',
        '💥 校長 HP 低於一半時會暴怒，攻擊力大幅提升！',
        '🛡️ 阿典的「盾牌防禦」可以減半傷害並彈開近戰攻擊者',
      ],
      failCondition: '超過 10 回合 / 阿典或雅晴陣亡 → 任務失敗',
    },
    winCondition: {
      defeatBoss: true,
      interactTargets: ['safe-evidence'],
    },
    loseCondition: {
      turnLimit: 10,
      requiredAlive: ['player-adian', 'player-yaqing'],
    },
    reinforcements: [],
  },

  // ================================================================
  // Chapter 5 — 黎明大決戰 (12×10)
  //
  // 設計理念：最終決戰。前 3 回合地獄難度（4人 vs 大軍），
  // 第 4 回合觸發 DAWN_LIGHT（全技能 +10），變成爽快掃場。
  //
  // 數值驗算（DAWN_LIGHT 前）：
  //   敵人 14HP × 8 + Boss 55HP = 167 HP
  //   4人輸出約 22/回合，3 回合 ≈ 66 傷害，殺 4~5 個小兵
  //   這 3 回合是撐住不崩的防守階段
  //
  // 數值驗算（DAWN_LIGHT 後）：
  //   阿典盾擊 6+10=16，警棍 8+10=18
  //   乃蓉球棒 8+10=18 × 3 格 = 54/回合（碾壓級）
  //   萱萱噪音 3+10=13 + 弱化
  //   Boss 55HP 約 3 回合可擊殺
  //   給玩家「全校支援後力量爆發」的爽感
  // ================================================================
  {
    id: 'chapter-5',
    title: '第五關：黎明大決戰',
    gridSize: { width: 12, height: 10 },
    background: 'bg_gate_night',
    bgm: 'bgm_dawn_rally',
    entities: [
      getChar('a-dian', 'player-adian', 5, 8),
      getChar('ya-qing', 'player-yaqing', 6, 8),
      getChar('nai-rong', 'player-nairong', 4, 8),
      getChar('xuan-xuan', 'player-xuanxuan', 7, 8),
      // ── Boss：白狼校長（會移動+攻擊的最終型態） ──
      { id: 'boss-final', name: '白狼校長', x: 5, y: 0, hp: 55, maxHp: 55, type: 'BOSS', attack: 7 },
      // ── 第一排：4 名暴徒 ──
      { id: 'e5-0', name: '赤星暴徒', x: 2, y: 2, hp: 14, maxHp: 14, type: 'ENEMY', attack: 4 },
      { id: 'e5-1', name: '赤星暴徒', x: 4, y: 2, hp: 14, maxHp: 14, type: 'ENEMY', attack: 4 },
      { id: 'e5-2', name: '赤星暴徒', x: 7, y: 2, hp: 14, maxHp: 14, type: 'ENEMY', attack: 4 },
      { id: 'e5-3', name: '赤星暴徒', x: 9, y: 2, hp: 14, maxHp: 14, type: 'ENEMY', attack: 4 },
      // ── 第二排：4 名暴徒 ──
      { id: 'e5-4', name: '赤星暴徒', x: 3, y: 3, hp: 14, maxHp: 14, type: 'ENEMY', attack: 4 },
      { id: 'e5-5', name: '赤星暴徒', x: 5, y: 3, hp: 14, maxHp: 14, type: 'ENEMY', attack: 4 },
      { id: 'e5-6', name: '赤星暴徒', x: 6, y: 3, hp: 14, maxHp: 14, type: 'ENEMY', attack: 4 },
      { id: 'e5-7', name: '赤星暴徒', x: 8, y: 3, hp: 14, maxHp: 14, type: 'ENEMY', attack: 4 },
    ],
    openingStory: [],
    missionBriefing: {
      objective: '消滅所有敵人，包括白狼校長！',
      tips: [
        '💀 前 3 回合極為困難，8 名暴徒 + Boss 同時壓境',
        '🌅 撐到第 4 回合，全校師生集結支援 → 全員獲得「黎明之光」',
        '✨ 黎明之光：所有技能傷害 +10，移動範圍大幅增加',
        '💧 地圖上有水坑（藍色格），踩上會被附加 WET 狀態',
        '🤝 友軍相鄰時攻擊 +2（鄰接羈絆），盡量靠在一起',
        '⚡ 擊殺敵人可觸發「擊殺連鎖」，獲得額外行動機會',
      ],
      failCondition: '全員陣亡 → 任務失敗（撐住就是勝利！）',
    },
    environmentTiles: [
      // Water puddles (reduce movement, apply WET)
      { x: 3, y: 5, effect: 'WATER' },
      { x: 8, y: 5, effect: 'WATER' },
      { x: 5, y: 6, effect: 'WATER' },
    ],
    winCondition: {
      defeatAll: true,
    },
  },
];
