<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import MainMenu from './components/MainMenu.vue';
import BattleGrid from './components/BattleGrid.vue';
import DialogueBox from './components/DialogueBox.vue';
import PauseMenu from './components/PauseMenu.vue';
import SaveLoadMenu from './components/SaveLoadMenu.vue';
import { useGameStore } from './stores/gameStore';

const gameStore = useGameStore();

const backgroundUrl = computed(() => {
  if (!gameStore.currentBackground) return '';
  return `/assets/backgrounds/${gameStore.currentBackground}.png`;
});

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    gameStore.togglePause();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <main class="relative w-full h-full overflow-hidden bg-slate-950">
    <MainMenu v-if="gameStore.gameState === 'MENU'" />

    <template v-else>
      <!-- Scene background (behind battle grid) -->
      <div v-if="backgroundUrl && gameStore.gameState !== 'END_CREDITS'" class="absolute inset-0 z-0">
        <img
          :src="backgroundUrl"
          :key="gameStore.currentBackground"
          class="w-full h-full object-cover opacity-30 transition-opacity duration-700"
          alt=""
          @error="($event.target as HTMLImageElement).style.display = 'none'"
        />
      </div>

      <BattleGrid />
      <DialogueBox v-if="gameStore.gameState === 'STORY'" />
      <PauseMenu v-if="gameStore.isPaused && !gameStore.showSaveLoadMenu" />

      <!-- BGM controls are inside BattleGrid.vue -->
    </template>

    <!-- Overlays -->
    <SaveLoadMenu v-if="gameStore.showSaveLoadMenu" />

    <!-- Global End Game Overlay (End Credits) -->
    <div v-if="gameStore.gameState === 'END_CREDITS'"
      class="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center text-white animate-fade-in"
    >
      <div class="text-center max-w-2xl">
        <h2 class="text-6xl font-black text-blue-500 mb-8 italic uppercase tracking-tighter">End of Phase 1</h2>
        <p class="text-2xl font-bold text-slate-400 mb-12 leading-relaxed">
          黎明已經到來，向日葵學園的危機暫時解除。<br>
          感謝您參與本次「反併吞行動」。
        </p>

        <div class="space-y-4 mb-16">
          <div class="text-sm font-black text-slate-600 uppercase tracking-[0.5em]">Developed by</div>
          <div class="text-xl font-bold">SUNFLOWER PROTOCOL DEV TEAM</div>
        </div>

        <button
          @click="gameStore.resetGame()"
          class="bg-white text-black px-12 py-4 rounded-xl font-black text-xl hover:bg-blue-500 hover:text-white transition-all active:scale-95 shadow-xl uppercase tracking-widest"
        >
          Return to Terminal
        </button>
      </div>
    </div>
  </main>
</template>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #020617; /* slate-950 */
}

.animate-fade-in {
  animation: fadeIn 2s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
