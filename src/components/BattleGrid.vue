<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useGameStore } from '@/stores/gameStore';

const gameStore = useGameStore();

// ══════════════════════════════════════════
//  ICON MAPPING — replaces all emoji
// ══════════════════════════════════════════
const ICONS = {
  // Entity type icons
  PLAYER: 'game-icons:sword-brandish',
  ENEMY: 'game-icons:skull-crossed-bones',
  BOSS: 'game-icons:crowned-skull',
  NPC: 'game-icons:person',
  OBSTACLE: 'game-icons:brick-wall',
  INTERACTABLE: 'game-icons:magnifying-glass',
  // Skill type icons
  baton_strike: 'game-icons:bo',
  shield_wall: 'game-icons:shield-reflect',
  heal: 'game-icons:health-potion',
  command_rally: 'game-icons:rally-the-troops',
  bat_swing: 'game-icons:baseball-bat',
  home_run: 'game-icons:home-run',
  noise_jam: 'game-icons:speaker',
  panic_broadcast: 'game-icons:megaphone',
  // Action icons
  attack: 'game-icons:crossed-swords',
  investigate: 'game-icons:magnifying-glass',
  wait: 'game-icons:hourglass',
  cancel: 'game-icons:return-arrow',
  skill: 'game-icons:magic-swirl',
  // UI icons
  undo: 'game-icons:anticlockwise-rotation',
  restart: 'game-icons:cycle',
  briefing: 'game-icons:scroll-unfurled',
  settings: 'game-icons:gear-hammer',
  endTurn: 'game-icons:fast-forward-button',
  killChain: 'game-icons:lightning-helix',
  // Objective icons
  defend: 'game-icons:shield',
  escort: 'game-icons:run',
  defeatBoss: 'game-icons:fist',
  evidence: 'game-icons:key',
  defeatAll: 'game-icons:crossed-swords',
  timer: 'game-icons:sand-clock',
  // Environment
  fire: 'game-icons:fire',
  water: 'game-icons:water-drop',
  rubble: 'game-icons:stone-pile',
  alarm: 'game-icons:alarm-bell',
  exit: 'game-icons:exit-door',
  // Status
  targeting: 'game-icons:targeting',
  trap: 'game-icons:bear-trap',
  // Mission briefing
  objective: 'game-icons:archery-target',
  tips: 'game-icons:light-bulb',
  fail: 'game-icons:broken-skull',
  // BGM
  volumeOn: 'game-icons:speaker',
  volumeOff: 'game-icons:mute',
} as const;

const getSkillIcon = (skillId: string) => {
  return (ICONS as Record<string, string>)[skillId] || ICONS.skill;
};

// ══════════════════════════════════════════
//  BGM AUDIO SYSTEM
// ══════════════════════════════════════════
const bgmAudio = ref<HTMLAudioElement | null>(null);
const bgmExpanded = ref(false);

// Load saved BGM settings
onMounted(() => {
  const savedVol = localStorage.getItem('bgmVolume');
  const savedMute = localStorage.getItem('bgmMuted');
  if (savedVol !== null) gameStore.bgmVolume = parseFloat(savedVol);
  if (savedMute !== null) gameStore.bgmMuted = savedMute === 'true';
});

watch(() => gameStore.currentBgm, (newBgm) => {
  if (!bgmAudio.value) return;
  if (newBgm) {
    bgmAudio.value.src = `/assets/bgm/${newBgm}.ogg`;
    bgmAudio.value.volume = gameStore.bgmMuted ? 0 : gameStore.bgmVolume;
    bgmAudio.value.play().catch(() => {});
  } else {
    bgmAudio.value.pause();
  }
});

watch(() => gameStore.bgmVolume, (vol) => {
  if (bgmAudio.value && !gameStore.bgmMuted) bgmAudio.value.volume = vol;
  localStorage.setItem('bgmVolume', String(vol));
});

watch(() => gameStore.bgmMuted, (muted) => {
  if (bgmAudio.value) bgmAudio.value.volume = muted ? 0 : gameStore.bgmVolume;
  localStorage.setItem('bgmMuted', String(muted));
});

const toggleBgmMute = () => { gameStore.bgmMuted = !gameStore.bgmMuted; };

// ══════════════════════════════════════════
//  KEYBOARD SHORTCUTS
// ══════════════════════════════════════════
const onKeyDown = (e: KeyboardEvent) => {
  if (gameStore.gameState !== 'PLAYING') return;
  if (e.key === 'Tab') {
    e.preventDefault();
    gameStore.showMissionBriefing = !gameStore.showMissionBriefing;
  }
  if (e.key === 'Escape') {
    if (gameStore.showMissionBriefing) {
      gameStore.showMissionBriefing = false;
    } else if (gameStore.unitActionPhase === 'TARGETING') {
      gameStore.selectedSkill = null;
      gameStore.targetingTiles = [];
      gameStore.unitActionPhase = 'ACTION_SELECT';
    } else if (gameStore.unitActionPhase === 'ACTION_SELECT') {
      gameStore.cancelMove();
    } else if (gameStore.selectedEntityId) {
      gameStore.selectEntity(null);
    }
  }
};

// ══════════════════════════════════════════
//  VIEWPORT & CELL SIZING
// ══════════════════════════════════════════
const viewportW = ref(window.innerWidth);
const viewportH = ref(window.innerHeight);
const onResize = () => { viewportW.value = window.innerWidth; viewportH.value = window.innerHeight; };

onMounted(() => {
  window.addEventListener('resize', onResize);
  window.addEventListener('keydown', onKeyDown);
});
onUnmounted(() => {
  window.removeEventListener('resize', onResize);
  window.removeEventListener('keydown', onKeyDown);
});

const CELL_GAP = 2;
const SIDE_PANEL_W = 220; // width reserved for each side panel

const cellSize = computed(() => {
  const gw = gameStore.gridSize.width;
  const gh = gameStore.gridSize.height;
  // Reserve space for side panels + padding
  const availW = viewportW.value - SIDE_PANEL_W * 2 - 48;
  const availH = viewportH.value - 80; // top bar + bottom margin
  const maxByW = Math.floor((availW - (gw - 1) * CELL_GAP) / gw);
  const maxByH = Math.floor((availH - (gh - 1) * CELL_GAP) / gh);
  return Math.max(40, Math.min(90, maxByW, maxByH));
});

const entitySize = computed(() => Math.max(28, cellSize.value - 6));
const entityOffset = computed(() => Math.floor((cellSize.value - entitySize.value) / 2) + 1);
const gridPixelW = computed(() => gameStore.gridSize.width * cellSize.value + (gameStore.gridSize.width - 1) * CELL_GAP + 12);
const gridPixelH = computed(() => gameStore.gridSize.height * cellSize.value + (gameStore.gridSize.height - 1) * CELL_GAP + 12);

// ══════════════════════════════════════════
//  COMPUTED HELPERS
// ══════════════════════════════════════════
const selectedEntity = computed(() => gameStore.entities.find(e => e.id === gameStore.selectedEntityId));
const inspectedEntity = computed(() => gameStore.inspectedEntityId ? gameStore.entities.find(e => e.id === gameStore.inspectedEntityId) : null);
/** Entity to show in left info panel: inspected > selected */
const displayEntity = computed(() => inspectedEntity.value || selectedEntity.value);
const allPlayersActed = computed(() => gameStore.entities.filter(e => e.type === 'PLAYER').every(p => p.hasActed));
const adjacentEnemies = computed(() => gameStore.getAdjacentEnemies());
const adjacentInteractables = computed(() => gameStore.getAdjacentInteractables());

const isMovableTile = (x: number, y: number) => {
  const source = selectedEntity.value;
  if (!source || source.type !== 'PLAYER' || source.hasActed) return false;
  if (gameStore.unitActionPhase !== 'MOVING') return false;
  const moveRange = (source.status && source.status.includes('DAWN_LIGHT')) ? 8 : 3;
  const dist = Math.abs(source.position.x - x) + Math.abs(source.position.y - y);
  return dist <= moveRange && !gameStore.getEntityAt(x, y);
};

const isTargetingTile = (x: number, y: number) => gameStore.targetingTiles.some(t => t.x === x && t.y === y);
const isTrapTile = (x: number, y: number) => gameStore.trapTiles.some(t => t.x === x && t.y === y);
const getEnvironmentTile = (x: number, y: number) => gameStore.environmentTiles.find(t => t.x === x && t.y === y);
const getIntentAt = (x: number, y: number) => gameStore.enemyIntents.find(i => i.targetPos?.x === x && i.targetPos?.y === y && i.action === 'attack');
const getEntityAt = (x: number, y: number) => gameStore.getEntityAt(x, y);

const hasAdjacentAlly = (entity: any) => {
  if (entity.type !== 'PLAYER') return false;
  return gameStore.entities.some(e =>
    e.type === 'PLAYER' && e.id !== entity.id &&
    Math.abs(e.position.x - entity.position.x) + Math.abs(e.position.y - entity.position.y) <= 1
  );
};

