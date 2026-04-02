<script setup lang="ts">
import { computed, watch } from 'vue';
import { useGameStore } from '@/stores/gameStore';

const gameStore = useGameStore();

const currentLine = computed(() => {
  return gameStore.activeDialogues[gameStore.currentDialogueIndex];
});

const backgroundUrl = computed(() => {
  if (!gameStore.currentBackground) return '';
  return `${import.meta.env.BASE_URL}assets/backgrounds/${gameStore.currentBackground}.png`;
});

const cgUrl = computed(() => {
  if (!gameStore.currentCg) return '';
  return `${import.meta.env.BASE_URL}assets/cg/${gameStore.currentCg}.png`;
});

// ── Portrait image mapping ──
// Maps Chinese portrait string → file path suffix
const PORTRAIT_MAP: Record<string, string> = {
  // 阿典
  '阿典 (冷靜)': 'a_dian_calm', '阿典 (通訊)': 'a_dian_radio',
  '阿典 (思索)': 'a_dian_think', '阿典 (決心)': 'a_dian_resolve',
  '阿典 (戰鬥)': 'a_dian_battle', '阿典 (突入)': 'a_dian_breach',
  '阿典 (關心)': 'a_dian_concern', '阿典 (苦笑)': 'a_dian_wry',
  '阿典 (微笑)': 'a_dian_smile', '阿典 (絕望)': 'a_dian_despair',
  // 雅晴
  '雅晴 (通訊)': 'ya_qing_radio', '雅晴 (指揮)': 'ya_qing_command',
  '雅晴 (嚴肅)': 'ya_qing_serious', '雅晴 (焦急)': 'ya_qing_anxious',
  '雅晴 (低語)': 'ya_qing_whisper', '雅晴 (冷靜)': 'ya_qing_calm',
  '雅晴 (震怒)': 'ya_qing_fury', '雅晴 (勝利)': 'ya_qing_victory',
  '雅晴 (微笑)': 'ya_qing_smile', '雅晴 (決死)': 'ya_qing_laststand',
  '雅晴 (動搖)': 'ya_qing_shaken', '雅晴 (喘息)': 'ya_qing_h_panting',
  '雅晴 (沉醉)': 'ya_qing_ecstasy', '雅晴 (屈辱)': 'ya_qing_humiliated',
  // 萱萱
  '萱萱 (驚恐)': 'xuan_xuan_scared', '萱萱 (焦急)': 'xuan_xuan_anxious',
  '萱萱 (擔憂)': 'xuan_xuan_worry', '萱萱 (廣播)': 'xuan_xuan_broadcast',
  '萱萱 (釋然)': 'xuan_xuan_relief', '萱萱 (微笑)': 'xuan_xuan_smile',
  '萱萱 (羞澀)': 'xuan_xuan_shy', '萱萱 (喘息)': 'xuan_xuan_h_panting',
  '萱萱 (沉醉)': 'xuan_xuan_ecstasy', '萱萱 (屈辱)': 'xuan_xuan_humiliated',
  // 乃蓉
  '乃蓉 (死守)': 'nai_rong_hold', '乃蓉 (喘息)': 'nai_rong_panting',
  '乃蓉 (不爽)': 'nai_rong_annoyed', '乃蓉 (決心)': 'nai_rong_resolve',
  '乃蓉 (戰鬥)': 'nai_rong_battle', '乃蓉 (焦急)': 'nai_rong_anxious',
  '乃蓉 (微笑)': 'nai_rong_smile', '乃蓉 (羞紅)': 'nai_rong_blushing',
  '乃蓉 (沉醉)': 'nai_rong_ecstasy', '乃蓉 (屈辱)': 'nai_rong_humiliated',
  // 校長
  '校長 (廣播)': 'principal_broadcast', '校長 (冷笑)': 'principal_sneer',
  '校長 (驚恐)': 'principal_panic',
  // 赤星 / 系統
  '赤星學生': 'redstar_generic',
};

const portraitUrl = computed(() => {
  if (!currentLine.value) return '';
  const key = currentLine.value.portrait;
  if (!key || key === '系統') return '';
  const id = PORTRAIT_MAP[key];
  if (!id) return '';
  return `${import.meta.env.BASE_URL}assets/characters/char_${id}.png`;
});

