<script setup lang="ts">
import { computed, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useGameStore } from '@/stores/gameStore';

const gameStore = useGameStore();

interface TutorialStep {
  title: string;
  text: string;
  icon: string;
  highlight: 'left-panel' | 'right-panel' | 'grid' | 'top-bar' | 'briefing-btn' | 'end-turn' | 'bgm-control' | 'none';
  position: 'center' | 'right' | 'left';
}

const STEPS: TutorialStep[] = [
  {
    title: '歡迎來到向日葵學園',
    text: '這是你的第一場戰鬥。讓我來介紹戰鬥介面的各個部分。\n點擊任意處繼續，或按「跳過教學」直接開始。',
    icon: 'game-icons:scroll-unfurled',
    highlight: 'none',
    position: 'center',
  },
  {
    title: '角色資訊面板',
    text: '左側面板顯示選中角色的詳細資訊：\n• HP（生命值）\n• ATK（攻擊力）\n• DEF（防禦力）\n• 狀態效果\n選擇角色後即可查看。',
    icon: 'game-icons:person',
    highlight: 'left-panel',
    position: 'right',
  },
  {
    title: '技能面板',
    text: '右側面板列出角色的技能。每個技能有：\n• 射程範圍\n• 冷卻回合數\n• 效果說明\n移動後選擇技能進行攻擊或輔助。',
    icon: 'game-icons:magic-swirl',
    highlight: 'right-panel',
    position: 'left',
  },
  {
    title: '戰場地圖',
    text: '中央的格子地圖就是戰場。\n• 藍色單位 = 我方角色\n• 紅色單位 = 敵人\n• 黃色單位 = 可互動物件\n點擊我方角色選擇，再點擊格子移動。',
    icon: 'game-icons:chess-bishop',
    highlight: 'grid',
    position: 'center',
  },
  {
    title: '移動與行動',
    text: '每回合你可以：\n1. 選擇角色 → 移動到目標格\n2. 選擇技能或推撞攻擊\n3. 或選擇「原地待命」跳過移動\n\n你可以先移動 A → 切換到 B → 再回到 A 放技能！',
    icon: 'game-icons:move',
    highlight: 'grid',
    position: 'center',
  },
  {
    title: '任務目標',
    text: '上方顯示當前關卡的勝利目標和進度。\n注意回合數限制和特殊失敗條件！',
    icon: 'game-icons:archery-target',
    highlight: 'top-bar',
    position: 'center',
  },
  {
    title: '作戰簡報',
    text: '按下「作戰簡報」按鈕或 Tab 鍵，可以隨時查看：\n• 勝利/失敗條件\n• 敵方情報\n• 作戰提示',
    icon: 'game-icons:scroll-unfurled',
    highlight: 'briefing-btn',
    position: 'center',
  },
  {
    title: '結束回合',
    text: '所有角色行動完畢後，點擊「結束回合」。\n也可以提前結束回合，讓未行動角色保持待命。',
    icon: 'game-icons:fast-forward-button',
    highlight: 'end-turn',
    position: 'left',
  },
  {
    title: '音樂控制',
    text: '左下角可以調整背景音樂音量或靜音。',
    icon: 'game-icons:speaker',
    highlight: 'bgm-control',
    position: 'right',
  },
  {
    title: '準備好了！',
    text: '教學到此結束。祝你作戰順利！\n記住：善用角色間的配合和地形優勢。',
    icon: 'game-icons:sword-brandish',
    highlight: 'none',
    position: 'center',
  },
];

const currentStep = computed(() => {
  if (gameStore.tutorialStep < 0 || gameStore.tutorialStep >= STEPS.length) return null;
  return STEPS[gameStore.tutorialStep];
});

const isLastStep = computed(() => gameStore.tutorialStep === STEPS.length - 1);
const stepCount = computed(() => `${gameStore.tutorialStep + 1} / ${STEPS.length}`);

const handleNext = () => {
  if (isLastStep.value) {
    gameStore.completeTutorial();
  } else {
    gameStore.nextTutorialStep();
  }
};

const handleSkip = () => {
  gameStore.skipTutorial();
};

// Auto-complete when steps run out
watch(() => gameStore.tutorialStep, (step) => {
  if (step >= STEPS.length) {
    gameStore.completeTutorial();
  }
});

const highlightStyle = computed(() => {
  const step = currentStep.value;
  if (!step || step.highlight === 'none') return {};
  // These are approximate positions — the actual highlight is via CSS classes
  return {};
});

