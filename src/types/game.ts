export interface Coordinate {
  x: number;
  y: number;
}

export type EntityType = 'PLAYER' | 'ENEMY' | 'OBSTACLE' | 'BOSS' | 'NPC' | 'INTERACTABLE';

export type StatusEffect = 'NORMAL' | 'ARMOR_BREAK' | 'STUN' | 'WET' | 'WEAKENED' | 'DAWN_LIGHT' | 'GUARDING' | 'RALLIED' | 'ENRAGED';

export type TileEffect = 'WATER' | 'FIRE' | 'RUBBLE' | 'ALARM' | 'EXIT';

export type UnitActionPhase = 'IDLE' | 'MOVING' | 'ACTION_SELECT' | 'TARGETING';

export interface EnvironmentTile {
  x: number;
  y: number;
  effect: TileEffect;
  hp?: number; // for destructible tiles like RUBBLE
}

export interface EnemyIntent {
  entityId: string;
  action: 'attack' | 'move' | 'summon' | 'buff';
  targetPos?: Coordinate;
  damage?: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  type: 'target' | 'aoe' | 'self';
  range: number;
  cooldown: number;
  currentCooldown?: number;
}

export interface Entity {
  id: string;
  name: string;
  position: Coordinate;
  hp: number;
  maxHp: number;
  type: EntityType;
  hasActed?: boolean;
  skills?: Skill[];
  attack?: number;
  status?: StatusEffect[];
  intent?: 'attack' | 'move' | 'summon' | 'buff';
  intentTarget?: Coordinate;
}

export interface Character extends Entity {
  def: number;
}

export interface Obstacle extends Entity {
  isDestructible: boolean;
}

export interface DamageText {
  id: string;
  x: number;
  y: number;
  damage: number;
  opacity: number;
  offsetY: number;
  offsetX: number;      // random horizontal spread
  delay: number;        // stagger delay in ms
  isHeal: boolean;      // heal vs damage for color
  isCrit: boolean;      // large damage emphasis
}

export interface RewardText {
  id: string;
  x: number;
  y: number;
  text: string;
  type: 'kill' | 'chain' | 'bonus';
  delay: number;
}

export interface Dialogue {
  speaker: string;
  text: string;
  portrait: string;
  position: 'left' | 'right';
  background?: string;
  cg?: string;
  bgm?: string;
  sfx?: string;
  effect?: 'light_flicker' | 'shake' | 'fade_out';
  action?: string;
}

export interface EntityConfig {
  id: string;
  name: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  type: EntityType;
  attack?: number;
  def?: number;
  skills?: Skill[];
}

export interface LevelConfig {
  id: string;
  title: string;
  gridSize: { width: number; height: number };
  background?: string;
  bgm?: string;
  entities: EntityConfig[];
  openingStory: Dialogue[];
  winCondition: {
    surviveTurns?: number;
    defeatAll?: boolean;
    defeatBoss?: boolean;
    interactTargets?: string[];
    escortCount?: number;
    escortExit?: Coordinate;
  };
  loseCondition?: {
    breachLine?: { y: number; maxBreaches: number };
    requiredAlive?: string[];
    npcLost?: string[];
    turnLimit?: number;
  };
  reinforcements?: { turn: number; entities: EntityConfig[] }[];
  environmentTiles?: EnvironmentTile[];
  /** Mission briefing shown at battle start */
  missionBriefing?: {
    objective: string;       // 主要目標
    tips: string[];          // 操作提示
    failCondition?: string;  // 失敗條件
  };
}