const isBreachLineRow = (y: number) => gameStore.currentLevel?.loseCondition?.breachLine?.y === y;
const isEscortExitRow = (y: number) => {
  const level = gameStore.currentLevel;
  return !!(level?.winCondition.escortExit && y >= level.winCondition.escortExit.y);
};

const breachCount = computed(() => {
  const level = gameStore.currentLevel;
  if (!level?.loseCondition?.breachLine) return 0;
  return gameStore.entities.filter(e =>
    (e.type === 'ENEMY' || e.type === 'BOSS') &&
    e.position.y >= level.loseCondition!.breachLine!.y,
  ).length;
});

const interactProgress = computed(() => {
  const targets = gameStore.currentLevel?.winCondition.interactTargets || [];
  const done = targets.filter(t => gameStore.interactedTargets.includes(t)).length;
  return `${done}/${targets.length}`;
});

const isCharacterEntity = (type: string) => type === 'PLAYER' || type === 'ENEMY' || type === 'BOSS' || type === 'NPC';

const getPortraitId = (entity: any): string | null => {
  const map: Record<string, string> = {
    'player-adian': 'a_dian',
    'player-yaqing': 'ya_qing',
    'player-nairong': 'nai_rong',
    'player-xuanxuan': 'xuan_xuan',
    'npc-xuanxuan': 'xuan_xuan',
  };
  return map[entity.id] || null;
};

// ══════════════════════════════════════════
//  ENTITY VISUAL SYSTEM
// ══════════════════════════════════════════
interface EntityVisualStyle {
  border: string; bg: string; glow: string; icon: string; borderCss: string;
  hpBarColor: string; hpBarBg: string;
}

const ENTITY_STYLES: Record<string, EntityVisualStyle> = {
  PLAYER:       { border: 'border-sky-400',     bg: 'bg-sky-900/90',      glow: '0 4px 14px rgba(56,189,248,0.4)',  icon: ICONS.PLAYER,  borderCss: 'border-2',              hpBarColor: '#38bdf8', hpBarBg: '#0c4a6e' },
  ENEMY:        { border: 'border-red-500',     bg: 'bg-red-950/90',      glow: '0 4px 12px rgba(239,68,68,0.4)',   icon: ICONS.ENEMY,   borderCss: 'border-2',              hpBarColor: '#ef4444', hpBarBg: '#450a0a' },
  BOSS:         { border: 'border-fuchsia-400', bg: 'bg-fuchsia-950/90',  glow: '0 4px 16px rgba(192,38,211,0.5)',  icon: ICONS.BOSS,    borderCss: 'border-[3px]',          hpBarColor: '#c026d3', hpBarBg: '#4a044e' },
  NPC:          { border: 'border-teal-400',    bg: 'bg-teal-900/90',     glow: '0 4px 12px rgba(45,212,191,0.3)',  icon: ICONS.NPC,     borderCss: 'border-2',              hpBarColor: '#2dd4bf', hpBarBg: '#042f2e' },
  OBSTACLE:     { border: 'border-stone-500',   bg: 'bg-stone-800/90',    glow: '0 3px 6px rgba(0,0,0,0.4)',       icon: ICONS.OBSTACLE, borderCss: 'border-2 border-dashed', hpBarColor: '#78716c', hpBarBg: '#292524' },
  INTERACTABLE: { border: 'border-amber-400',   bg: 'bg-amber-950/90',    glow: '0 4px 14px rgba(251,191,36,0.4)', icon: ICONS.INTERACTABLE, borderCss: 'border-2 border-double', hpBarColor: '#fbbf24', hpBarBg: '#451a03' },
};

const DEFAULT_STYLE = ENTITY_STYLES['OBSTACLE']!;
const getStyle = (entity: any) => ENTITY_STYLES[entity.type as string] ?? DEFAULT_STYLE;

/** HP bar gradient: green → yellow → red based on ratio */
const getHpGradient = (entity: any) => {
  const ratio = entity.hp / entity.maxHp;
  if (entity.type === 'ENEMY' || entity.type === 'BOSS') {
    if (ratio > 0.5) return 'linear-gradient(90deg, #dc2626, #ef4444)';
    if (ratio > 0.25) return 'linear-gradient(90deg, #b91c1c, #dc2626)';
    return 'linear-gradient(90deg, #7f1d1d, #991b1b)';
  }
  if (ratio > 0.6) return 'linear-gradient(90deg, #16a34a, #22c55e)';
  if (ratio > 0.3) return 'linear-gradient(90deg, #ca8a04, #eab308)';
  return 'linear-gradient(90deg, #dc2626, #ef4444)';
};

const getHpTextColor = (entity: any) => {
  const ratio = entity.hp / entity.maxHp;
  if (entity.type === 'ENEMY' || entity.type === 'BOSS') return '#fca5a5';
  if (ratio > 0.6) return '#86efac';
  if (ratio > 0.3) return '#fde047';
  return '#fca5a5';
};

// Map theme based on level background
const mapThemeClass = computed(() => {
  const bg = gameStore.currentBackground;
  if (bg.includes('corridor') || bg.includes('west')) return 'map-corridor';
  if (bg.includes('control')) return 'map-tech';
  if (bg.includes('hall')) return 'map-hall';
  if (bg.includes('office') || bg.includes('principal')) return 'map-office';
  if (bg.includes('gate') || bg.includes('night')) return 'map-night';
  return 'map-default';
});

const getAnimClass = (entity: any) => {
  if (gameStore.animAttackerId === entity.id) return 'anim-lunge';
  if (gameStore.animHitIds.includes(entity.id)) return 'anim-hit';
  if (entity.type === 'PLAYER' && entity.hasActed) return '';
  if (entity.type === 'INTERACTABLE') return 'anim-interact-pulse';
  if (isCharacterEntity(entity.type)) return 'anim-float';
  return '';
};

const getLungeVars = (entity: any) => {
  if (gameStore.animAttackerId === entity.id && gameStore.animAttackDir) {
    return { '--lunge-x': `${gameStore.animAttackDir.x * 14}px`, '--lunge-y': `${gameStore.animAttackDir.y * 14}px` };
  }
  return {};
};

const ENV_ICONS: Record<string, string> = { FIRE: ICONS.fire, WATER: ICONS.water, RUBBLE: ICONS.rubble, ALARM: ICONS.alarm, EXIT: ICONS.exit };

// ══════════════════════════════════════════
//  STATE MACHINE — handleCellClick
// ══════════════════════════════════════════
const handleCellClick = async (x: number, y: number) => {
  if (gameStore.currentTurn !== 'PLAYER' || gameStore.isProcessingTurn ||
    gameStore.isAnimatingMove || gameStore.gameState !== 'PLAYING') return;

  const phase = gameStore.unitActionPhase;

  // TARGETING: confirm target
  if (phase === 'TARGETING') {
    if (isTargetingTile(x, y)) {
      if (gameStore.selectedSkill) {
        gameStore.executeSkill({ x, y });
      } else {
        gameStore.executePushAttack({ x, y });
      }
    } else {
      gameStore.selectedSkill = null;
      gameStore.targetingTiles = [];
      gameStore.unitActionPhase = 'ACTION_SELECT';
    }
    return;
  }

  // ACTION_SELECT: cancel on grid click
  if (phase === 'ACTION_SELECT') {
    const entity = getEntityAt(x, y);
    if (!entity || entity.id !== gameStore.selectedEntityId) {
      gameStore.cancelMove();
    }
    return;
  }

  // MOVING: move or select
  if (phase === 'MOVING') {
    const source = selectedEntity.value;
    if (!source) { gameStore.selectEntity(null); return; }
    const entity = getEntityAt(x, y);

    if (entity && entity.id === source.id) { gameStore.inspectedEntityId = null; gameStore.selectEntity(null); return; }
    if (entity && entity.type === 'PLAYER' && !entity.hasActed) { gameStore.inspectedEntityId = null; gameStore.selectEntity(entity.id); return; }

    if (!entity && isMovableTile(x, y)) {
      gameStore.saveSnapshot();
      gameStore.preMovementPosition = { ...source.position };
      await gameStore.animateMoveTo(source.id, x, y);
      gameStore.unitActionPhase = 'ACTION_SELECT';
      return;
    }

    if (!entity) { gameStore.selectEntity(null); return; }

    const dist = Math.abs(source.position.x - x) + Math.abs(source.position.y - y);
    if (dist === 1 && (entity.type === 'ENEMY' || entity.type === 'BOSS' || entity.type === 'OBSTACLE' || entity.type === 'INTERACTABLE')) {
      gameStore.saveSnapshot();
      gameStore.preMovementPosition = { ...source.position };
      gameStore.unitActionPhase = 'ACTION_SELECT';
      return;
    }

    gameStore.selectEntity(null);
    return;
  }

  // IDLE: select player or inspect other entity
  const entity = getEntityAt(x, y);
  if (entity && entity.type === 'PLAYER' && !entity.hasActed) {
    gameStore.inspectedEntityId = null;
    gameStore.selectEntity(entity.id);
  } else if (entity) {
    // Inspect non-player entity (enemy, obstacle, interactable, etc.)
    gameStore.inspectedEntityId = entity.id;
  } else {
    // Click empty: clear inspection
    gameStore.inspectedEntityId = null;
  }
};