const dialogPosition = computed(() => {
  const step = currentStep.value;
  if (!step) return '';
  if (step.position === 'left') return 'left-8';
  if (step.position === 'right') return 'right-8';
  return 'left-1/2 -translate-x-1/2';
});
</script>

<template>
  <div v-if="currentStep" class="fixed inset-0 z-[100] pointer-events-none">
    <!-- Dimming overlay with highlight cutout -->
    <div class="absolute inset-0 pointer-events-auto" @click="handleNext">
      <!-- Semi-transparent background -->
      <div class="absolute inset-0 bg-black/60"></div>

      <!-- Highlight areas -->
      <div v-if="currentStep.highlight === 'left-panel'"
        class="absolute top-14 left-0 w-[220px] bottom-0 border-2 border-sky-400 rounded-r-lg z-10"
        style="box-shadow: 0 0 30px rgba(56,189,248,0.4), inset 0 0 30px rgba(56,189,248,0.1); background: transparent;">
      </div>
      <div v-if="currentStep.highlight === 'right-panel'"
        class="absolute top-14 right-0 w-[220px] bottom-0 border-2 border-sky-400 rounded-l-lg z-10"
        style="box-shadow: 0 0 30px rgba(56,189,248,0.4), inset 0 0 30px rgba(56,189,248,0.1); background: transparent;">
      </div>
      <div v-if="currentStep.highlight === 'top-bar'"
        class="absolute top-0 left-0 right-0 h-14 border-2 border-sky-400 z-10"
        style="box-shadow: 0 0 30px rgba(56,189,248,0.4); background: transparent;">
      </div>
      <div v-if="currentStep.highlight === 'grid'"
        class="absolute top-14 left-[220px] right-[220px] bottom-0 border-2 border-sky-400 rounded-lg z-10"
        style="box-shadow: 0 0 30px rgba(56,189,248,0.4); background: transparent;">
      </div>
      <div v-if="currentStep.highlight === 'end-turn'"
        class="absolute bottom-4 right-4 w-[200px] h-16 border-2 border-sky-400 rounded-lg z-10"
        style="box-shadow: 0 0 30px rgba(56,189,248,0.4); background: transparent;">
      </div>
      <div v-if="currentStep.highlight === 'bgm-control'"
        class="absolute bottom-4 left-4 w-[200px] h-12 border-2 border-sky-400 rounded-lg z-10"
        style="box-shadow: 0 0 30px rgba(56,189,248,0.4); background: transparent;">
      </div>
      <div v-if="currentStep.highlight === 'briefing-btn'"
        class="absolute top-2 right-[180px] w-[120px] h-10 border-2 border-sky-400 rounded-lg z-10"
        style="box-shadow: 0 0 30px rgba(56,189,248,0.4); background: transparent;">
      </div>
    </div>

    <!-- Tutorial dialogue box -->
    <div class="absolute bottom-24 z-20 pointer-events-auto" :class="dialogPosition"
      style="width: min(520px, calc(100vw - 64px));">
      <div class="rounded-xl overflow-hidden"
        style="background: linear-gradient(180deg, rgba(15,23,42,0.97) 0%, rgba(10,14,26,0.97) 100%); border: 2px solid rgba(56,189,248,0.4); box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 20px rgba(56,189,248,0.15);">
        <!-- Header -->
        <div class="px-5 py-3 border-b flex items-center justify-between"
          style="border-color: rgba(56,189,248,0.2); background: rgba(14,116,144,0.15);">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center"
              style="background: rgba(14,116,144,0.3); border: 1px solid rgba(56,189,248,0.3);">
              <Icon :icon="currentStep.icon" class="w-5 h-5 text-sky-400" />
            </div>
            <span class="font-ui text-base font-bold text-sky-300">{{ currentStep.title }}</span>
          </div>
          <span class="font-ui text-xs text-slate-600 font-bold">{{ stepCount }}</span>
        </div>

        <!-- Body -->
        <div class="px-5 py-4">
          <p class="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{{ currentStep.text }}</p>
        </div>

        <!-- Footer -->
        <div class="px-5 pb-4 flex items-center justify-between">
          <button @click.stop="handleSkip"
            class="text-xs text-slate-600 hover:text-slate-400 font-ui font-bold transition-colors">
            跳過教學
          </button>
          <button @click.stop="handleNext"
            class="px-6 py-2 rounded-lg font-ui font-bold text-sm transition-all active:scale-95"
            style="background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; box-shadow: 0 2px 8px rgba(14,165,233,0.3);">
            {{ isLastStep ? '開始戰鬥！' : '下一步' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
