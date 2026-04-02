import { defineStore } from 'pinia';
import type { Coordinate, Entity, EntityType, DamageText, RewardText, Skill, StatusEffect, EnvironmentTile, EnemyIntent, UnitActionPhase } from '@/types/game';
import { levels } from '@/data/levels';
import { dialogues, type DialogueLine } from '@/data/dialogues';

interface GameStateSnapshot {
  entities: Entity[];
  lastActionMessage: string;
  evacuatedCount: number;
  interactedTargets: string[];
  trapTiles: Coordinate[];
}

export interface SaveMetadata {
  timestamp: string;
  levelName: string;
  turn: number;
}

export const useGameStore = defineStore('game', {
  state: () => ({
    gridSize: { width: 10, height: 8 },
    entities: [] as Entity[],
    currentTurn: 'PLAYER' as 'PLAYER' | 'ENEMY',
    turnNumber: 1,
    gameState: 'MENU' as 'PLAYING' | 'WIN' | 'LOSE' | 'STORY' | 'MENU' | 'END_CREDITS',
    selectedEntityId: null as string | null,
    lastActionMessage: '' as string,
    isProcessingTurn: false,
    isShaking: false,
    isPaused: false,
    showSaveLoadMenu: null as 'save' | 'load' | null,
    damageTexts: [] as DamageText[],
    currentLevelId: 'chapter-1',
    history: [] as GameStateSnapshot[],
    currentDialogueId: null as string | null,
    currentDialogueIndex: 0,
    activeDialogues: [] as DialogueLine[],
    selectedSkill: null as Skill | null,
    targetingTiles: [] as Coordinate[],
    saveVersion: 0,
    // --- New mechanics state ---
    evacuatedCount: 0,
    interactedTargets: [] as string[],
    trapTiles: [] as Coordinate[],
    // --- Scene state ---
    currentBackground: '' as string,
    currentBgm: '' as string,
    bgmVolume: 0.5,
    bgmMuted: false,
    currentCg: null as string | null,
    // --- New combat mechanics ---
    environmentTiles: [] as EnvironmentTile[],
    enemyIntents: [] as EnemyIntent[],
    killChainActive: false,
    killChainUsedIds: [] as string[],
    showMissionBriefing: false,
    battleNotifications: [] as { id: string; text: string; type: 'info' | 'warning' | 'success' }[],
    // --- Unit action state machine ---
    unitActionPhase: 'IDLE' as UnitActionPhase,
    preMovementPosition: null as Coordinate | null,
    isAnimatingMove: false,
    turnPhaseBanner: null as 'PLAYER' | 'ENEMY' | null,
    inspectedEntityId: null as string | null,
    // --- Reward text ---
    rewardTexts: [] as RewardText[],
    // --- Skill cast effect ---
    skillEffect: null as { tiles: Coordinate[]; type: string } | null,
    // --- Animation state ---
    animAttackerId: null as string | null,
    animAttackDir: null as { x: number; y: number } | null,
    animHitIds: [] as string[],
  }),

  getters: {
    saveSlots(state) {
      state.saveVersion;
      const slots = [];
      for (let i = 1; i <= 99; i++) {
        const raw = localStorage.getItem(`game_save_${i}`);
        if (raw) {
          try {
            const data = JSON.parse(raw);
            slots.push({ id: i, metadata: data.metadata });
          } catch { slots.push({ id: i, metadata: null }); }
        } else { slots.push({ id: i, metadata: null }); }
      }
      return slots;
    },
    currentLevel(state) {
      return levels.find(l => l.id === state.currentLevelId);
    },
  },

  actions: {
    // ===================== Core lifecycle =====================

    resetGame() {
      this.gameState = 'MENU';
      this.entities = [];
      this.history = [];
      this.activeDialogues = [];
      this.currentDialogueId = null;
      this.isPaused = false;
      this.showSaveLoadMenu = null;
      this.evacuatedCount = 0;
      this.interactedTargets = [];
      this.trapTiles = [];
      this.currentBackground = '';
      this.currentBgm = '';
      this.currentCg = null;
      this.environmentTiles = [];
      this.enemyIntents = [];
      this.killChainActive = false;
      this.killChainUsedIds = [];
      this.unitActionPhase = 'IDLE';
      this.preMovementPosition = null;
      this.isAnimatingMove = false;
      this.turnPhaseBanner = null;
      this.inspectedEntityId = null;
    },

    togglePause() {
      if (this.gameState === 'PLAYING' || this.gameState === 'STORY') {
        this.isPaused = !this.isPaused;
        if (!this.isPaused) this.showSaveLoadMenu = null;
      }
    },

    // ===================== Save / Load =====================

    saveGame(slotId: number) {
      const level = levels.find(l => l.id === this.currentLevelId);
      const metadata: SaveMetadata = {
        timestamp: new Date().toLocaleString(),
        levelName: level?.title || this.currentLevelId,
        turn: this.turnNumber,
      };
      const saveData = {
        currentLevelId: this.currentLevelId,
        entities: JSON.parse(JSON.stringify(this.entities)),
        turnNumber: this.turnNumber,
        currentTurn: this.currentTurn,
        history: JSON.parse(JSON.stringify(this.history)),
        gameState: this.gameState === 'STORY' ? 'STORY' : 'PLAYING',
        lastActionMessage: this.lastActionMessage,
        evacuatedCount: this.evacuatedCount,
        interactedTargets: [...this.interactedTargets],
        trapTiles: JSON.parse(JSON.stringify(this.trapTiles)),
        currentBackground: this.currentBackground,
        currentBgm: this.currentBgm,
      };
      localStorage.setItem(`game_save_${slotId}`, JSON.stringify({ metadata, state: saveData }));
      this.saveVersion++;
      alert('遊戲已儲存！');
    },

    loadGame(slotId: number) {
      const rawData = localStorage.getItem(`game_save_${slotId}`);
      if (!rawData) return;
      try {
        const wrapper = JSON.parse(rawData);
        const data = wrapper.state;
        this.currentLevelId = data.currentLevelId;
        this.entities = data.entities;
        this.turnNumber = data.turnNumber;
        this.currentTurn = data.currentTurn;
        this.history = data.history || [];
        this.lastActionMessage = data.lastActionMessage || 'Memory Restored';
        this.gameState = data.gameState || 'PLAYING';
        this.evacuatedCount = data.evacuatedCount || 0;
        this.interactedTargets = data.interactedTargets || [];
        this.trapTiles = data.trapTiles || [];
        this.currentBackground = data.currentBackground || '';
        this.currentBgm = data.currentBgm || '';
        this.currentCg = null;
        const level = levels.find(l => l.id === this.currentLevelId);
        if (level) this.gridSize = { ...level.gridSize };
        this.isPaused = false;
        this.showSaveLoadMenu = null;
        this.selectedEntityId = null;
        this.selectedSkill = null;
        this.targetingTiles = [];
      } catch (e) { console.error(e); }
    },

    // ===================== Level init =====================

    initLevel(levelId: string = 'chapter-1') {
      const level = levels.find(l => l.id === levelId);
      if (!level) return;
      this.currentLevelId = levelId;
      this.gridSize = { ...level.gridSize };
      this.entities = level.entities.map(e => ({
        ...e,
        position: { x: e.x, y: e.y },
        status: [],
        hasActed: false,
      } as any));
      this.currentTurn = 'PLAYER';
      this.turnNumber = 1;
      this.gameState = 'STORY';
      this.selectedEntityId = null;
      this.lastActionMessage = level.title;
      this.isProcessingTurn = false;
      this.isShaking = false;
      this.damageTexts = [];
      this.rewardTexts = [];
      this.history = [];
      this.selectedSkill = null;
      this.targetingTiles = [];
      this.isPaused = false;
      this.evacuatedCount = 0;
      this.interactedTargets = [];
      this.trapTiles = [];
      this.currentCg = null;
      this.environmentTiles = level.environmentTiles ? JSON.parse(JSON.stringify(level.environmentTiles)) : [];
      this.enemyIntents = [];
      this.killChainActive = false;
      this.killChainUsedIds = [];
      if (level.background) this.currentBackground = level.background;
      if (level.bgm) this.currentBgm = level.bgm;
      this.startDialogue(`${levelId}_intro`);
    },

    /** Restart battle without replaying intro dialogue */
    restartBattle() {
      const level = levels.find(l => l.id === this.currentLevelId);
      if (!level) return;
      this.gridSize = { ...level.gridSize };
      this.entities = level.entities.map(e => ({
        ...e,
        position: { x: e.x, y: e.y },
        status: [],
        hasActed: false,
        skills: e.skills ? e.skills.map(s => ({ ...s, currentCooldown: 0 })) : undefined,
      } as any));
      this.currentTurn = 'PLAYER';
      this.turnNumber = 1;
      this.gameState = 'PLAYING';
      this.selectedEntityId = null;
      this.lastActionMessage = level.title;
      this.isProcessingTurn = false;
      this.isShaking = false;
      this.damageTexts = [];
      this.rewardTexts = [];
      this.history = [];
      this.selectedSkill = null;
      this.targetingTiles = [];
      this.isPaused = false;
      this.evacuatedCount = 0;
      this.interactedTargets = [];
      this.trapTiles = [];
      this.currentCg = null;
      this.environmentTiles = level.environmentTiles ? JSON.parse(JSON.stringify(level.environmentTiles)) : [];
      this.enemyIntents = [];
      this.killChainActive = false;
      this.killChainUsedIds = [];
      this.battleNotifications = [];
      this.unitActionPhase = 'IDLE';
      this.preMovementPosition = null;
      this.isAnimatingMove = false;
      this.turnPhaseBanner = null;
      this.inspectedEntityId = null;
      if (level.background) this.currentBackground = level.background;
      if (level.bgm) this.currentBgm = level.bgm;
      // Show mission briefing instead of intro
      if (level.missionBriefing) {
        this.showMissionBriefing = true;
      }
      this.computeEnemyIntents();
    },

    // ===================== Dialogue system =====================

    startDialogue(dialogueId: string) {
      const script = dialogues[dialogueId];
      if (script) {
        this.currentDialogueId = dialogueId;
        this.currentDialogueIndex = 0;
        this.activeDialogues = script;
        this.gameState = 'STORY';
        this.applyDialogueLineScene(script[0]);
      } else {
        this.gameState = 'PLAYING';
      }
    },

    applyDialogueLineScene(line: DialogueLine | undefined) {
      if (!line) return;
      if (line.background) this.currentBackground = line.background;
      if (line.bgm) this.currentBgm = line.bgm;
      // CG: show only when explicitly set on this line, clear otherwise
      this.currentCg = line.cg || null;
    },

    nextDialogueLine() {
      this.currentDialogueIndex++;
      if (this.currentDialogueIndex < this.activeDialogues.length) {
        this.applyDialogueLineScene(this.activeDialogues[this.currentDialogueIndex]);
      }
      if (this.currentDialogueIndex >= this.activeDialogues.length) {
        const finishedId = this.currentDialogueId;
        this.currentDialogueId = null;
        this.activeDialogues = [];
        if (finishedId?.endsWith('_intro')) {
          this.gameState = 'PLAYING';
          // Show mission briefing if available
          const level = levels.find(l => l.id === this.currentLevelId);
          if (level?.missionBriefing) {
            this.showMissionBriefing = true;
          }
          // Compute initial enemy intents
          this.computeEnemyIntents();
        } else if (finishedId === 'chapter-5_event') {
          this.entities.filter(e => e.type === 'PLAYER').forEach(p => {
            if (!p.status) p.status = [];
            if (!p.status.includes('DAWN_LIGHT')) p.status.push('DAWN_LIGHT');
          });
          this.gameState = 'PLAYING';
        } else if (finishedId?.endsWith('_defeat')) {
          // Defeat H-scene finished → go to LOSE screen
          this.gameState = 'LOSE';
        } else if (finishedId?.endsWith('_outro')) {
          // Check for reward scene before transitioning to next chapter
          const rewardId = finishedId!.replace('_outro', '_reward');
          if (dialogues[rewardId]) {
            this.startDialogue(rewardId);
            return;
          }
          if (finishedId === 'chapter-1_outro') this.initLevel('chapter-2');
          else if (finishedId === 'chapter-2_outro') this.initLevel('chapter-3');
          else if (finishedId === 'chapter-3_outro') this.initLevel('chapter-4');
          else if (finishedId === 'chapter-4_outro') this.initLevel('chapter-5');
          else if (this.currentLevelId === 'chapter-5') this.gameState = 'END_CREDITS';
          else this.gameState = 'MENU';
        } else if (finishedId?.endsWith('_reward')) {
          // Reward scene finished → go to next chapter
          if (finishedId === 'chapter-2_reward') this.initLevel('chapter-3');
          else if (finishedId === 'chapter-3_reward') this.initLevel('chapter-4');
          else if (finishedId === 'chapter-4_reward') this.initLevel('chapter-5');
        }
      }
    },

    // ===================== Snapshot / Undo =====================

    saveSnapshot() {
      const snapshot: GameStateSnapshot = {
        entities: JSON.parse(JSON.stringify(this.entities)),
        lastActionMessage: this.lastActionMessage,
        evacuatedCount: this.evacuatedCount,
        interactedTargets: [...this.interactedTargets],
        trapTiles: JSON.parse(JSON.stringify(this.trapTiles)),
      };
      this.history.push(snapshot);
    },

    undo() {
      if (this.history.length === 0 || this.currentTurn !== 'PLAYER' || this.isProcessingTurn || this.isAnimatingMove) return;
      const snapshot = this.history.pop();
      if (snapshot) {
        this.entities = snapshot.entities;
        this.lastActionMessage = snapshot.lastActionMessage;
        this.evacuatedCount = snapshot.evacuatedCount;
        this.interactedTargets = snapshot.interactedTargets;
        this.trapTiles = snapshot.trapTiles;
        this.selectedEntityId = null;
        this.selectedSkill = null;
        this.targetingTiles = [];
        this.unitActionPhase = 'IDLE';
        this.preMovementPosition = null;
      }
    },

    // ===================== Win / Lose conditions =====================

    checkWinLoseCondition() {
      if (this.gameState !== 'PLAYING') return;
      const level = levels.find(l => l.id === this.currentLevelId);
      if (!level) return;

      const players = this.entities.filter(e => e.type === 'PLAYER');
      const enemies = this.entities.filter(e => e.type === 'ENEMY' || e.type === 'BOSS');

      // --- Universal lose: all players dead ---
      if (players.length === 0) {
        this.triggerDefeat();
        this.lastActionMessage = '全軍覆沒...';
        return;
      }

      // --- Custom lose conditions ---
      const lc = level.loseCondition;
      if (lc) {
        // Required alive
        if (lc.requiredAlive) {
          for (const id of lc.requiredAlive) {
            if (!this.entities.find(e => e.id === id)) {
              const name = level.entities.find(e => e.id === id)?.name || id;
              this.triggerDefeat();
              this.lastActionMessage = `${name} 倒下了...`;
              return;
            }
          }
        }
        // NPC lost
        if (lc.npcLost) {
          for (const id of lc.npcLost) {
            if (!this.entities.find(e => e.id === id)) {
              this.triggerDefeat();
              this.lastActionMessage = '重要人質已遇害！';
              return;
            }
          }
        }
        // Breach line
        if (lc.breachLine) {
          const breached = enemies.filter(e => e.position.y >= lc.breachLine!.y).length;
          if (breached >= lc.breachLine.maxBreaches) {
            this.triggerDefeat();
            this.lastActionMessage = '防線已被突破！';
            return;
          }
        }
        // Turn limit (lose)
        if (lc.turnLimit && this.turnNumber > lc.turnLimit) {
          this.triggerDefeat();
          this.lastActionMessage = '時間耗盡，行動失敗...';
          return;
        }
      }

      // --- Win conditions ---
      const wc = level.winCondition;

      // Survive turns
      if (wc.surviveTurns && this.turnNumber > wc.surviveTurns) {
        this.triggerVictory();
        return;
      }

      // Defeat all (+ optional interact targets)
      if (wc.defeatAll && enemies.length === 0) {
        if (wc.interactTargets) {
          if (wc.interactTargets.every(t => this.interactedTargets.includes(t))) {
            this.triggerVictory();
          }
          // else: enemies dead but haven't interacted yet, keep playing
        } else {
          this.triggerVictory();
        }
        return;
      }

      // Defeat boss (+ optional interact targets)
      if (wc.defeatBoss) {
        const bossAlive = this.entities.some(e => e.type === 'BOSS');
        const interacted = !wc.interactTargets || wc.interactTargets.every(t => this.interactedTargets.includes(t));
        if (!bossAlive && interacted) {
          this.triggerVictory();
          return;
        }
      }

      // Escort
      if (wc.escortCount && this.evacuatedCount >= wc.escortCount) {
        this.triggerVictory();
        return;
      }
    },

    triggerVictory() {
      this.currentBgm = 'bgm_victory';
      this.currentCg = null;
      this.gameState = 'STORY';
      this.startDialogue(`${this.currentLevelId}_outro`);
    },

    triggerDefeat() {
      this.currentBgm = 'bgm_defeat';
      this.currentCg = null;
      const defeatId = `${this.currentLevelId}_defeat`;
      if (dialogues[defeatId]) {
        this.startDialogue(defeatId);
      } else {
        this.gameState = 'LOSE';
      }
    },

    // ===================== Entity selection & skills =====================

    selectEntity(id: string | null) {
      if (this.currentTurn !== 'PLAYER' || this.isProcessingTurn || this.gameState !== 'PLAYING' || this.isPaused) return;
      if (id === null) {
        this.selectedEntityId = null;
        this.selectedSkill = null;
        this.targetingTiles = [];
        this.unitActionPhase = 'IDLE';
        this.preMovementPosition = null;
        return;
      }
      const entity = this.entities.find(e => e.id === id);
      if (entity && entity.type === 'PLAYER' && entity.hasActed) return;
      this.playSfx('se_ui_select');
      this.selectedEntityId = id;
      this.selectedSkill = null;
      this.targetingTiles = [];
      this.unitActionPhase = entity?.type === 'PLAYER' ? 'MOVING' : 'IDLE';
      this.preMovementPosition = null;
    },

    selectSkill(skill: Skill) {
      if (!this.selectedEntityId || this.isPaused) return;
      const caster = this.entities.find(e => e.id === this.selectedEntityId);
      if (!caster) return;
      // Check cooldown
      const actualSkill = caster.skills?.find(s => s.id === skill.id);
      if (actualSkill?.currentCooldown && actualSkill.currentCooldown > 0) return;
      this.selectedSkill = skill;
      this.targetingTiles = [];
      this.unitActionPhase = 'TARGETING';
      if (skill.type === 'target') {
        for (let dy = -skill.range; dy <= skill.range; dy++) {
          for (let dx = -skill.range; dx <= skill.range; dx++) {
            if (Math.abs(dx) + Math.abs(dy) <= skill.range && (dx !== 0 || dy !== 0)) {
              const tx = caster.position.x + dx;
              const ty = caster.position.y + dy;
              if (tx >= 0 && tx < this.gridSize.width && ty >= 0 && ty < this.gridSize.height) {
                this.targetingTiles.push({ x: tx, y: ty });
              }
            }
          }
        }
      } else if (skill.type === 'self') {
        this.targetingTiles.push({ ...caster.position });
      }
    },

    dismissMissionBriefing() {
      this.showMissionBriefing = false;
    },

    /** BFS pathfinding on the grid */
    computeMovePath(from: Coordinate, to: Coordinate): Coordinate[] {
      const key = (c: Coordinate) => `${c.x},${c.y}`;
      const visited = new Set<string>();
      const prev = new Map<string, Coordinate>();
      const queue: Coordinate[] = [from];
      visited.add(key(from));

      while (queue.length > 0) {
        const current = queue.shift()!;
        if (current.x === to.x && current.y === to.y) {
          // Reconstruct path
          const path: Coordinate[] = [];
          let c: Coordinate | undefined = to;
          while (c && key(c) !== key(from)) {
            path.unshift(c);
            c = prev.get(key(c));
          }
          return path;
        }
        for (const dir of [[0, 1], [0, -1], [1, 0], [-1, 0]] as const) {
          const nx = current.x + dir[0];
          const ny = current.y + dir[1];
          const next = { x: nx, y: ny };
          if (nx >= 0 && nx < this.gridSize.width && ny >= 0 && ny < this.gridSize.height &&
              !visited.has(key(next)) && !this.getEntityAt(nx, ny)) {
            visited.add(key(next));
            prev.set(key(next), current);
            queue.push(next);
          }
        }
      }
      return [to]; // Fallback: direct move
    },

    /** Animated step-by-step movement along a path */
    async animateMoveTo(entityId: string, targetX: number, targetY: number) {
      const entity = this.entities.find(e => e.id === entityId);
      if (!entity) return;
      const from = { ...entity.position };
      const path = this.computeMovePath(from, { x: targetX, y: targetY });
      this.isAnimatingMove = true;
      for (const step of path) {
        entity.position = { x: step.x, y: step.y };
        await new Promise(r => setTimeout(r, 120));
      }
      this.isAnimatingMove = false;
    },

    /** Cancel movement and return to pre-move position */
    cancelMove() {
      if (!this.selectedEntityId || !this.preMovementPosition) return;
      const entity = this.entities.find(e => e.id === this.selectedEntityId);
      if (entity) {
        entity.position = { ...this.preMovementPosition };
      }
      this.preMovementPosition = null;
      this.unitActionPhase = 'MOVING';
    },

    /** Get adjacent interactables for action menu */
    getAdjacentInteractables(): Entity[] {
      const entity = this.entities.find(e => e.id === this.selectedEntityId);
      if (!entity) return [];
      return this.entities.filter(e =>
        e.type === 'INTERACTABLE' &&
        Math.abs(e.position.x - entity.position.x) + Math.abs(e.position.y - entity.position.y) === 1
      );
    },

    /** Get adjacent enemies for push/attack targeting */
    getAdjacentEnemies(): Entity[] {
      const entity = this.entities.find(e => e.id === this.selectedEntityId);
      if (!entity) return [];
      return this.entities.filter(e =>
        (e.type === 'ENEMY' || e.type === 'BOSS' || e.type === 'OBSTACLE') &&
        Math.abs(e.position.x - entity.position.x) + Math.abs(e.position.y - entity.position.y) === 1
      );
    },

    /** Enter push/attack targeting mode */
    enterAttackTargeting() {
      const adjacent = this.getAdjacentEnemies();
      if (adjacent.length === 0) return;
      this.targetingTiles = adjacent.map(e => ({ ...e.position }));
      this.unitActionPhase = 'TARGETING';
      this.selectedSkill = null; // null skill = push attack
    },

    /** Execute push attack on target */
    executePushAttack(targetCoord: Coordinate) {
      const caster = this.entities.find(e => e.id === this.selectedEntityId);
      const target = this.getEntityAt(targetCoord.x, targetCoord.y);
      if (!caster || !target) return;
      const casterId = caster.id;
      const dx = Math.sign(targetCoord.x - caster.position.x);
      const dy = Math.sign(targetCoord.y - caster.position.y);
      this.playSfx('se_hit_bash');
      const preKillIds = this.shieldBash(target.id, { x: dx, y: dy });
      this.markActionDone(casterId);
      this.checkKillChain(casterId, preKillIds);
    },

    pushNotification(text: string, type: 'info' | 'warning' | 'success' = 'info') {
      const id = Math.random().toString(36).substring(2, 9);
      this.battleNotifications.push({ id, text, type });
      setTimeout(() => {
        this.battleNotifications = this.battleNotifications.filter(n => n.id !== id);
      }, 4000);
    },

    /** Adjacency bond: +2 damage when another PLAYER is within 1 tile */
    getAdjacencyBonus(caster: Entity): number {
      const allies = this.entities.filter(e => e.type === 'PLAYER' && e.id !== caster.id);
      for (const ally of allies) {
        const dist = Math.abs(ally.position.x - caster.position.x) + Math.abs(ally.position.y - caster.position.y);
        if (dist <= 1) return 2;
      }
      return 0;
    },

    /** RALLIED bonus: +4 damage, consumed on use */
    getRalliedBonus(caster: Entity): number {
      if (caster.status?.includes('RALLIED')) {
        caster.status = caster.status.filter(s => s !== 'RALLIED');
        return 4;
      }
      return 0;
    },

    /** Kill chain: grant bonus action if entity scored a kill.
     *  Must be called AFTER markActionDone so it can re-enable the unit. */
    checkKillChain(casterId: string, preKillEnemyIds: string[]) {
      if (this.gameState !== 'PLAYING') return;
      const currentEnemyIds = this.entities.filter(e => e.type === 'ENEMY' || e.type === 'BOSS').map(e => e.id);
      const killed = preKillEnemyIds.filter(id => !currentEnemyIds.includes(id));
      if (killed.length > 0 && !this.killChainUsedIds.includes(casterId)) {
        const caster = this.entities.find(e => e.id === casterId);
        if (caster) {
          // Re-enable the unit for bonus action
          caster.hasActed = false;
          this.killChainActive = true;
          this.killChainUsedIds.push(casterId);
          // Re-select the unit so player can act again
          this.selectedEntityId = casterId;
          this.unitActionPhase = 'MOVING';
          this.preMovementPosition = null;
          this.lastActionMessage = `${caster.name} 擊殺連鎖！獲得額外行動！`;
          this.pushNotification(`${caster.name} 擊殺連鎖！`, 'success');
          // Show chain reward effect on the caster
          const chainCount = this.killChainUsedIds.length;
          this.showReward(caster.position.x, caster.position.y, `連鎖 x${chainCount}！額外行動！`, 'chain', 400);
        }
      }
    },

    executeSkill(targetCoord: Coordinate) {
      if (!this.selectedSkill || !this.selectedEntityId || this.isPaused) return;
      const caster = this.entities.find(e => e.id === this.selectedEntityId);
      if (!caster) return;

      // Track cooldown
      const skill = caster.skills?.find(s => s.id === this.selectedSkill!.id);
      if (skill && skill.currentCooldown && skill.currentCooldown > 0) return; // still on cooldown

      this.saveSnapshot();
      const dawnBuff = (caster.status && caster.status.includes('DAWN_LIGHT')) ? 10 : 0;
      const adjBonus = this.getAdjacencyBonus(caster);
      const ralliedBonus = this.getRalliedBonus(caster);
      const preKillEnemyIds = this.entities.filter(e => e.type === 'ENEMY' || e.type === 'BOSS').map(e => e.id);

      if (this.selectedSkill.id === 'baton_strike') {
        const target = this.getEntityAt(targetCoord.x, targetCoord.y);
        if (target && (target.type === 'ENEMY' || target.type === 'BOSS')) {
          const finalDamage = (caster.attack || 6) + 2 + dawnBuff + adjBonus + ralliedBonus;
          const dx = Math.sign(targetCoord.x - caster.position.x);
          const dy = Math.sign(targetCoord.y - caster.position.y);
          this.playSfx('se_skill_baton');
          this.triggerAttackAnim(caster.id, { x: dx, y: dy }, [target.id]);
          this.triggerSkillEffect([targetCoord], 'slash');
          target.hp -= finalDamage;
          this.showDamage(target.position.x, target.position.y, finalDamage);
          this.triggerShake();
          this.pushEntity(target.id, { x: dx, y: dy });
          if (this.entities.find(e => e.id === target.id)) this.pushEntity(target.id, { x: dx, y: dy });
          this.markActionDone(caster.id);
        }
      } else if (this.selectedSkill.id === 'shield_wall') {
        // Self-buff: GUARDING status (halve incoming damage, auto-push melee attackers)
        if (!caster.status) caster.status = [];
        if (!caster.status.includes('GUARDING')) caster.status.push('GUARDING');
        this.playSfx('se_interact');
        this.triggerSkillEffect([caster.position], 'buff');
        this.lastActionMessage = `${caster.name} 進入防禦姿態！`;
        this.markActionDone(caster.id);
      } else if (this.selectedSkill.id === 'heal') {
        const target = this.getEntityAt(targetCoord.x, targetCoord.y);
        if (target && target.type === 'PLAYER') {
          const healAmount = 8 + (caster.attack || 0);
          target.hp = Math.min(target.maxHp, target.hp + healAmount);
          this.playSfx('se_skill_heal');
          this.triggerSkillEffect([targetCoord], 'heal');
          this.showDamage(target.position.x, target.position.y, -healAmount);
          this.markActionDone(caster.id);
        }
      } else if (this.selectedSkill.id === 'command_rally') {
        const target = this.getEntityAt(targetCoord.x, targetCoord.y);
        if (target && target.type === 'PLAYER') {
          if (!target.status) target.status = [];
          if (!target.status.includes('RALLIED')) target.status.push('RALLIED');
          this.triggerSkillEffect([targetCoord], 'buff');
          this.lastActionMessage = `${caster.name} 指揮 ${target.name}：下次攻擊 +4！`;
          this.showDamage(target.position.x, target.position.y, -4); // show as buff
          this.markActionDone(caster.id);
        }
      } else if (this.selectedSkill.id === 'noise_jam') {
        const target = this.getEntityAt(targetCoord.x, targetCoord.y);
        if (target && (target.type === 'ENEMY' || target.type === 'BOSS')) {
          const dx = Math.sign(targetCoord.x - caster.position.x);
          const dy = Math.sign(targetCoord.y - caster.position.y);
          this.playSfx('se_skill_noise');
          this.triggerAttackAnim(caster.id, { x: dx, y: dy }, [target.id]);
          this.triggerSkillEffect([targetCoord], 'debuff');
          const finalDamage = Math.ceil((caster.attack || 2) * 1.5) + dawnBuff + adjBonus + ralliedBonus;
          target.hp -= finalDamage;
          this.showDamage(target.position.x, target.position.y, finalDamage);
          if (!target.status) target.status = [];
          if (!target.status.includes('WEAKENED')) target.status.push('WEAKENED');
          this.markActionDone(caster.id);
        }
      } else if (this.selectedSkill.id === 'panic_broadcast') {
        // AOE: 2 damage + push 1 to all enemies within range 2
        const aoeRange = 2;
        const hitIds: string[] = [];
        const enemies = this.entities.filter(e => (e.type === 'ENEMY' || e.type === 'BOSS') &&
          Math.abs(e.position.x - caster.position.x) + Math.abs(e.position.y - caster.position.y) <= aoeRange);
        const aoeTiles = enemies.map(e => ({ ...e.position }));
        aoeTiles.push({ ...caster.position });
        this.playSfx('se_skill_noise');
        this.triggerSkillEffect(aoeTiles, 'aoe');
        enemies.forEach(target => {
          const dmg = 2 + dawnBuff;
          target.hp -= dmg;
          this.showDamage(target.position.x, target.position.y, dmg);
          hitIds.push(target.id);
          // Push away from caster
          const pdx = Math.sign(target.position.x - caster.position.x);
          const pdy = Math.sign(target.position.y - caster.position.y);
          if (pdx !== 0 || pdy !== 0) this.pushEntity(target.id, { x: pdx, y: pdy });
        });
        if (hitIds.length > 0) this.triggerAttackAnim(caster.id, { x: 0, y: -1 }, hitIds);
        this.triggerShake();
        this.lastActionMessage = `${caster.name} 發動恐慌廣播！影響 ${hitIds.length} 名敵人`;
        this.markActionDone(caster.id);
      } else if (this.selectedSkill.id === 'bat_swing') {
        this.playSfx('se_skill_bat');
        const dx = Math.sign(targetCoord.x - caster.position.x);
        const dy = Math.sign(targetCoord.y - caster.position.y);
        let hitCoords: Coordinate[] = [];
        if (dx !== 0) hitCoords = [{ x: targetCoord.x, y: targetCoord.y - 1 }, { x: targetCoord.x, y: targetCoord.y }, { x: targetCoord.x, y: targetCoord.y + 1 }];
        else if (dy !== 0) hitCoords = [{ x: targetCoord.x - 1, y: targetCoord.y }, { x: targetCoord.x, y: targetCoord.y }, { x: targetCoord.x + 1, y: targetCoord.y }];

        const hitTargetIds: string[] = [];
        hitCoords.forEach(coord => {
          if (coord.x >= 0 && coord.x < this.gridSize.width && coord.y >= 0 && coord.y < this.gridSize.height) {
            const target = this.getEntityAt(coord.x, coord.y);
            if (target && (target.type === 'ENEMY' || target.type === 'BOSS')) {
              hitTargetIds.push(target.id);
              const finalDamage = (caster.attack || 8) + dawnBuff + adjBonus + ralliedBonus;
              target.hp -= finalDamage;
              this.showDamage(coord.x, coord.y, finalDamage);
              this.pushEntity(target.id, { x: dx, y: dy });
            }
          }
        });
        if (hitTargetIds.length > 0) this.triggerAttackAnim(caster.id, { x: dx, y: dy }, hitTargetIds);
        this.triggerSkillEffect(hitCoords, 'slash');
        this.triggerShake();
        this.markActionDone(caster.id);
      } else if (this.selectedSkill.id === 'home_run') {
        const target = this.getEntityAt(targetCoord.x, targetCoord.y);
        if (target && (target.type === 'ENEMY' || target.type === 'BOSS')) {
          const finalDamage = (caster.attack || 8) + 4 + dawnBuff + adjBonus + ralliedBonus;
          const dx = Math.sign(targetCoord.x - caster.position.x);
          const dy = Math.sign(targetCoord.y - caster.position.y);
          this.playSfx('se_skill_bat');
          this.triggerAttackAnim(caster.id, { x: dx, y: dy }, [target.id]);
          this.triggerSkillEffect([targetCoord], 'heavy');
          target.hp -= finalDamage;
          this.showDamage(target.position.x, target.position.y, finalDamage);
          this.triggerShake();
          // Push 3 times with heavier collision (4 dmg)
          for (let i = 0; i < 3; i++) {
            if (this.entities.find(e => e.id === target.id)) {
              this.pushEntityHeavy(target.id, { x: dx, y: dy }, 4);
            }
          }
          this.markActionDone(caster.id);
        }
      }

      // Set cooldown on the skill
      if (skill && skill.cooldown > 0) {
        skill.currentCooldown = skill.cooldown;
      }

      this.selectedSkill = null;
      this.targetingTiles = [];
      this.checkDeaths();

      // Kill chain check
      this.checkKillChain(caster.id, preKillEnemyIds);
    },

    // ===================== Interact with INTERACTABLE =====================

    interactWithEntity(targetId: string) {
      const caster = this.entities.find(e => e.id === this.selectedEntityId);
      const target = this.entities.find(e => e.id === targetId);
      if (!caster || !target || target.type !== 'INTERACTABLE') return;

      this.saveSnapshot();
      this.interactedTargets.push(targetId);

      // Ch1: medkit — heal the interacting unit
      if (targetId.startsWith('medkit')) {
        const healAmount = 15;
        caster.hp = Math.min(caster.maxHp, caster.hp + healAmount);
        this.showDamage(caster.position.x, caster.position.y, -healAmount);
        this.lastActionMessage = `${caster.name} 使用了急救箱！回復 ${healAmount} HP`;
        // Remove the medkit after use
        this.entities = this.entities.filter(e => e.id !== targetId);
      }
      // Ch1: barricade material becomes obstacle
      else if (targetId.startsWith('barricade')) {
        target.type = 'OBSTACLE';
        target.name = '路障';
        target.hp = 15;
        target.maxHp = 15;
        this.lastActionMessage = `${caster.name} 架設了路障！`;
      }
      // Ch2: door switch blocks reinforcements
      else if (targetId === 'door-switch') {
        this.lastActionMessage = '電子門鎖已啟動，切斷了敵方增援路線！';
      }
      // Ch2: control panel
      else if (targetId === 'control-panel') {
        this.lastActionMessage = '已奪回廣播控制台的主控權！';
      }
      // Ch4: safe
      else if (targetId === 'safe-evidence') {
        this.lastActionMessage = '取得了合併協議的原件證據！';
      }
      // Generic
      else {
        this.lastActionMessage = `${caster.name} 啟動了 ${target.name}`;
      }

      this.markActionDone(caster.id);
      this.checkWinLoseCondition();
    },

    // ===================== Movement & combat helpers =====================

    playSfx(id: string) {
      const audio = new Audio(`${import.meta.env.BASE_URL}assets/se/${id}.mp3`);
      audio.volume = 0.5;
      audio.play().catch(() => {});
    },

    triggerShake() {
      this.isShaking = true;
      setTimeout(() => { this.isShaking = false; }, 200);
    },

    triggerSkillEffect(tiles: Coordinate[], type: string) {
      this.skillEffect = { tiles, type };
      setTimeout(() => { this.skillEffect = null; }, 600);
    },

    triggerAttackAnim(attackerId: string, dir: { x: number; y: number }, hitIds: string[]) {
      this.animAttackerId = attackerId;
      this.animAttackDir = dir;
      this.animHitIds = [...hitIds];
      setTimeout(() => {
        this.animAttackerId = null;
        this.animAttackDir = null;
        this.animHitIds = [];
      }, 400);
    },

    getEntityAt(x: number, y: number): Entity | undefined {
      return this.entities.find(e => e.position.x === x && e.position.y === y);
    },

    showDamage(x: number, y: number, damage: number) {
      const id = Math.random().toString(36).substring(2, 9);
      // Count existing texts on this tile for stagger
      const existing = this.damageTexts.filter(dt => dt.x === x && dt.y === y).length;
      // Random spread: fan out horizontally, stagger vertically
      const offsetX = (Math.random() - 0.5) * 40 + existing * 12;
      const delay = existing * 120; // 120ms stagger per number
      const isHeal = damage < 0;
      const isCrit = Math.abs(damage) >= 10;
      this.damageTexts.push({ id, x, y, damage, opacity: 1, offsetY: 0, offsetX, delay, isHeal, isCrit });
      setTimeout(() => { this.damageTexts = this.damageTexts.filter(dt => dt.id !== id); }, 1200 + delay);
    },

    showReward(x: number, y: number, text: string, type: 'kill' | 'chain' | 'bonus' = 'kill', delay = 0) {
      const id = Math.random().toString(36).substring(2, 9);
      this.rewardTexts.push({ id, x, y, text, type, delay });
      setTimeout(() => { this.rewardTexts = this.rewardTexts.filter(rt => rt.id !== id); }, 2000 + delay);
    },

    moveEntity(entityId: string, targetX: number, targetY: number): boolean {
      if (targetX < 0 || targetX >= this.gridSize.width || targetY < 0 || targetY >= this.gridSize.height) return false;
      if (this.getEntityAt(targetX, targetY)) return false;
      const entity = this.entities.find(e => e.id === entityId);
      if (entity) {
        entity.position = { x: targetX, y: targetY };
        return true;
      }
      return false;
    },

    /** Returns preKillEnemyIds for kill chain checking by the caller */
    shieldBash(targetId: string, direction: { x: number; y: number }): string[] {
      const caster = this.entities.find(e => e.id === this.selectedEntityId);
      const target = this.entities.find(e => e.id === targetId);
      if (!target || !caster) return [];
      this.saveSnapshot();
      const preKillEnemyIds = this.entities.filter(e => e.type === 'ENEMY' || e.type === 'BOSS').map(e => e.id);
      this.triggerAttackAnim(caster.id, direction, [targetId]);
      this.triggerShake();
      const dawnBuff = (caster.status && caster.status.includes('DAWN_LIGHT')) ? 10 : 0;
      const adjBonus = this.getAdjacencyBonus(caster);
      const ralliedBonus = this.getRalliedBonus(caster);
      const finalDamage = (caster.attack || 4) + dawnBuff + adjBonus + ralliedBonus;
      target.hp -= finalDamage;
      this.showDamage(target.position.x, target.position.y, finalDamage);
      this.checkDeaths();
      if (this.entities.find(e => e.id === targetId)) this.pushEntity(targetId, direction);
      return preKillEnemyIds;
    },

    pushEntity(targetId: string, direction: { x: number; y: number }): boolean {
      const target = this.entities.find(e => e.id === targetId);
      if (!target) return false;
      const newX = target.position.x + direction.x;
      const newY = target.position.y + direction.y;
      const isOutOfBounds = newX < 0 || newX >= this.gridSize.width || newY < 0 || newY >= this.gridSize.height;
      let collisionEntity = this.getEntityAt(newX, newY);
      if (collisionEntity || isOutOfBounds) {
        this.playSfx('se_push_collision');
        this.triggerShake();
        const collisionDamage = 2;
        target.hp -= collisionDamage;
        this.showDamage(target.position.x, target.position.y, collisionDamage);
        if (collisionEntity) {
          collisionEntity.hp -= collisionDamage;
          this.showDamage(collisionEntity.position.x, collisionEntity.position.y, collisionDamage);
          this.pushEntity(collisionEntity.id, direction);
          collisionEntity = this.getEntityAt(newX, newY);
        }
        if (isOutOfBounds && target.status) {
          if (!target.status.includes('STUN')) target.status.push('STUN');
        }
        this.checkDeaths();
        if (!isOutOfBounds && !this.getEntityAt(newX, newY)) return this.moveEntity(targetId, newX, newY);
        return false;
      } else {
        return this.moveEntity(targetId, newX, newY);
      }
    },

    /** Heavy push variant with custom collision damage (for home_run) */
    pushEntityHeavy(targetId: string, direction: { x: number; y: number }, collisionDmg: number): boolean {
      const target = this.entities.find(e => e.id === targetId);
      if (!target) return false;
      const newX = target.position.x + direction.x;
      const newY = target.position.y + direction.y;
      const isOutOfBounds = newX < 0 || newX >= this.gridSize.width || newY < 0 || newY >= this.gridSize.height;
      const collisionEntity = this.getEntityAt(newX, newY);
      if (collisionEntity || isOutOfBounds) {
        this.triggerShake();
        target.hp -= collisionDmg;
        this.showDamage(target.position.x, target.position.y, collisionDmg);
        if (collisionEntity) {
          collisionEntity.hp -= collisionDmg;
          this.showDamage(collisionEntity.position.x, collisionEntity.position.y, collisionDmg);
        }
        this.checkDeaths();
        return false;
      } else {
        return this.moveEntity(targetId, newX, newY);
      }
    },

    markActionDone(entityId: string) {
      const entity = this.entities.find(e => e.id === entityId);
      if (entity) {
        entity.hasActed = true;
        this.selectedEntityId = null;
        this.selectedSkill = null;
        this.targetingTiles = [];
        this.unitActionPhase = 'IDLE';
        this.preMovementPosition = null;
      }
    },

    // ===================== Turn management =====================

    async endPlayerTurn() {
      if (this.currentTurn !== 'PLAYER' || this.gameState !== 'PLAYING') return;
      this.currentTurn = 'ENEMY';
      this.selectedEntityId = null;
      this.selectedSkill = null;
      this.targetingTiles = [];
      this.unitActionPhase = 'IDLE';
      this.preMovementPosition = null;
      this.isProcessingTurn = true;
      this.history = [];
      // Show enemy phase banner
      this.playSfx('se_turn_switch');
      this.turnPhaseBanner = 'ENEMY';
      await new Promise(r => setTimeout(r, 1400));
      this.turnPhaseBanner = null;
      this.inspectedEntityId = null;
      await this.processEnemyTurn();
    },

    /** Compute enemy intents for Into-the-Breach-style preview */
    computeEnemyIntents() {
      this.enemyIntents = [];
      const players = this.entities.filter(e => e.type === 'PLAYER');
      const enemies = this.entities.filter(e => e.type === 'ENEMY' || e.type === 'BOSS');

      for (const enemy of enemies) {
        // Find nearest player
        let nearestPlayer: Entity | null = null;
        let minDist = 999;
        for (const p of players) {
          const d = Math.abs(p.position.x - enemy.position.x) + Math.abs(p.position.y - enemy.position.y);
          if (d < minDist) { minDist = d; nearestPlayer = p; }
        }

        if (!nearestPlayer) continue;

        // Ch4 boss: summon intent
        if (enemy.type === 'BOSS' && this.currentLevelId === 'chapter-4') {
          this.enemyIntents.push({ entityId: enemy.id, action: 'summon' });
          continue;
        }

        if (minDist <= 1) {
          // Will attack
          const dmg = (enemy.status?.includes('WEAKENED')) ? 0 : (enemy.attack || 3);
          this.enemyIntents.push({
            entityId: enemy.id,
            action: 'attack',
            targetPos: { ...nearestPlayer.position },
            damage: dmg,
          });
        } else {
          // Will move toward player
          const dx = nearestPlayer.position.x - enemy.position.x;
          const dy = nearestPlayer.position.y - enemy.position.y;
          let mx = 0, my = 0;
          if (Math.abs(dx) > Math.abs(dy)) mx = dx > 0 ? 1 : -1;
          else if (dy !== 0) my = dy > 0 ? 1 : -1;
          else if (dx !== 0) mx = dx > 0 ? 1 : -1;
          this.enemyIntents.push({
            entityId: enemy.id,
            action: 'move',
            targetPos: { x: enemy.position.x + mx, y: enemy.position.y + my },
          });
        }
      }
    },

    /** Process environment tile effects at start of player turn */
    processEnvironmentTiles() {
      for (const tile of this.environmentTiles) {
        const entity = this.getEntityAt(tile.x, tile.y);
        if (tile.effect === 'FIRE') {
          if (entity && (entity.type === 'PLAYER' || entity.type === 'ENEMY' || entity.type === 'NPC')) {
            const dmg = 3;
            entity.hp -= dmg;
            this.showDamage(tile.x, tile.y, dmg);
          }
        } else if (tile.effect === 'WATER') {
          if (entity) {
            if (!entity.status) entity.status = [];
            if (!entity.status.includes('WET')) entity.status.push('WET');
          }
        }
      }
      // Fire spreads: each FIRE tile has 25% chance to spread to adjacent empty ground
      const newFires: EnvironmentTile[] = [];
      for (const tile of this.environmentTiles) {
        if (tile.effect === 'FIRE' && Math.random() < 0.25) {
          const dirs = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
          const dir = dirs[Math.floor(Math.random() * dirs.length)]!;
          const nx = tile.x + dir!.x;
          const ny = tile.y + dir!.y;
          if (nx >= 0 && nx < this.gridSize.width && ny >= 0 && ny < this.gridSize.height &&
              !this.environmentTiles.some(t => t.x === nx && t.y === ny)) {
            newFires.push({ x: nx, y: ny, effect: 'FIRE' });
          }
        }
      }
      this.environmentTiles.push(...newFires);
      this.checkDeaths();
    },

    async processEnemyTurn() {
      const level = this.currentLevel;

      // --- Ch4 Boss special: summon guard + place traps ---
      if (this.currentLevelId === 'chapter-4') {
        await this.processCh4BossTurn();
      }

      // --- Regular enemy AI ---
      const combatants = [...this.entities.filter(e => e.type === 'ENEMY' || e.type === 'BOSS')];
      const players = this.entities.filter(e => e.type === 'PLAYER');
      for (const enemy of combatants) {
        if (this.gameState !== 'PLAYING') break;
        if (!this.entities.find(e => e.id === enemy.id)) continue;
        // Ch5 boss: summon logic (preserved)
        if (enemy.type === 'BOSS' && this.currentLevelId === 'chapter-5') {
          const minions = this.entities.filter(e => e.type === 'ENEMY');
          if (minions.length < 2) {
            const neighbors = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
            for (const dir of neighbors) {
              const tx = enemy.position.x + dir.x;
              const ty = enemy.position.y + dir.y;
              if (tx >= 0 && tx < this.gridSize.width && ty >= 0 && ty < this.gridSize.height && !this.getEntityAt(tx, ty)) {
                this.addEntity({
                  id: `summon-${Math.random().toString(36).substr(2, 5)}`,
                  name: '召喚新生', position: { x: tx, y: ty },
                  hp: 10, maxHp: 10, type: 'ENEMY', attack: 3, hasActed: true,
                } as any);
                this.lastActionMessage = '校長召喚了增援！';
                this.triggerShake();
                break;
              }
            }
          } else {
            await this.performSimpleAI(enemy, players);
          }
        }
        // Ch4 boss: skip AI (handled in processCh4BossTurn)
        else if (enemy.type === 'BOSS' && this.currentLevelId === 'chapter-4') {
          // Boss does not move or attack directly
        }
        // Regular enemies
        else {
          await this.performSimpleAI(enemy, players);
        }
        await new Promise(r => setTimeout(r, 400));
      }

      // --- NPC auto-movement (Ch3 escort) ---
      if (this.gameState === 'PLAYING' && level?.winCondition.escortCount) {
        await this.processNPCMovement();
      }
      if (this.gameState !== 'PLAYING') {
        this.isProcessingTurn = false;
        return;
      }

      // --- Advance to next player turn ---
      this.currentTurn = 'PLAYER';
      this.isProcessingTurn = false;
      this.turnNumber++;

      // --- Reinforcements ---
      if (level?.reinforcements) {
        // Ch2: check if door switch was activated (blocks reinforcements)
        const doorBlocked = this.currentLevelId === 'chapter-2' && this.interactedTargets.includes('door-switch');
        if (!doorBlocked) {
          const wave = level.reinforcements.find(r => r.turn === this.turnNumber);
          if (wave) {
            wave.entities.forEach(config => {
              this.addEntity({
                ...config,
                position: { x: config.x, y: config.y },
                status: [],
                hasActed: false,
              } as any);
            });
            this.playSfx('se_reinforcement');
            this.triggerShake();
            this.lastActionMessage = '警戒！敵方增援部隊已進入戰場！';
            this.pushNotification('⚠️ 敵方增援到達！', 'warning');
          }
        }
      }

      // --- Ch3: Nairong joins on turn 3 ---
      if (this.currentLevelId === 'chapter-3' && this.turnNumber === 3) {
        const nairong = this.entities.find(e => e.id === 'player-nairong');
        if (nairong && nairong.type === 'NPC') {
          nairong.type = 'PLAYER';
          nairong.hasActed = false;
          this.lastActionMessage = '王乃蓉加入了戰鬥！';
          this.pushNotification('💪 王乃蓉加入戰鬥！現在可以操作她了', 'success');
          this.triggerShake();
        }
      }

      // --- Ch5: turn 4 event (preserved) ---
      if (this.currentLevelId === 'chapter-5' && this.turnNumber === 4) {
        // Reset player actions before entering story
        this.entities.forEach(e => {
          if (e.type === 'PLAYER') e.hasActed = false;
        });
        this.computeEnemyIntents();
        this.startDialogue('chapter-5_event');
        return;
      }

      // --- Ch4: apply trap damage at start of player turn ---
      if (this.trapTiles.length > 0) {
        for (const trap of this.trapTiles) {
          const entity = this.getEntityAt(trap.x, trap.y);
          if (entity && (entity.type === 'PLAYER' || entity.type === 'NPC')) {
            const dmg = 2;
            entity.hp -= dmg;
            this.showDamage(trap.x, trap.y, dmg);
          }
        }
        this.checkDeaths();
        if (this.gameState !== 'PLAYING') return;
      }

      // --- Environment tile effects ---
      if (this.environmentTiles.length > 0) {
        this.processEnvironmentTiles();
        if (this.gameState !== 'PLAYING') return;
      }

      // --- Ch3: turn 4 fire gimmick ---
      if (this.currentLevelId === 'chapter-3' && this.turnNumber === 4) {
        this.environmentTiles.push(
          { x: 1, y: 1, effect: 'FIRE' },
          { x: 2, y: 1, effect: 'FIRE' },
          { x: 8, y: 1, effect: 'FIRE' },
        );
        this.lastActionMessage = '暴徒縱火了！前方走廊起火！';
        this.pushNotification('🔥 走廊起火！避開火焰格（每回合 3 傷害）', 'warning');
        this.triggerShake();
      }

      // --- Ch4: boss ENRAGED at HP≤25 ---
      if (this.currentLevelId === 'chapter-4') {
        const boss = this.entities.find(e => e.type === 'BOSS');
        if (boss && boss.hp <= 25 && boss.hp > 0 && !boss.status?.includes('ENRAGED')) {
          if (!boss.status) boss.status = [];
          boss.status.push('ENRAGED');
          boss.attack = (boss.attack || 0) + 5;
          this.lastActionMessage = '白狼校長暴怒了！攻擊力大幅提升！';
          this.pushNotification('💥 校長進入暴怒狀態！攻擊力 +5！', 'warning');
          this.triggerShake();
        }
      }

      // --- Ch1: turn 4 rubble collapse ---
      if (this.currentLevelId === 'chapter-1' && this.turnNumber === 4) {
        this.environmentTiles.push(
          { x: 1, y: 2, effect: 'RUBBLE' },
          { x: 6, y: 2, effect: 'RUBBLE' },
        );
        // Rubble damages anyone on those tiles
        for (const tile of this.environmentTiles.filter(t => t.effect === 'RUBBLE')) {
          const ent = this.getEntityAt(tile.x, tile.y);
          if (ent) {
            ent.hp -= 4;
            this.showDamage(tile.x, tile.y, 4);
          }
        }
        this.lastActionMessage = '天花板崩塌！產生瓦礫阻擋通道！';
        this.pushNotification('🪨 天花板崩塌！新的瓦礫阻擋了通道', 'warning');
        this.triggerShake();
        this.checkDeaths();
        if (this.gameState !== 'PLAYING') return;
      }

      // --- Reset player actions + clean up status ---
      this.killChainActive = false;
      this.killChainUsedIds = [];
      this.entities.forEach(e => {
        if (e.type === 'PLAYER') {
          e.hasActed = false;
          // Tick skill cooldowns
          e.skills?.forEach(s => {
            if (s.currentCooldown && s.currentCooldown > 0) s.currentCooldown--;
          });
        }
        // Clear WEAKENED (1 turn duration)
        if (e.status?.includes('WEAKENED')) e.status = e.status.filter(s => s !== 'WEAKENED');
        // Clear GUARDING (1 turn duration)
        if (e.status?.includes('GUARDING')) e.status = e.status.filter(s => s !== 'GUARDING');
      });

      // --- Compute enemy intents for next turn preview ---
      this.computeEnemyIntents();

      // --- Show player phase banner ---
      this.playSfx('se_turn_switch');
      this.turnPhaseBanner = 'PLAYER';
      await new Promise(r => setTimeout(r, 1400));
      this.turnPhaseBanner = null;
      this.inspectedEntityId = null;

      this.checkWinLoseCondition();
    },

    // ===================== Ch4 Boss special turn =====================

    async processCh4BossTurn() {
      const boss = this.entities.find(e => e.type === 'BOSS');
      if (!boss) return;

      // Summon 1 guard at adjacent empty tile
      const neighbors = [
        { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 },
        { x: 1, y: 1 }, { x: -1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: -1 },
      ];
      for (const dir of neighbors) {
        const tx = boss.position.x + dir.x;
        const ty = boss.position.y + dir.y;
        if (tx >= 0 && tx < this.gridSize.width && ty >= 0 && ty < this.gridSize.height && !this.getEntityAt(tx, ty)) {
          this.addEntity({
            id: `guard-s${Math.random().toString(36).substr(2, 5)}`,
            name: '保全',
            position: { x: tx, y: ty },
            hp: 8, maxHp: 8, type: 'ENEMY', attack: 3, status: [], hasActed: true,
          } as any);
          this.lastActionMessage = '白狼校長召喚了保全！';
          this.triggerShake();
          break;
        }
      }

      // Place 2 random trap tiles
      this.trapTiles = [];
      let attempts = 0;
      while (this.trapTiles.length < 2 && attempts < 20) {
        const rx = Math.floor(Math.random() * this.gridSize.width);
        const ry = 3 + Math.floor(Math.random() * (this.gridSize.height - 3)); // only in player area (y>=3)
        if (!this.getEntityAt(rx, ry) && !this.trapTiles.some(t => t.x === rx && t.y === ry)) {
          this.trapTiles.push({ x: rx, y: ry });
        }
        attempts++;
      }
      if (this.trapTiles.length > 0) {
        this.lastActionMessage = '白狼啟動了地板陷阱！注意危險格！';
      }

      await new Promise(r => setTimeout(r, 400));
    },

    // ===================== NPC auto-movement (Ch3) =====================

    async processNPCMovement() {
      const level = this.currentLevel;
      if (!level?.winCondition.escortExit) return;
      const exitY = level.winCondition.escortExit.y;

      // Only move student NPCs (not nairong who might still be NPC)
      const studentNPCs = [...this.entities.filter(e => e.type === 'NPC' && e.id.startsWith('student'))];

      for (const npc of studentNPCs) {
        if (!this.entities.find(e => e.id === npc.id)) continue;

        // Check if at exit row
        if (npc.position.y >= exitY) {
          this.entities = this.entities.filter(e => e.id !== npc.id);
          this.evacuatedCount++;
          this.playSfx('se_evacuate');
          this.lastActionMessage = `學生安全撤離！(${this.evacuatedCount}/${level.winCondition.escortCount})`;
          this.checkWinLoseCondition();
          if (this.gameState !== 'PLAYING') return;
          continue;
        }

        // Move 1 tile toward exit (prefer downward)
        const downY = npc.position.y + 1;
        if (downY < this.gridSize.height && !this.getEntityAt(npc.position.x, downY)) {
          npc.position.y = downY;
        } else {
          // Try diagonal or sideways
          const dirs = Math.random() > 0.5 ? [1, -1] : [-1, 1];
          let moved = false;
          for (const dx of dirs) {
            const nx = npc.position.x + dx;
            const ny = npc.position.y + 1;
            if (nx >= 0 && nx < this.gridSize.width && ny >= 0 && ny < this.gridSize.height && !this.getEntityAt(nx, ny)) {
              npc.position = { x: nx, y: ny };
              moved = true;
              break;
            }
          }
          // If can't move down, try sideways
          if (!moved) {
            for (const dx of dirs) {
              const nx = npc.position.x + dx;
              if (nx >= 0 && nx < this.gridSize.width && !this.getEntityAt(nx, npc.position.y)) {
                npc.position.x = nx;
                break;
              }
            }
          }
        }

        await new Promise(r => setTimeout(r, 150));
      }
    },

    // ===================== Enemy AI =====================

    async performSimpleAI(enemy: Entity, players: Entity[]) {
      const level = this.currentLevel;

      // --- Ch1: enemies push toward breach line ---
      if (level?.loseCondition?.breachLine) {
        const targetY = level.loseCondition.breachLine.y;
        if (enemy.position.y < targetY) {
          // Try to move straight down
          const downOccupant = this.getEntityAt(enemy.position.x, enemy.position.y + 1);
          if (!downOccupant) {
            this.moveEntity(enemy.id, enemy.position.x, enemy.position.y + 1);
          } else if (downOccupant.type === 'PLAYER') {
            // Attack blocking player
            this.triggerAttackAnim(enemy.id, { x: 0, y: 1 }, [downOccupant.id]);
            this.triggerShake();
            const baseDamage = enemy.attack || 2;
            let finalDamage = (enemy.status && enemy.status.includes('WEAKENED')) ? 0 : baseDamage;
            // GUARDING: halve damage, auto-push attacker back
            if (downOccupant.status?.includes('GUARDING')) {
              finalDamage = Math.floor(finalDamage / 2);
              this.pushEntity(enemy.id, { x: 0, y: -1 });
            }
            downOccupant.hp -= finalDamage;
            this.showDamage(downOccupant.position.x, downOccupant.position.y, finalDamage);
            this.checkDeaths();
          } else if (downOccupant.type === 'OBSTACLE') {
            // Attack obstacle
            this.triggerAttackAnim(enemy.id, { x: 0, y: 1 }, [downOccupant.id]);
            const dmg = enemy.attack || 2;
            downOccupant.hp -= dmg;
            this.showDamage(downOccupant.position.x, downOccupant.position.y, dmg);
            this.checkDeaths();
          } else {
            // Blocked by non-attackable, try sideways then down
            const sideDir = Math.random() > 0.5 ? 1 : -1;
            const sideX = enemy.position.x + sideDir;
            if (sideX >= 0 && sideX < this.gridSize.width && !this.getEntityAt(sideX, enemy.position.y)) {
              this.moveEntity(enemy.id, sideX, enemy.position.y);
            } else {
              const otherX = enemy.position.x - sideDir;
              if (otherX >= 0 && otherX < this.gridSize.width && !this.getEntityAt(otherX, enemy.position.y)) {
                this.moveEntity(enemy.id, otherX, enemy.position.y);
              }
            }
          }
          return;
        }
        // Already past breach line — chase nearest player
      }

      // --- Default: chase nearest player ---
      let targetPlayer = null;
      let minDist = 999;
      for (const p of players) {
        const d = Math.abs(p.position.x - enemy.position.x) + Math.abs(p.position.y - enemy.position.y);
        if (d < minDist) { minDist = d; targetPlayer = p; }
      }
      if (targetPlayer) {
        const dx = targetPlayer.position.x - enemy.position.x;
        const dy = targetPlayer.position.y - enemy.position.y;
        let moveDir = { x: 0, y: 0 };
        if (Math.abs(dx) > Math.abs(dy)) moveDir.x = dx > 0 ? 1 : -1;
        else if (dy !== 0) moveDir.y = dy > 0 ? 1 : -1;
        else if (dx !== 0) moveDir.x = dx > 0 ? 1 : -1;
        const targetX = enemy.position.x + moveDir.x;
        const targetY = enemy.position.y + moveDir.y;
        const occupant = this.getEntityAt(targetX, targetY);
        if (!occupant) {
          this.moveEntity(enemy.id, targetX, targetY);
        } else if (occupant.type === 'PLAYER' || occupant.type === 'OBSTACLE') {
          this.triggerAttackAnim(enemy.id, moveDir, [occupant.id]);
          this.triggerShake();
          const baseDamage = enemy.attack || 4;
          let finalDamage = (enemy.status && enemy.status.includes('WEAKENED')) ? 0 : baseDamage;
          // GUARDING: halve damage, auto-push attacker back
          if (occupant.type === 'PLAYER' && occupant.status?.includes('GUARDING')) {
            finalDamage = Math.floor(finalDamage / 2);
            this.pushEntity(enemy.id, { x: -moveDir.x, y: -moveDir.y });
          }
          occupant.hp -= finalDamage;
          this.showDamage(occupant.position.x, occupant.position.y, finalDamage);
          this.checkDeaths();
        }
      }
    },

    // ===================== Death & entity management =====================

    checkDeaths() {
      const dead = this.entities.filter(e => e.hp <= 0);
      // Show kill reward effects for defeated enemies
      dead.forEach((e, i) => {
        if (e.type === 'ENEMY' || e.type === 'BOSS') {
          const isBoss = e.type === 'BOSS';
          this.showReward(e.position.x, e.position.y, `擊破 ${e.name}！`, isBoss ? 'bonus' : 'kill', i * 200);
        }
      });
      this.entities = this.entities.filter(e => e.hp > 0);
      if (this.selectedEntityId && !this.entities.find(e => e.id === this.selectedEntityId)) this.selectedEntityId = null;
      this.checkWinLoseCondition();
    },

    addEntity(entity: Entity) {
      this.entities.push(entity);
    },
  },
});