// ── Action handlers ──
const handleWait = () => { const s = selectedEntity.value; if (s) gameStore.markActionDone(s.id); };
const handlePushAttack = () => { gameStore.enterAttackTargeting(); };
const handleSkillSelect = (skill: any) => { gameStore.selectSkill(skill); };
const handleCancelAction = () => { gameStore.cancelMove(); };
const handleInteract = (entityId: string) => { gameStore.interactWithEntity(entityId); };
const handleEndTurn = () => {
  if (gameStore.currentTurn === 'PLAYER' && !gameStore.isProcessingTurn && gameStore.gameState === 'PLAYING')
    gameStore.endPlayerTurn();
};
const handleUndo = () => { gameStore.undo(); };
const restartGame = () => { gameStore.restartBattle(); };
</script>

<template>
  <div class="fixed inset-0 text-slate-100 overflow-hidden select-none"
    style="background: var(--color-bg-primary);">

    <!-- ═══ TOP BAR ═══ -->
    <div class="absolute top-0 left-0 right-0 z-30 h-14 flex items-center justify-between px-4 border-b"
      style="background: linear-gradient(180deg, rgba(17,24,39,0.95) 0%, rgba(10,14,26,0.9) 100%); border-color: var(--color-border-panel);">

      <!-- Left: Level info -->
      <div class="flex items-center gap-3">
        <div class="font-ui text-lg font-bold tracking-tight"
          :class="gameStore.currentTurn === 'PLAYER' ? 'text-sky-400' : 'text-red-400'"
        >
          <span v-if="gameStore.currentTurn === 'PLAYER'">我方回合</span>
          <span v-else class="animate-pulse">敵方回合</span>
        </div>
        <div class="w-px h-6 bg-slate-700"></div>
        <span class="font-ui text-sm text-slate-500 font-semibold">
          {{ gameStore.currentLevel?.title }} &mdash; 第 {{ gameStore.turnNumber }} 回合
        </span>
        <div v-if="gameStore.killChainActive" class="flex items-center gap-1 text-yellow-400 animate-pulse">
          <Icon :icon="ICONS.killChain" class="w-4 h-4" />
          <span class="font-ui text-xs font-bold">擊殺連鎖!</span>
        </div>
      </div>

      <!-- Center: Objective -->
      <div class="flex items-center gap-2 text-sm font-semibold">
        <template v-if="gameStore.currentLevel?.winCondition.surviveTurns">
          <Icon :icon="ICONS.defend" class="w-4 h-4 text-sky-400" />
          <span class="text-slate-300">
            防守：撐過 {{ gameStore.turnNumber }}/{{ gameStore.currentLevel.winCondition.surviveTurns }} 回合
          </span>
          <span v-if="gameStore.currentLevel.loseCondition?.breachLine" class="text-red-400 ml-2">
            突破數：{{ breachCount }}/{{ gameStore.currentLevel.loseCondition.breachLine.maxBreaches }}
          </span>
        </template>
        <template v-else-if="gameStore.currentLevel?.winCondition.escortCount">
          <Icon :icon="ICONS.escort" class="w-4 h-4 text-emerald-400" />
          <span class="text-emerald-300">護送撤離：{{ gameStore.evacuatedCount }}/{{ gameStore.currentLevel.winCondition.escortCount }}</span>
        </template>
        <template v-else-if="gameStore.currentLevel?.winCondition.defeatBoss">
          <Icon :icon="ICONS.defeatBoss" class="w-4 h-4 text-fuchsia-400" />
          <span class="text-slate-300">擊敗首領</span>
          <span v-if="gameStore.currentLevel.winCondition.interactTargets" class="text-amber-400 ml-1">
            <Icon :icon="ICONS.evidence" class="w-3.5 h-3.5 inline" /> {{ interactProgress }}
          </span>
        </template>
        <template v-else-if="gameStore.currentLevel?.winCondition.defeatAll">
          <Icon :icon="ICONS.defeatAll" class="w-4 h-4 text-red-400" />
          <span class="text-slate-300">殲滅所有敵人</span>
          <span v-if="gameStore.currentLevel.winCondition.interactTargets" class="text-amber-400 ml-1">
            {{ interactProgress }}
          </span>
        </template>
        <span v-if="gameStore.currentLevel?.loseCondition?.turnLimit" class="text-orange-400 ml-2">
          <Icon :icon="ICONS.timer" class="w-3.5 h-3.5 inline" />
          {{ gameStore.turnNumber }}/{{ gameStore.currentLevel.loseCondition.turnLimit }}
        </span>
      </div>

      <!-- Right: Buttons -->
      <div class="flex items-center gap-2">
        <button @click="handleUndo" :disabled="gameStore.history.length === 0 || gameStore.currentTurn !== 'PLAYER' || gameStore.gameState !== 'PLAYING'"
          class="game-btn flex items-center gap-1.5 text-xs py-1.5 px-3">
          <Icon :icon="ICONS.undo" class="w-3.5 h-3.5" />
          <span class="font-ui">撤銷 ({{ gameStore.history.length }})</span>
        </button>
        <button @click="restartGame" class="game-btn flex items-center gap-1.5 text-xs py-1.5 px-3">
          <Icon :icon="ICONS.restart" class="w-3.5 h-3.5" />
          <span class="font-ui">重新開始</span>
        </button>
        <button v-if="gameStore.currentLevel?.missionBriefing && !gameStore.showMissionBriefing"
          @click="gameStore.showMissionBriefing = true"
          class="game-btn flex items-center gap-1.5 text-xs py-1.5 px-3 !border-sky-600/50 !text-sky-400">
          <Icon :icon="ICONS.briefing" class="w-3.5 h-3.5" />
          <span class="font-ui">作戰簡報</span>
        </button>
      </div>
    </div>

    <!-- ═══ MAIN LAYOUT: Left Panel | Grid | Right Panel ═══ -->
    <div class="absolute top-14 bottom-0 left-0 right-0 flex">

      <!-- ═══ LEFT PANEL — Character Info ═══ -->
      <div class="flex-shrink-0 flex flex-col justify-center p-3" :style="{ width: `${SIDE_PANEL_W}px` }">
        <Transition name="slide-up">
          <div v-if="displayEntity" :key="displayEntity.id" class="game-panel p-0 overflow-hidden"
            :class="displayEntity.type === 'PLAYER' ? 'game-panel-accent' : ''">
            <!-- Header with type icon -->
            <div class="px-4 py-3 border-b flex items-center gap-2"
              :style="{ borderColor: 'var(--color-border-panel)', background: 'rgba(0,0,0,0.3)' }">
              <div class="w-8 h-8 rounded-md flex items-center justify-center"
                :style="{ background: getStyle(displayEntity).hpBarBg, border: `1px solid ${getStyle(displayEntity).hpBarColor}` }">
                <Icon :icon="getStyle(displayEntity).icon" class="w-5 h-5" :style="{ color: getStyle(displayEntity).hpBarColor }" />
              </div>
              <div>
                <div class="font-ui font-bold text-base leading-tight" :style="{ color: getStyle(displayEntity).hpBarColor }">
                  {{ displayEntity.name }}
                </div>
                <div class="text-[10px] text-slate-500 font-ui font-semibold tracking-wider uppercase">
                  {{ { PLAYER: '我方單位', ENEMY: '敵方單位', BOSS: '首領', NPC: '友軍', OBSTACLE: '障礙物', INTERACTABLE: '可互動' }[displayEntity.type] || displayEntity.type }}
                </div>
              </div>
            </div>

            <!-- Portrait Area -->
            <div class="mx-4 mt-3 h-24 rounded-md overflow-hidden border"
              style="border-color: var(--color-border-panel);"
              :style="{
                backgroundImage: getPortraitId(displayEntity) ? `url(/assets/characters/char_${getPortraitId(displayEntity)}_normal.png)` : 'none',
                backgroundSize: 'cover', backgroundPosition: 'center top',
                backgroundColor: 'rgba(15,23,42,0.8)',
              }">
              <div v-if="!getPortraitId(displayEntity)" class="w-full h-full flex items-center justify-center">
                <Icon :icon="getStyle(displayEntity).icon" class="w-12 h-12 text-slate-700" />
              </div>
            </div>

            <!-- Stats -->
            <div class="px-4 py-3">
              <!-- HP Bar -->
              <div class="mb-3">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-ui text-[11px] font-bold text-slate-500 tracking-wider">HP</span>
                  <span class="font-ui text-sm font-bold" :style="{ color: getHpTextColor(displayEntity) }">
                    {{ displayEntity.hp }} / {{ displayEntity.maxHp }}
                  </span>
                </div>
                <div class="w-full h-3 rounded-sm overflow-hidden" style="background: rgba(15,23,42,0.8); border: 1px solid var(--color-border-panel);">
                  <div class="h-full rounded-sm transition-all duration-500 hp-bar-fill"
                    :class="{ 'hp-flash': gameStore.animHitIds.includes(displayEntity.id) }"
                    :style="{ width: `${(displayEntity.hp / displayEntity.maxHp) * 100}%`, background: getHpGradient(displayEntity) }">
                  </div>
                </div>
              </div>

              <!-- ATK / DEF -->
              <div v-if="displayEntity.attack || (displayEntity as any).def" class="grid grid-cols-2 gap-2 mb-3">
                <div class="text-center rounded-md py-1.5" style="background: rgba(15,23,42,0.6); border: 1px solid var(--color-border-panel);">
                  <div class="font-ui text-[9px] text-slate-600 font-bold tracking-widest">ATK</div>
                  <div class="font-ui text-lg font-bold text-red-400">{{ displayEntity.attack || 0 }}</div>
                </div>
                <div class="text-center rounded-md py-1.5" style="background: rgba(15,23,42,0.6); border: 1px solid var(--color-border-panel);">
                  <div class="font-ui text-[9px] text-slate-600 font-bold tracking-widest">DEF</div>
                  <div class="font-ui text-lg font-bold text-sky-400">{{ (displayEntity as any).def || 0 }}</div>
                </div>
              </div>

              <!-- Enemy intent preview -->
              <div v-if="displayEntity.intent" class="mb-3 rounded-md px-3 py-2"
                style="background: rgba(127,29,29,0.2); border: 1px solid rgba(239,68,68,0.2);">
                <div class="font-ui text-[10px] text-red-400 font-bold tracking-wider mb-0.5">下一步行動</div>
                <div class="font-ui text-sm text-red-300">
                  {{ { attack: '攻擊', move: '移動', summon: '召喚', buff: '強化' }[displayEntity.intent] || displayEntity.intent }}
                </div>
              </div>

              <!-- Status Effects -->
              <div v-if="displayEntity.status && displayEntity.status.length > 0" class="flex gap-1.5 flex-wrap mb-3">
                <div v-for="s in displayEntity.status" :key="s"
                  class="text-[9px] px-2 py-1 rounded font-ui font-bold tracking-wide"
                  :class="{
                    'bg-yellow-950 text-yellow-400 border border-yellow-700': s === 'DAWN_LIGHT',
                    'bg-amber-950 text-amber-400 border border-amber-700': s === 'GUARDING',
                    'bg-green-950 text-green-400 border border-green-700': s === 'RALLIED',
                    'bg-red-950 text-red-400 border border-red-700': s === 'ENRAGED',
                    'bg-blue-950 text-blue-400 border border-blue-700': s === 'WET',
                    'bg-orange-950 text-orange-400 border border-orange-700': s === 'WEAKENED',
                    'bg-slate-800 text-slate-500 border border-slate-700': s === 'NORMAL' || s === 'STUN' || s === 'ARMOR_BREAK',
                  }"
                >{{ { DAWN_LIGHT: '曙光', GUARDING: '防禦', RALLIED: '激勵', ENRAGED: '狂暴', WET: '潮濕', WEAKENED: '弱化', STUN: '暈眩', ARMOR_BREAK: '破甲', NORMAL: '正常' }[s] || s }}</div>
              </div>

              <!-- Phase indicator (only for selected player) -->
              <div v-if="selectedEntity && displayEntity.id === selectedEntity.id && gameStore.unitActionPhase !== 'IDLE'"
                class="font-ui text-[10px] font-bold tracking-widest uppercase"
                :class="{
                  'text-sky-400': gameStore.unitActionPhase === 'MOVING',
                  'text-yellow-400': gameStore.unitActionPhase === 'ACTION_SELECT',
                  'text-red-400': gameStore.unitActionPhase === 'TARGETING',
                }">
                {{ { IDLE: '', MOVING: '選擇移動目標', ACTION_SELECT: '選擇行動', TARGETING: '選擇目標' }[gameStore.unitActionPhase] }}
              </div>
            </div>
          </div>
        </Transition>

        <!-- BGM Control -->
        <div class="mt-3">
          <div class="game-panel flex items-center gap-1 px-2 py-1.5"
            @mouseenter="bgmExpanded = true" @mouseleave="bgmExpanded = false">
            <button @click="toggleBgmMute"
              class="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-800 transition-colors"
              :class="gameStore.bgmMuted ? 'text-slate-600' : 'text-sky-400'">
              <Icon :icon="gameStore.bgmMuted ? ICONS.volumeOff : ICONS.volumeOn" class="w-4 h-4" />
            </button>
            <Transition name="slide-right">
              <div v-if="bgmExpanded" class="flex items-center gap-2 pl-1">
                <input type="range" min="0" max="1" step="0.05"
                  :value="gameStore.bgmVolume"
                  @input="gameStore.bgmVolume = parseFloat(($event.target as HTMLInputElement).value)"
                  class="w-20 h-1 accent-sky-500 cursor-pointer" />
                <span class="font-ui text-[10px] text-slate-600 font-bold w-8">{{ Math.round(gameStore.bgmVolume * 100) }}%</span>
              </div>
            </Transition>
          </div>
        </div>
      </div>

      <!-- ═══ CENTER — Battle Grid ═══ -->
      <div class="flex-1 flex items-center justify-center min-w-0">
        <div
          class="relative overflow-hidden transition-transform duration-100 map-container"
          :class="[{ 'animate-shake': gameStore.isShaking }, mapThemeClass]"
          style="border-radius: 4px;"
          :style="{ width: `${gridPixelW}px`, height: `${gridPixelH}px`, padding: '5px' }"
        >
          <!-- Grid Cells -->
          <div class="grid"
            :style="{
              gridTemplateColumns: `repeat(${gameStore.gridSize.width}, ${cellSize}px)`,
              gridTemplateRows: `repeat(${gameStore.gridSize.height}, ${cellSize}px)`,
              gap: `${CELL_GAP}px`,
            }"
          >
            <template v-for="y in gameStore.gridSize.height" :key="`row-${y}`">
              <template v-for="x in gameStore.gridSize.width" :key="`cell-${x-1}-${y-1}`">
                <div
                  class="grid-cell relative"
                  :style="{ width: `${cellSize}px`, height: `${cellSize}px` }"
                  :class="[
                    gameStore.currentTurn === 'PLAYER' && !gameStore.isProcessingTurn && gameStore.gameState === 'PLAYING'
                      ? 'cursor-pointer' : 'cursor-not-allowed',
                    isMovableTile(x-1, y-1) ? 'movable-tile' : '',
                    isBreachLineRow(y-1) ? 'breach-line' : '',
                    isEscortExitRow(y-1) ? 'escort-zone' : '',
                  ]"
                  @click="handleCellClick(x-1, y-1)"
                >
                  <!-- Targeting -->
                  <div v-if="isTargetingTile(x-1, y-1)" class="absolute inset-0 targeting-tile z-0"></div>
                  <!-- Trap -->
                  <div v-if="isTrapTile(x-1, y-1)" class="absolute inset-0 trap-tile z-0">
                    <Icon :icon="ICONS.trap" class="absolute inset-0 m-auto text-red-500/50" :style="{ width: `${cellSize * 0.4}px`, height: `${cellSize * 0.4}px` }" />
                  </div>
                  <!-- Environment Tile -->
                  <div v-if="getEnvironmentTile(x-1, y-1)"
                    class="absolute inset-0 z-0 env-tile"
                    :class="`env-${getEnvironmentTile(x-1, y-1)!.effect.toLowerCase()}`">
                    <Icon :icon="ENV_ICONS[getEnvironmentTile(x-1, y-1)!.effect] || ''" class="absolute inset-0 m-auto opacity-60"
                      :style="{ width: `${cellSize * 0.4}px`, height: `${cellSize * 0.4}px` }" />
                  </div>
                  <!-- Enemy Intent -->
                  <div v-if="getIntentAt(x-1, y-1)" class="absolute inset-0 z-0 intent-tile">
                    <span class="absolute top-0 right-0.5 font-ui font-bold text-red-400" :style="{ fontSize: `${cellSize * 0.2}px` }">
                      {{ getIntentAt(x-1, y-1)!.damage }}
                    </span>
                  </div>
                </div>
              </template>
            </template>
          </div>

          <!-- Entity Layer -->
          <div v-for="entity in gameStore.entities" :key="entity.id"
            class="absolute flex flex-col items-center justify-center font-bold overflow-hidden select-none"
            :class="[
              isCharacterEntity(entity.type) ? 'rounded-full' : 'rounded-lg',
              getStyle(entity).border, getStyle(entity).bg, getStyle(entity).borderCss,
              getAnimClass(entity),
              entity.type === 'PLAYER' && entity.hasActed ? 'grayscale opacity-40' : '',
              gameStore.selectedEntityId === entity.id ? 'ring-2 ring-sky-300 z-20 selected-pulse' : 'z-10',
              entity.type === 'PLAYER' && entity.status?.includes('DAWN_LIGHT') ? 'ring-2 ring-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.7)]' : '',
              hasAdjacentAlly(entity) ? 'ring-1 ring-cyan-400/50' : '',
              entity.status?.includes('GUARDING') ? 'ring-2 ring-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]' : '',
              entity.status?.includes('RALLIED') ? 'ring-2 ring-green-400 shadow-[0_0_12px_rgba(34,197,94,0.5)]' : '',
              entity.status?.includes('ENRAGED') ? 'ring-2 ring-red-600 shadow-[0_0_16px_rgba(220,38,38,0.7)]' : '',
              gameStore.currentTurn === 'PLAYER' && !gameStore.isProcessingTurn && gameStore.gameState === 'PLAYING' && !(entity.type === 'PLAYER' && entity.hasActed)
                ? 'cursor-pointer' : 'cursor-not-allowed',
            ]"
            :style="{
              width: `${entitySize}px`, height: `${entitySize}px`,
              left: `${entity.position.x * (cellSize + CELL_GAP) + entityOffset + 1}px`,
              top: `${entity.position.y * (cellSize + CELL_GAP) + entityOffset + 1}px`,
              boxShadow: getStyle(entity).glow,
              transition: 'left 0.15s ease-out, top 0.15s ease-out',
              backgroundImage: getPortraitId(entity) ? `url(/assets/characters/char_${getPortraitId(entity)}_normal.png)` : 'none',
              backgroundSize: 'cover', backgroundPosition: 'center',
              ...getLungeVars(entity),
            }"
            @click.stop="handleCellClick(entity.position.x, entity.position.y)"
          >
            <!-- Type icon (no portrait) -->
            <Icon v-if="!getPortraitId(entity)" :icon="getStyle(entity).icon"
              class="opacity-70" :style="{ width: `${entitySize * 0.35}px`, height: `${entitySize * 0.35}px`, color: getStyle(entity).hpBarColor }" />
            <!-- HP number on ALL entities -->
            <span class="absolute font-ui font-bold"
              :style="{
                fontSize: `${Math.max(9, entitySize * 0.18)}px`,
                textShadow: '0 1px 3px rgba(0,0,0,1), 0 0 6px rgba(0,0,0,0.8)',
                bottom: getPortraitId(entity) ? '1px' : 'auto',
                top: getPortraitId(entity) ? 'auto' : `${entitySize * 0.6}px`,
                color: getStyle(entity).hpBarColor,
              }"
            >{{ entity.hp }}</span>

            <!-- HP Bar below entity -->
            <div class="absolute left-1/2 -translate-x-1/2 z-10"
              :style="{ width: `${entitySize + 4}px`, bottom: `-${Math.max(5, entitySize * 0.08)}px` }">
              <div class="w-full rounded-sm overflow-hidden"
                :style="{ height: `${Math.max(4, entitySize * 0.06)}px` }"
                style="background: rgba(0,0,0,0.8); border: 1px solid rgba(255,255,255,0.1);">
                <div class="h-full transition-all duration-500 hp-bar-fill"
                  :class="{ 'hp-flash': gameStore.animHitIds.includes(entity.id) }"
                  :style="{ width: `${(entity.hp / entity.maxHp) * 100}%`, background: getHpGradient(entity) }">
                </div>
              </div>
            </div>
          </div>

          <!-- Skill Cast Effect Layer -->
          <template v-if="gameStore.skillEffect">
            <div v-for="(tile, i) in gameStore.skillEffect.tiles" :key="`fx-${i}`"
              class="absolute pointer-events-none z-25"
              :class="`skill-fx-${gameStore.skillEffect.type}`"
              :style="{
                left: `${tile.x * (cellSize + CELL_GAP)}px`,
                top: `${tile.y * (cellSize + CELL_GAP)}px`,
                width: `${cellSize}px`,
                height: `${cellSize}px`,
              }">
            </div>
          </template>

          <!-- Damage Text Layer -->
          <div v-for="dt in gameStore.damageTexts" :key="dt.id"
            class="absolute z-30 pointer-events-none damage-text"
            :class="[dt.isHeal ? 'damage-heal' : dt.isCrit ? 'damage-crit' : 'damage-normal']"
            :style="{
              fontSize: dt.isCrit ? `${cellSize * 0.6}px` : `${cellSize * 0.45}px`,
              left: `${dt.x * (cellSize + CELL_GAP) + cellSize * 0.3 + dt.offsetX}px`,
              top: `${dt.y * (cellSize + CELL_GAP) - cellSize * 0.1}px`,
              animationDelay: `${dt.delay}ms`, animationDuration: '1.2s',
              '--spread-x': `${dt.offsetX * 0.3}px`,
            }">
            <span class="damage-number font-ui font-bold">
              {{ dt.isHeal ? `+${Math.abs(dt.damage)}` : `-${dt.damage}` }}
            </span>
          </div>

          <!-- Kill Reward Text Layer -->
          <div v-for="rt in gameStore.rewardTexts" :key="rt.id"
            class="absolute z-40 pointer-events-none reward-text"
            :class="`reward-${rt.type}`"
            :style="{
              fontSize: rt.type === 'chain' ? `${cellSize * 0.4}px` : rt.type === 'bonus' ? `${cellSize * 0.45}px` : `${cellSize * 0.35}px`,
              left: `${rt.x * (cellSize + CELL_GAP) + cellSize * 0.5}px`,
              top: `${rt.y * (cellSize + CELL_GAP)}px`,
              animationDelay: `${rt.delay}ms`,
            }">
            <span class="reward-label font-ui font-bold whitespace-nowrap">
              {{ rt.text }}
            </span>
          </div>
        </div>
      </div>

      <!-- ═══ RIGHT PANEL — Skills / Actions ═══ -->
      <div class="flex-shrink-0 flex flex-col justify-center p-3" :style="{ width: `${SIDE_PANEL_W}px` }">

        <!-- Skill Panel (visible when unit selected & ACTION_SELECT or MOVING) -->
        <Transition name="slide-up">
          <div v-if="selectedEntity && !selectedEntity.hasActed && gameStore.gameState === 'PLAYING'"
            class="game-panel p-0 overflow-hidden">

            <!-- Skills Header -->
            <div class="px-4 py-2 border-b flex items-center gap-2"
              style="border-color: var(--color-border-panel); background: rgba(0,0,0,0.3);">
              <Icon :icon="ICONS.skill" class="w-4 h-4 text-sky-500" />
              <span class="font-ui text-sm font-bold text-slate-400 tracking-wider">技能</span>
            </div>

            <!-- Skill List -->
            <div class="p-2 space-y-1.5">
              <button
                v-for="skill in (selectedEntity.skills || [])"
                :key="skill.id"
                @click.stop="handleSkillSelect(skill)"
                :disabled="!!(skill.currentCooldown && skill.currentCooldown > 0)"
                class="w-full text-left rounded-md transition-all group"
                :class="[
                  gameStore.selectedSkill?.id === skill.id
                    ? 'skill-btn-active'
                    : skill.currentCooldown && skill.currentCooldown > 0
                      ? 'skill-btn-disabled'
                      : 'skill-btn',
                ]"
              >
                <div class="flex items-start gap-2.5 px-3 py-2.5">
                  <!-- Skill Icon -->
                  <div class="w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                    :class="[
                      gameStore.selectedSkill?.id === skill.id
                        ? 'bg-sky-600 border border-sky-400'
                        : skill.currentCooldown && skill.currentCooldown > 0
                          ? 'bg-slate-800 border border-slate-700'
                          : 'bg-slate-800 border border-slate-600 group-hover:border-sky-500',
                    ]">
                    <Icon :icon="getSkillIcon(skill.id)" class="w-5 h-5"
                      :class="skill.currentCooldown && skill.currentCooldown > 0 ? 'text-slate-600' : 'text-slate-300'" />
                  </div>
                  <!-- Skill Info -->
                  <div class="flex-1 min-w-0">
                    <div class="font-ui text-sm font-bold leading-tight"
                      :class="skill.currentCooldown && skill.currentCooldown > 0 ? 'text-slate-600' : 'text-slate-200'">
                      {{ skill.name }}
                    </div>
                    <div class="font-ui text-[10px] font-semibold mt-0.5"
                      :class="skill.currentCooldown && skill.currentCooldown > 0 ? 'text-slate-700' : 'text-slate-500'">
                      <span v-if="skill.type === 'self'">自身</span>
                      <span v-else>射程 {{ skill.range }}</span>
                      <span v-if="skill.cooldown > 0" class="ml-1.5">冷卻 {{ skill.cooldown }}</span>
                    </div>
                    <div class="text-[10px] text-slate-500 mt-0.5 leading-tight">{{ skill.description }}</div>
                    <div v-if="skill.currentCooldown && skill.currentCooldown > 0"
                      class="font-ui text-[10px] font-bold text-amber-500 mt-1">
                      冷卻中：{{ skill.currentCooldown }} 回合
                    </div>
                  </div>
                </div>
              </button>
            </div>

            <!-- Action Buttons (ACTION_SELECT phase) -->
            <div v-if="gameStore.unitActionPhase === 'ACTION_SELECT'" class="px-2 pb-2 space-y-1.5 border-t pt-2"
              style="border-color: var(--color-border-panel);">

              <div class="px-2 mb-1">
                <span class="font-ui text-[10px] font-bold text-slate-600 tracking-widest">行動選擇</span>
              </div>

              <!-- Push Attack -->
              <button v-if="adjacentEnemies.length > 0" @click="handlePushAttack"
                class="w-full game-btn game-btn-danger flex items-center gap-2.5 py-2.5 px-3 text-left">
                <Icon :icon="ICONS.attack" class="w-5 h-5 flex-shrink-0" />
                <div>
                  <div class="font-ui text-sm font-bold">推撞攻擊</div>
                  <div class="font-ui text-[10px] opacity-60">擊退鄰近敵人</div>
                </div>
              </button>

              <!-- Interact -->
              <button v-for="inter in adjacentInteractables" :key="inter.id" @click="handleInteract(inter.id)"
                class="w-full game-btn flex items-center gap-2.5 py-2.5 px-3 text-left !border-amber-700 !text-amber-300">
                <Icon :icon="ICONS.investigate" class="w-5 h-5 flex-shrink-0" />
                <div>
                  <div class="font-ui text-sm font-bold">調查</div>
                  <div class="font-ui text-[10px] opacity-60">{{ inter.name }}</div>
                </div>
              </button>

              <!-- Wait -->
              <button @click="handleWait" class="w-full game-btn flex items-center gap-2.5 py-2 px-3 text-left">
                <Icon :icon="ICONS.wait" class="w-4 h-4 flex-shrink-0" />
                <span class="font-ui text-sm font-bold">待機</span>
              </button>

              <!-- Cancel -->
              <button @click="handleCancelAction" class="w-full game-btn flex items-center gap-2.5 py-2 px-3 text-left !text-slate-600">
                <Icon :icon="ICONS.cancel" class="w-4 h-4 flex-shrink-0" />
                <span class="font-ui text-sm font-bold">取消移動</span>
              </button>
            </div>
          </div>
        </Transition>

        <!-- End Turn Button -->
        <div v-if="gameStore.currentTurn === 'PLAYER' && !gameStore.isProcessingTurn && gameStore.gameState === 'PLAYING'"
          class="mt-3">
          <button @click="handleEndTurn"
            class="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-ui font-bold text-base tracking-wide transition-all active:scale-95"
            :class="allPlayersActed
              ? 'game-btn-primary end-turn-pulse !py-3.5'
              : 'game-btn !py-3.5'">
            <Icon :icon="ICONS.endTurn" class="w-5 h-5" />
            <span>結束回合</span>
          </button>
        </div>

        <!-- Status Log -->
        <div class="mt-3 game-panel px-3 py-2">
          <div class="font-ui text-[9px] font-bold text-slate-600 tracking-widest mb-1">系統紀錄</div>
          <div class="text-xs text-slate-400 leading-relaxed">
            {{ gameStore.selectedSkill ? `瞄準中：${gameStore.selectedSkill.name}` : (gameStore.lastActionMessage || '等待指令...') }}
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ TURN PHASE BANNER ═══ -->
    <Transition name="phase-banner">
      <div v-if="gameStore.turnPhaseBanner"
        class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div class="phase-banner-inner"
          :class="gameStore.turnPhaseBanner === 'PLAYER' ? 'phase-banner-player' : 'phase-banner-enemy'">
          <div class="font-ui text-6xl font-bold tracking-wider"
            style="text-shadow: 0 4px 20px rgba(0,0,0,0.8);">
            {{ gameStore.turnPhaseBanner === 'PLAYER' ? '我 方 回 合' : '敵 方 回 合' }}
          </div>
          <div class="font-ui text-lg font-semibold tracking-[0.5em] uppercase opacity-50 mt-2">
            {{ gameStore.turnPhaseBanner === 'PLAYER' ? 'PLAYER PHASE' : 'ENEMY PHASE' }}
          </div>
        </div>
      </div>
    </Transition>

    <!-- ═══ Win/Lose Overlay ═══ -->
    <div v-if="gameStore.gameState === 'WIN' || gameStore.gameState === 'LOSE'"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center text-white p-6 text-center animate-fade-in"
      style="background: rgba(10,14,26,0.92); backdrop-filter: blur(12px);">
      <div class="max-w-2xl w-full">
        <h2 v-if="gameStore.gameState === 'WIN'"
          class="font-ui text-7xl font-bold text-sky-400 mb-2 tracking-wider"
          style="text-shadow: 0 0 40px rgba(56,189,248,0.5);">作戰成功</h2>
        <h2 v-else
          class="font-ui text-7xl font-bold text-red-500 mb-2 tracking-wider"
          style="text-shadow: 0 0 40px rgba(239,68,68,0.5);">作戰失敗</h2>
        <p v-if="gameStore.gameState === 'WIN'" class="font-ui text-lg text-slate-600 uppercase tracking-widest mb-2">MISSION COMPLETE</p>
        <p v-else class="font-ui text-lg text-slate-600 uppercase tracking-widest mb-2">MISSION FAILED</p>
        <p class="mb-12 text-xl font-semibold text-slate-400">
          {{ gameStore.gameState === 'WIN' ? '任務完成，正在結算...' : gameStore.lastActionMessage }}
        </p>
        <button @click="restartGame" class="game-btn-primary font-ui text-xl px-12 py-5 rounded-xl tracking-tight">
          重新挑戰
        </button>
      </div>
    </div>

    <!-- ═══ Mission Briefing Modal ═══ -->
    <div v-if="gameStore.showMissionBriefing && gameStore.currentLevel?.missionBriefing"
      class="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-in"
      style="background: rgba(10,14,26,0.88); backdrop-filter: blur(8px);">
      <div class="game-panel game-panel-accent max-w-lg w-full p-0 overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-4 border-b flex items-center gap-3"
          style="border-color: var(--color-border-panel); background: rgba(0,0,0,0.3);">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center"
            style="background: var(--color-player-bg); border: 1px solid var(--color-player);">
            <Icon :icon="ICONS.briefing" class="w-6 h-6" style="color: var(--color-player);" />
          </div>
          <div>
            <h3 class="font-ui text-xl font-bold text-sky-400">作戰簡報</h3>
            <p class="font-ui text-[10px] text-slate-500 font-bold tracking-widest uppercase">MISSION BRIEFING &mdash; {{ gameStore.currentLevel.title }}</p>
          </div>
        </div>

        <div class="p-6 space-y-4">
          <!-- Objective -->
          <div class="rounded-lg p-4" style="background: rgba(14,116,144,0.15); border: 1px solid rgba(56,189,248,0.2);">
            <div class="flex items-center gap-2 mb-2">
              <Icon :icon="ICONS.objective" class="w-4 h-4 text-sky-400" />
              <span class="font-ui text-[11px] font-bold text-sky-400 tracking-widest">主要目標</span>
            </div>
            <div class="text-white font-semibold text-base">{{ gameStore.currentLevel.missionBriefing.objective }}</div>
          </div>

          <!-- Tips -->
          <div>
            <div class="flex items-center gap-2 mb-2">
              <Icon :icon="ICONS.tips" class="w-4 h-4 text-slate-400" />
              <span class="font-ui text-[11px] font-bold text-slate-500 tracking-widest">操作提示</span>
            </div>
            <div v-for="(tip, i) in gameStore.currentLevel.missionBriefing.tips" :key="i"
              class="text-sm text-slate-300 pl-3 border-l-2 leading-relaxed mb-1.5"
              style="border-color: var(--color-border-panel);">
              {{ tip }}
            </div>
          </div>

          <!-- Fail Condition -->
          <div v-if="gameStore.currentLevel.missionBriefing.failCondition"
            class="rounded-lg p-3" style="background: rgba(127,29,29,0.2); border: 1px solid rgba(239,68,68,0.2);">
            <div class="flex items-center gap-2 mb-1">
              <Icon :icon="ICONS.fail" class="w-4 h-4 text-red-400" />
              <span class="font-ui text-[11px] font-bold text-red-400 tracking-widest">失敗條件</span>
            </div>
            <div class="text-sm text-red-300">{{ gameStore.currentLevel.missionBriefing.failCondition }}</div>
          </div>
        </div>

        <!-- CTA -->
        <div class="px-6 pb-6">
          <button @click="gameStore.dismissMissionBriefing()"
            class="w-full game-btn-primary font-ui text-lg py-4 rounded-lg tracking-wide">
            開始作戰
          </button>
        </div>
      </div>
    </div>

    <!-- ═══ Battle Notifications ═══ -->
    <div class="fixed top-16 left-1/2 -translate-x-1/2 z-40 flex flex-col gap-2 items-center pointer-events-none">
      <TransitionGroup name="notif">
        <div v-for="notif in gameStore.battleNotifications" :key="notif.id"
          class="game-panel px-5 py-2.5 font-ui font-bold text-sm animate-fade-in"
          :class="{
            '!border-sky-600 text-sky-200': notif.type === 'info',
            '!border-red-600 text-red-200': notif.type === 'warning',
            '!border-emerald-600 text-emerald-200': notif.type === 'success',
          }"
        >{{ notif.text }}</div>
      </TransitionGroup>
    </div>

    <!-- ═══ BGM Audio Element ═══ -->
    <audio ref="bgmAudio" loop></audio>
  </div>
