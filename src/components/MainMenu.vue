<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '@/stores/gameStore';

const gameStore = useGameStore();

const hasAnySaveData = computed(() => {
  for (let i = 1; i <= 99; i++) {
    if (localStorage.getItem(`game_save_${i}`)) return true;
  }
  return false;
});

const handleStart = () => {
  gameStore.initLevel('chapter-1');
};

const handleLoadMenu = () => {
  gameStore.showSaveLoadMenu = 'load';
};

const handlePlaceholder = (feature: string) => {
  alert(`${feature} 功能開發中，敬請期待！`);
};
</script>

<template>
  <div class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-slate-100 overflow-hidden">
    <!-- Animated Background Effect -->
    <div class="absolute inset-0 opacity-20 pointer-events-none">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px] animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600 rounded-full blur-[120px] animate-pulse delay-700"></div>
    </div>

    <!-- Title Area -->
    <div class="relative mb-16 text-center animate-fade-in">
      <div class="text-xl font-black tracking-[0.5em] text-blue-500 uppercase mb-2">Academic Defense</div>
      <h1 class="text-8xl font-black tracking-tighter italic uppercase">
        Sunflower <span class="text-blue-600">Protocol</span>
      </h1>
      <div class="mt-4 text-2xl font-bold tracking-widest text-slate-400">向日葵學園:反併吞行動</div>
    </div>

    <!-- Menu Buttons -->
    <div class="relative flex flex-col gap-4 w-80 animate-fade-in-up delay-300">
      <button 
        @click="handleStart"
        class="group relative overflow-hidden bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-xl font-black text-xl transition-all active:scale-95 shadow-[0_8px_0_rgb(30,58,138)] hover:shadow-none hover:translate-y-2 uppercase tracking-tighter"
      >
        <span class="relative z-10">Start Operation 開始行動</span>
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      </button>

      <button 
        @click="handleLoadMenu"
        :disabled="!hasAnySaveData"
        class="bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:grayscale px-8 py-4 rounded-xl font-black text-xl transition-all active:scale-95 border-b-4 border-slate-900 uppercase tracking-tighter"
      >
        Restore Memory 讀取存檔
      </button>

      <button 
        @click="handlePlaceholder('Gallery')"
        class="bg-slate-800 hover:bg-slate-700 px-8 py-4 rounded-xl font-black text-xl transition-all active:scale-95 border-b-4 border-slate-900 uppercase tracking-tighter"
      >
        Mission Gallery 劇情回顧
      </button>

      <button 
        @click="handlePlaceholder('Exit')"
        class="mt-4 text-slate-500 hover:text-slate-300 font-bold uppercase tracking-widest transition-colors text-sm"
      >
        Terminate Session 終止連線
      </button>
    </div>

    <!-- Footer -->
    <div class="absolute bottom-8 text-slate-600 font-bold text-xs tracking-widest uppercase text-center">
      &copy; 2026 SUNFLOWER PROTOCOL // PHASE 1 EXPERIMENT<br>
      <span class="text-[10px] opacity-50">Local Storage Save System Active</span>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 1s ease-out forwards;
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
