<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore';

const gameStore = useGameStore();

const handleResume = () => {
  gameStore.togglePause();
};

const handleSave = () => {
  gameStore.showSaveLoadMenu = 'save';
};

const handleLoad = () => {
  gameStore.showSaveLoadMenu = 'load';
};

const handleMainMenu = () => {
  if (confirm('確定要回到主選單嗎？未儲存的進度將會遺失。')) {
    gameStore.resetGame();
  }
};
</script>

<template>
  <div class="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-fade-in">
    <div class="bg-slate-900 border-2 border-slate-700 p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] w-80 flex flex-col gap-6">
      <h2 class="text-3xl font-black text-center text-white tracking-widest italic uppercase border-b-2 border-slate-800 pb-4">
        Paused <span class="text-blue-500">暫停</span>
      </h2>

      <div class="flex flex-col gap-3">
        <button 
          @click="handleResume"
          class="bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-black text-lg transition-all active:scale-95 shadow-[0_4px_0_rgb(30,58,138)] hover:shadow-none hover:translate-y-1 uppercase"
        >
          Resume 繼續
        </button>

        <button 
          @click="handleSave"
          class="bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-black text-lg transition-all active:scale-95 border-b-4 border-slate-900 uppercase"
        >
          Save 儲存
        </button>

        <button 
          @click="handleLoad"
          class="bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-black text-lg transition-all active:scale-95 border-b-4 border-slate-900 uppercase"
        >
          Load 讀取
        </button>

        <button 
          @click="handleMainMenu"
          class="mt-4 text-slate-500 hover:text-red-400 font-bold uppercase tracking-widest transition-colors text-xs text-center"
        >
          Return to Menu 回主選單
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(1.05); }
  to { opacity: 1; transform: scale(1); }
}
</style>