</template>

<style scoped>
/* ═══ Map Container Themes ═══ */
.map-container {
  border: 1px solid var(--color-border-panel);
}
.map-corridor {
  background: linear-gradient(135deg, #0f172a 0%, #1a1a2e 50%, #16213e 100%);
  border-color: #334155;
  box-shadow: inset 0 0 40px rgba(51, 65, 85, 0.3);
}
.map-corridor .grid-cell {
  background: rgba(30, 41, 59, 0.4);
  border-color: rgba(71, 85, 105, 0.25);
}
.map-tech {
  background: linear-gradient(180deg, #0a0e1a 0%, #0d1b2a 50%, #0a1628 100%);
  border-color: #1e40af;
  box-shadow: inset 0 0 40px rgba(30, 64, 175, 0.15), 0 0 8px rgba(59, 130, 246, 0.15);
}
.map-tech .grid-cell {
  background: rgba(15, 23, 42, 0.5);
  border-color: rgba(59, 130, 246, 0.15);
}
.map-hall {
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-color: #475569;
  box-shadow: inset 0 0 50px rgba(15, 52, 96, 0.3);
}
.map-hall .grid-cell {
  background: rgba(22, 33, 62, 0.45);
  border-color: rgba(71, 85, 105, 0.3);
}
.map-office {
  background: linear-gradient(135deg, #1a0e0e 0%, #1c1917 50%, #27211e 100%);
  border-color: #78716c;
  box-shadow: inset 0 0 40px rgba(120, 113, 108, 0.15);
}
.map-office .grid-cell {
  background: rgba(41, 37, 36, 0.45);
  border-color: rgba(120, 113, 108, 0.2);
}
.map-night {
  background: linear-gradient(180deg, #020617 0%, #0c0a1f 40%, #1a0533 100%);
  border-color: #4c1d95;
  box-shadow: inset 0 0 60px rgba(76, 29, 149, 0.15), 0 0 12px rgba(139, 92, 246, 0.1);
}
.map-night .grid-cell {
  background: rgba(12, 10, 31, 0.5);
  border-color: rgba(139, 92, 246, 0.15);
}
.map-default {
  background: rgba(10, 14, 26, 0.8);
}

/* ═══ Grid Cell ═══ */
.grid-cell {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(42, 58, 92, 0.3);
  transition: background 0.15s;
}
.grid-cell:hover {
  background: rgba(30, 41, 59, 0.7);
}

/* ═══ Movable tile (breathing pulse) ═══ */
.movable-tile {
  animation: movablePulse 1.5s ease-in-out infinite;
  cursor: pointer !important;
  border-color: rgba(56, 189, 248, 0.4) !important;
}
@keyframes movablePulse {
  0%, 100% { background: rgba(56, 189, 248, 0.1); box-shadow: inset 0 0 6px rgba(56, 189, 248, 0.15); }
  50% { background: rgba(56, 189, 248, 0.25); box-shadow: inset 0 0 16px rgba(56, 189, 248, 0.35); }
}

/* ═══ Targeting tile ═══ */
.targeting-tile {
  background: rgba(234, 179, 8, 0.2);
  border: 2px solid rgba(234, 179, 8, 0.4);
  animation: targetPulse 1s ease-in-out infinite;
}
@keyframes targetPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* ═══ Trap tile ═══ */
.trap-tile {
  background: rgba(239, 68, 68, 0.15);
  border: 2px solid rgba(239, 68, 68, 0.3);
  animation: targetPulse 1.5s ease-in-out infinite;
}

/* ═══ Breach line ═══ */
.breach-line {
  border-bottom: 3px solid rgba(239, 68, 68, 0.6) !important;
  box-shadow: 0 3px 12px rgba(239, 68, 68, 0.2);
}

/* ═══ Escort exit zone ═══ */
.escort-zone {
  background: rgba(16, 185, 129, 0.08) !important;
  border-bottom: 2px solid rgba(16, 185, 129, 0.3) !important;
}

/* ═══ Intent tile ═══ */
.intent-tile {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
}

/* ═══ Environment tiles ═══ */
.env-tile { border: 1px solid transparent; }

.env-fire {
  background:
    repeating-linear-gradient(45deg, rgba(234, 88, 12, 0.12) 0px, rgba(234, 88, 12, 0.12) 4px, transparent 4px, transparent 8px),
    radial-gradient(ellipse at 50% 80%, rgba(239, 68, 68, 0.3) 0%, transparent 70%);
  border-color: rgba(249, 115, 22, 0.4);
  animation: fireFlicker 0.8s ease-in-out infinite alternate;
}
@keyframes fireFlicker {
  0% { opacity: 0.7; }
  100% { opacity: 1; }
}

.env-water {
  background:
    repeating-linear-gradient(180deg, rgba(56, 189, 248, 0.08) 0px, rgba(56, 189, 248, 0.16) 6px, rgba(56, 189, 248, 0.04) 12px);
  border-color: rgba(56, 189, 248, 0.3);
  animation: waterWave 2s ease-in-out infinite;
}
@keyframes waterWave {
  0%, 100% { background-position: 0 0; }
  50% { background-position: 0 6px; }
}

.env-rubble {
  background:
    repeating-conic-gradient(rgba(120, 113, 108, 0.15) 0% 25%, transparent 0% 50%) 0 0 / 8px 8px;
  border-color: rgba(168, 162, 158, 0.3);
}

.env-alarm {
  background: repeating-linear-gradient(-45deg, rgba(234, 179, 8, 0.08) 0px, rgba(234, 179, 8, 0.08) 4px, transparent 4px, transparent 8px);
  border-color: rgba(250, 204, 21, 0.3);
  animation: alarmPulse 1.5s ease-in-out infinite;
}
@keyframes alarmPulse {
  0%, 100% { border-color: rgba(250, 204, 21, 0.2); }
  50% { border-color: rgba(250, 204, 21, 0.6); box-shadow: inset 0 0 10px rgba(234, 179, 8, 0.2); }
}

.env-exit {
  background: repeating-linear-gradient(90deg, rgba(16, 185, 129, 0.08) 0px, rgba(16, 185, 129, 0.08) 3px, transparent 3px, transparent 6px);
  border-color: rgba(52, 211, 153, 0.3);
}

/* ═══ HP bar ═══ */
.hp-bar-fill {
  box-shadow: inset 0 -1px 0 rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
}
.hp-flash {
  animation: hpFlash 0.4s ease-out;
}
@keyframes hpFlash {
  0% { filter: brightness(1); }
  25% { filter: brightness(2.5); }
  50% { filter: brightness(0.5); }
  100% { filter: brightness(1); }
}

/* ═══ Selected unit glow ═══ */
.selected-pulse {
  animation: selectedGlow 1.2s ease-in-out infinite;
}
@keyframes selectedGlow {
  0%, 100% { box-shadow: 0 0 12px rgba(56, 189, 248, 0.3); }
  50% { box-shadow: 0 0 24px rgba(56, 189, 248, 0.7), 0 0 48px rgba(56, 189, 248, 0.2); }
}

/* ═══ End turn pulse ═══ */
.end-turn-pulse {
  animation: endTurnPulse 1.5s ease-in-out infinite;
}
@keyframes endTurnPulse {
  0%, 100% { box-shadow: 0 0 15px rgba(37, 99, 235, 0.2); }
  50% { box-shadow: 0 0 30px rgba(37, 99, 235, 0.6); }
}

/* ═══ Skill button states ═══ */
.skill-btn {
  background: linear-gradient(180deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
  border: 1px solid var(--color-border-panel);
  cursor: pointer;
}
.skill-btn:hover {
  background: linear-gradient(180deg, rgba(51, 65, 85, 0.8) 0%, rgba(30, 41, 59, 0.9) 100%);
  border-color: rgba(56, 189, 248, 0.4);
}
.skill-btn-active {
  background: linear-gradient(180deg, rgba(14, 116, 144, 0.4) 0%, rgba(8, 51, 68, 0.6) 100%);
  border: 1px solid rgba(56, 189, 248, 0.6);
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.2);
}
.skill-btn-disabled {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(42, 58, 92, 0.3);
  cursor: not-allowed;
  opacity: 0.5;
}

/* ═══ Damage text system ═══ */
.damage-text {
  animation: damageFloat 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.damage-number {
  -webkit-text-stroke: 2px rgba(0, 0, 0, 0.8);
  paint-order: stroke fill;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 6px rgba(0, 0, 0, 0.4));
}
.damage-normal { color: #ef4444; }
.damage-crit { color: #facc15; }
.damage-crit .damage-number {
  -webkit-text-stroke: 2.5px rgba(0, 0, 0, 0.9);
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 1)) drop-shadow(0 0 10px rgba(234, 179, 8, 0.4));
}
.damage-heal { color: #22c55e; }
.damage-heal .damage-number {
  -webkit-text-stroke: 1.5px rgba(0, 0, 0, 0.7);
}
@keyframes damageFloat {
  0% { transform: translateY(5px) translateX(0) scale(0.4); opacity: 0; }
  15% { transform: translateY(-8px) translateX(var(--spread-x, 0)) scale(1.4); opacity: 1; }
  35% { transform: translateY(-25px) translateX(var(--spread-x, 0)) scale(1); opacity: 1; }
  100% { transform: translateY(-70px) translateX(var(--spread-x, 0)) scale(0.7); opacity: 0; }
}

/* ═══ Skill Cast Effects ═══ */
.skill-fx-slash {
  animation: fxSlash 0.5s ease-out both;
  background: linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.6) 48%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.6) 52%, transparent 70%);
  border-radius: 4px;
}
.skill-fx-heavy {
  animation: fxHeavy 0.6s ease-out both;
  background: radial-gradient(circle, rgba(250,204,21,0.5) 0%, rgba(239,68,68,0.3) 40%, transparent 70%);
  border-radius: 4px;
  box-shadow: inset 0 0 20px rgba(250,204,21,0.4);
}
.skill-fx-heal {
  animation: fxHeal 0.6s ease-out both;
  background: radial-gradient(circle, rgba(34,197,94,0.4) 0%, rgba(34,197,94,0.1) 50%, transparent 70%);
  border-radius: 50%;
  box-shadow: inset 0 0 15px rgba(34,197,94,0.3);
}
.skill-fx-buff {
  animation: fxBuff 0.6s ease-out both;
  background: radial-gradient(circle, rgba(56,189,248,0.35) 0%, rgba(56,189,248,0.1) 50%, transparent 70%);
  border-radius: 50%;
  box-shadow: inset 0 0 15px rgba(56,189,248,0.3);
}
.skill-fx-debuff {
  animation: fxDebuff 0.5s ease-out both;
  background: radial-gradient(circle, rgba(168,85,247,0.5) 0%, rgba(168,85,247,0.15) 50%, transparent 70%);
  border-radius: 4px;
  box-shadow: inset 0 0 15px rgba(168,85,247,0.3);
}
.skill-fx-aoe {
  animation: fxAoe 0.6s ease-out both;
  background: radial-gradient(circle, rgba(249,115,22,0.4) 0%, rgba(249,115,22,0.15) 40%, transparent 70%);
  border-radius: 4px;
  box-shadow: inset 0 0 20px rgba(249,115,22,0.3);
}

@keyframes fxSlash {
  0% { opacity: 0; transform: scale(0.5) rotate(-30deg); }
  30% { opacity: 1; transform: scale(1.2) rotate(0deg); }
  100% { opacity: 0; transform: scale(1.5) rotate(15deg); }
}
@keyframes fxHeavy {
  0% { opacity: 0; transform: scale(0.3); }
  20% { opacity: 1; transform: scale(1.4); }
  50% { opacity: 0.8; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.8); }
}
@keyframes fxHeal {
  0% { opacity: 0; transform: scale(0.5); }
  30% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0; transform: scale(1.6); }
}
@keyframes fxBuff {
  0% { opacity: 0; transform: scale(0.3); }
  25% { opacity: 1; transform: scale(1.2); }
  100% { opacity: 0; transform: scale(1.5); }
}
@keyframes fxDebuff {
  0% { opacity: 0; transform: scale(1.3); }
  30% { opacity: 1; transform: scale(1); }
  60% { opacity: 0.8; transform: scale(1.1); }
  100% { opacity: 0; transform: scale(0.8); }
}
@keyframes fxAoe {
  0% { opacity: 0; transform: scale(0.2); }
  25% { opacity: 1; transform: scale(1.3); }
  100% { opacity: 0; transform: scale(1.6); }
}

