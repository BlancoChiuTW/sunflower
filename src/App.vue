<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';
import MainMenu from './components/MainMenu.vue';
import BattleGrid from './components/BattleGrid.vue';
import DialogueBox from './components/DialogueBox.vue';
import PauseMenu from './components/PauseMenu.vue';
import SaveLoadMenu from './components/SaveLoadMenu.vue';
import TutorialOverlay from './components/TutorialOverlay.vue';
import { useGameStore } from './stores/gameStore';

const gameStore = useGameStore();

const backgroundUrl = computed(() => {
  if (!gameStore.currentBackground) return '';
  return `${import.meta.env.BASE_URL}assets/backgrounds/${gameStore.currentBackground}.png`;
});

// ══════════════════════════════════════════
//  GLOBAL BGM AUDIO SYSTEM (with crossfade)
// ══════════════════════════════════════════
const bgmAudio = ref<HTMLAudioElement | null>(null);
const FADE_DURATION = 800; // ms
let fadeInterval: ReturnType<typeof setInterval> | null = null;

const getTargetVolume = () => gameStore.bgmMuted ? 0 : gameStore.bgmVolume;

const fadeOut = (audio: HTMLAudioElement): Promise<void> => {
  return new Promise(resolve => {
    if (fadeInterval) clearInterval(fadeInterval);
    const step = audio.volume / (FADE_DURATION / 30);
    if (step <= 0) { audio.pause(); resolve(); return; }
    fadeInterval = setInterval(() => {
      audio.volume = Math.max(0, audio.volume - step);
      if (audio.volume <= 0.01) {
        audio.volume = 0;
        audio.pause();
        if (fadeInterval) clearInterval(fadeInterval);
        fadeInterval = null;
        resolve();
      }
    }, 30);
  });
};

const fadeIn = (audio: HTMLAudioElement, targetVol: number) => {
  if (fadeInterval) clearInterval(fadeInterval);
  audio.volume = 0;
  audio.play().catch(() => {});
  const step = targetVol / (FADE_DURATION / 30);
  if (step <= 0) { audio.volume = targetVol; return; }
  fadeInterval = setInterval(() => {
    audio.volume = Math.min(targetVol, audio.volume + step);
    if (audio.volume >= targetVol - 0.01) {
      audio.volume = targetVol;
      if (fadeInterval) clearInterval(fadeInterval);
      fadeInterval = null;
    }
  }, 30);
};

// Load saved BGM settings
onMounted(() => {
  const savedVol = localStorage.getItem('bgmVolume');
  const savedMute = localStorage.getItem('bgmMuted');
  if (savedVol !== null) gameStore.bgmVolume = parseFloat(savedVol);
  if (savedMute !== null) gameStore.bgmMuted = savedMute === 'true';
  // Play menu BGM on start
  if (gameStore.gameState === 'MENU' && !gameStore.currentBgm) {
    gameStore.currentBgm = 'bgm_menu';
  }
});

watch(() => gameStore.currentBgm, async (newBgm, oldBgm) => {
  const audio = bgmAudio.value;
  if (!audio) return;
  if (newBgm === oldBgm) return;

  // Fade out old BGM
  if (oldBgm && !audio.paused) {
    await fadeOut(audio);
  }

  // Play new BGM or stop
  if (newBgm) {
    audio.src = `${import.meta.env.BASE_URL}assets/bgm/${newBgm}.mp3`;
    fadeIn(audio, getTargetVolume());
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

// Set menu BGM when returning to menu
watch(() => gameStore.gameState, (state) => {
  if (state === 'MENU') {
    gameStore.currentBgm = 'bgm_menu';
  } else if (state === 'END_CREDITS') {
    gameStore.currentBgm = '';
  }
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

    <!-- Global BGM Audio -->
    <audio ref="bgmAudio" loop></audio>

    <!-- Overlays -->
    <TutorialOverlay />
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
