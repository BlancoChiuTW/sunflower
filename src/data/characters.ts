import type { Skill, EntityType } from '@/types/game';

export interface CharacterTemplate {
  name: string;
  job: string;
  hp: number;
  maxHp: number;
  attack: number;
  skills: Skill[];
  type: EntityType;
}

export const characterTemplates: Record<string, CharacterTemplate> = {
  // ── 阿典：前排主力，高攻中血，擊退控場 ──
  'a-dian': {
    name: '阿典',
    job: '糾察隊長',
    hp: 30,
    maxHp: 30,
    attack: 6,
    skills: [
      { id: 'baton_strike', name: '警棍突刺', description: '造成 ATK+2 傷害並擊退 2 格', type: 'target', range: 1, cooldown: 0 },
      { id: 'shield_wall', name: '盾牌防禦', description: '自身防禦姿態：受傷減半，近戰攻擊者被擊退', type: 'self', range: 0, cooldown: 2 }
    ],
    type: 'PLAYER'
  },
  // ── 雅晴：後排輔助，補血+遠程指揮 ──
  'ya-qing': {
    name: '林雅晴',
    job: '學生會長',
    hp: 20,
    maxHp: 20,
    attack: 3,
    skills: [
      { id: 'heal', name: '急救包', description: '恢復 11 點 HP（射程 2）', type: 'target', range: 2, cooldown: 1 },
      { id: 'command_rally', name: '指揮號令', description: '指定友軍下次攻擊 +4 傷害（射程 3）', type: 'target', range: 3, cooldown: 2 }
    ],
    type: 'PLAYER'
  },
  // ── 乃蓉：重裝戰士，高攻高血，範圍橫掃 ──
  'nai-rong': {
    name: '王乃蓉',
    job: '體育部長',
    hp: 40,
    maxHp: 40,
    attack: 8,
    skills: [
      { id: 'bat_swing', name: '球棒揮擊', description: '橫掃前方 3 格造成 ATK 傷害並擊退', type: 'target', range: 1, cooldown: 1 },
      { id: 'home_run', name: '全壘打', description: '單體 ATK+4 傷害，擊退 3 格（碰撞 4 傷害）', type: 'target', range: 1, cooldown: 3 }
    ],
    type: 'PLAYER'
  },
  // ── 萱萱：遠程控制，弱化敵人攻擊力 ──
  'xuan-xuan': {
    name: '陳萱萱',
    job: '廣播社長',
    hp: 16,
    maxHp: 16,
    attack: 2,
    skills: [
      { id: 'noise_jam', name: '噪音干擾', description: '造成 3 傷害 + 弱化（攻擊歸零 1 回合）', type: 'target', range: 3, cooldown: 1 },
      { id: 'panic_broadcast', name: '恐慌廣播', description: '範圍 2 格內全敵人 2 傷害 + 擊退 1 格', type: 'self', range: 0, cooldown: 3 }
    ],
    type: 'PLAYER'
  }
};