/* ═══ Kill Reward Effects ═══ */
.reward-text {
  transform: translateX(-50%);
  animation: rewardPopup 2s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.reward-label {
  -webkit-text-stroke: 1.5px rgba(0, 0, 0, 0.9);
  paint-order: stroke fill;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.9));
}
.reward-kill { color: #f97316; }
.reward-chain {
  color: #facc15;
  filter: drop-shadow(0 0 12px rgba(250, 204, 21, 0.5));
}
.reward-chain .reward-label {
  -webkit-text-stroke: 2px rgba(0, 0, 0, 0.95);
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 1)) drop-shadow(0 0 15px rgba(250, 204, 21, 0.6));
}
.reward-bonus {
  color: #c084fc;
  filter: drop-shadow(0 0 12px rgba(192, 132, 252, 0.5));
}
.reward-bonus .reward-label {
  -webkit-text-stroke: 2px rgba(0, 0, 0, 0.95);
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 1)) drop-shadow(0 0 15px rgba(192, 132, 252, 0.6));
}
@keyframes rewardPopup {
  0% { transform: translateX(-50%) translateY(0) scale(0.3); opacity: 0; }
  10% { transform: translateX(-50%) translateY(-10px) scale(1.3); opacity: 1; }
  25% { transform: translateX(-50%) translateY(-20px) scale(1); opacity: 1; }
  70% { transform: translateX(-50%) translateY(-40px) scale(1); opacity: 0.9; }
  100% { transform: translateX(-50%) translateY(-80px) scale(0.8); opacity: 0; }
}