// ── SFX playback ──
watch(() => gameStore.currentDialogueIndex, () => {
  const line = gameStore.activeDialogues[gameStore.currentDialogueIndex];
  if (line?.sfx) {
    const audio = new Audio(`${import.meta.env.BASE_URL}assets/se/se_${line.sfx}.mp3`);
    audio.volume = 0.6;
    audio.play().catch(() => {});
  }
});

const handleNext = () => {
  gameStore.nextDialogueLine();
};
</script>

<template>
  <div
    v-if="gameStore.gameState === 'STORY' && currentLine"
    class="fixed inset-0 z-[60] flex flex-col justify-end cursor-pointer select-none"
    @click="handleNext"
  >
    <!-- Scene Background -->
    <div class="absolute inset-0 bg-black">
      <img
        v-if="backgroundUrl"
        :src="backgroundUrl"
        :key="gameStore.currentBackground"
        class="w-full h-full object-cover transition-opacity duration-700"
        alt=""
        @error="($event.target as HTMLImageElement).style.display = 'none'"
      />
    </div>

    <!-- Event CG Overlay -->
    <Transition name="cg-fade">
      <div v-if="cgUrl" class="absolute inset-0 z-[1]">
        <img
          :src="cgUrl"
          :key="gameStore.currentCg ?? undefined"
          class="w-full h-full object-cover"
          alt=""
          @error="($event.target as HTMLImageElement).style.display = 'none'"
        />
      </div>
    </Transition>

    <!-- Dim overlay for readability -->
    <div class="absolute inset-0 z-[2] bg-black/40 backdrop-blur-sm"></div>

    <!-- Portrait Area -->
    <div class="relative z-[3] flex justify-between items-end h-full px-12 pb-48">
      <!-- Left Portrait -->
      <div
        v-if="currentLine.position === 'left'"
        class="w-72 h-[500px] flex flex-col items-center justify-end animate-fade-in-up"
      >
        <img
          v-if="portraitUrl"
          :src="portraitUrl"
          :key="currentLine.portrait"
          class="w-full h-full object-contain object-bottom drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          alt=""
          @error="($event.target as HTMLImageElement).style.display = 'none'"
        />
        <div v-else class="w-full h-full bg-gradient-to-t from-blue-900/60 to-transparent border-b-8 border-blue-500 flex items-center justify-center text-white font-black italic text-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <span class="mt-auto mb-8">{{ currentLine.portrait }}</span>
        </div>
      </div>

      <!-- Right Portrait -->
      <div
        v-if="currentLine.position === 'right'"
        class="w-72 h-[500px] flex flex-col items-center justify-end animate-fade-in-up ml-auto"
      >
        <img
          v-if="portraitUrl"
          :src="portraitUrl"
          :key="currentLine.portrait"
          class="w-full h-full object-contain object-bottom drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          alt=""
          @error="($event.target as HTMLImageElement).style.display = 'none'"
        />
        <div v-else class="w-full h-full bg-gradient-to-t from-red-900/60 to-transparent border-b-8 border-red-500 flex items-center justify-center text-white font-black italic text-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <span class="mt-auto mb-8">{{ currentLine.portrait }}</span>
        </div>
      </div>
    </div>

    <!-- Dialogue Box Container -->
    <div class="relative z-[3] h-72 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-900/90 p-10 border-t-4 border-blue-600 shadow-[0_-20px_100px_rgba(0,0,0,0.8)]">
      <div class="max-w-5xl mx-auto h-full flex flex-col relative">

        <!-- Speaker Name Tag -->
        <div class="absolute -top-16 left-0 bg-blue-600 text-white px-10 py-3 font-black skew-x-[-15deg] shadow-2xl border-l-8 border-white">
          <span class="skew-x-[15deg] inline-block text-2xl tracking-widest uppercase">{{ currentLine.speaker }}</span>
        </div>

        <!-- Text Content -->
        <div class="mt-6 text-slate-100 text-3xl leading-relaxed tracking-wide font-bold drop-shadow-md">
          {{ currentLine.text }}
        </div>

        <!-- Next Indicator -->
        <div class="mt-auto flex justify-end animate-pulse">
          <span class="text-blue-400 font-black text-sm tracking-[0.3em]">點擊繼續 ▼</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.cg-fade-enter-active {
  transition: opacity 0.8s ease-out;
}
.cg-fade-leave-active {
  transition: opacity 0.4s ease-in;
}
.cg-fade-enter-from,
.cg-fade-leave-to {
  opacity: 0;
}
</style>