/* ═══ Turn Phase Banner ═══ */
.phase-banner-inner { padding: 2rem 8rem; text-align: center; }
.phase-banner-player {
  background: linear-gradient(90deg, transparent 0%, rgba(14, 116, 144, 0.3) 20%, rgba(14, 116, 144, 0.5) 50%, rgba(14, 116, 144, 0.3) 80%, transparent 100%);
  border-top: 2px solid rgba(56, 189, 248, 0.4);
  border-bottom: 2px solid rgba(56, 189, 248, 0.4);
  color: #bae6fd;
}
.phase-banner-enemy {
  background: linear-gradient(90deg, transparent 0%, rgba(127, 29, 29, 0.3) 20%, rgba(127, 29, 29, 0.5) 50%, rgba(127, 29, 29, 0.3) 80%, transparent 100%);
  border-top: 2px solid rgba(239, 68, 68, 0.4);
  border-bottom: 2px solid rgba(239, 68, 68, 0.4);
  color: #fecaca;
}
.phase-banner-enter-active { animation: bannerSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.phase-banner-leave-active { animation: bannerSlideOut 0.4s cubic-bezier(0.55, 0, 1, 0.45); }
@keyframes bannerSlideIn {
  from { opacity: 0; transform: translateX(-100vw); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes bannerSlideOut {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(100vw); }
}

/* ═══ Panel transitions ═══ */
.slide-up-enter-active { animation: slideUpIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-leave-active { animation: slideUpOut 0.2s ease-in forwards; }
@keyframes slideUpIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideUpOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(16px); } }

.slide-right-enter-active { animation: slideRightIn 0.2s ease-out; }
.slide-right-leave-active { animation: slideRightOut 0.15s ease-in forwards; }
@keyframes slideRightIn { from { opacity: 0; width: 0; } to { opacity: 1; width: auto; } }
@keyframes slideRightOut { from { opacity: 1; } to { opacity: 0; width: 0; } }

/* ═══ Notification transitions ═══ */
.notif-enter-active { animation: notifIn 0.3s ease-out; }
.notif-leave-active { animation: notifOut 0.3s ease-in forwards; }
.notif-move { transition: transform 0.3s ease; }
@keyframes notifIn { from { opacity: 0; transform: translateY(-16px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes notifOut { from { opacity: 1; } to { opacity: 0; transform: translateY(-10px); } }

/* ═══ Entity animations ═══ */
.animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
.animate-shake { animation: shake 0.2s cubic-bezier(.36,.07,.19,.97) both; }
.anim-float { animation: float 3s ease-in-out infinite; }
.anim-interact-pulse { animation: interactPulse 2s ease-in-out infinite; }
.anim-lunge { animation: lunge 0.35s cubic-bezier(0.2, 0, 0.6, 1) both; }
.anim-hit { animation: hitRecoil 0.35s ease-out both; }

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
@keyframes interactPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 8px rgba(251, 191, 36, 0.2); }
  50% { transform: scale(1.04); box-shadow: 0 0 16px rgba(251, 191, 36, 0.5); }
}
@keyframes lunge {
  0% { transform: translate(0, 0); }
  35% { transform: translate(var(--lunge-x, 0), var(--lunge-y, 0)); }
  100% { transform: translate(0, 0); }
}
@keyframes hitRecoil {
  0% { transform: translate(0, 0); filter: brightness(1); }
  15% { transform: translate(-3px, 0); filter: brightness(2.5); }
  30% { transform: translate(4px, 0); filter: brightness(1.8); }
  50% { transform: translate(-2px, 0); filter: brightness(1.2); }
  100% { transform: translate(0, 0); filter: brightness(1); }
}
@keyframes shake {
  10%, 90% { transform: translate3d(-2px, 0, 0); }
  20%, 80% { transform: translate3d(3px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-5px, 0, 0); }
  40%, 60% { transform: translate3d(5px, 0, 0); }
}
</style>
