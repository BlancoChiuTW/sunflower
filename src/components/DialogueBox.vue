<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '@/stores/gameStore';

const gameStore = useGameStore();

const currentLine = computed(() => {
  return gameStore.activeDialogues[gameStore.currentDialogueIndex];
});

const backgroundUrl = computed(() => {
  if (!gameStore.currentBackground) return '';
  return `/assets/backgrounds/${gameStore.currentBackground}.png`;
});

const cgUrl = computed(() => {
  if (!gameStore.currentCg) return '';
  return `/assets/cg/${gameStore.currentCg}.png`;
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
        class="w-72 h-[500px] bg-gradient-to-t from-blue-900/60 to-transparent border-b-8 border-blue-500 flex flex-col items-center justify-center text-white font-black italic text-2xl animate-fade-in-up shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        <div class="mt-auto mb-8">{{ currentLine.portrait }}</div>
      </div>

      <!-- Right Portrait -->
      <div
        v-if="currentLine.position === 'right'"
        class="w-72 h-[500px] bg-gradient-to-t from-red-900/60 to-transparent border-b-8 border-red-500 flex flex-col items-center justify-center text-white font-black italic text-2xl animate-fade-in-up shadow-[0_20px_50px_rgba(0,0,0,0.5)] ml-auto"
      >
        <div class="mt-auto mb-8">{{ currentLine.portrait }}</div>
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
          <span class="text-blue-400 font-black text-sm tracking-[0.3em] uppercase">Click to Synchronize Memory ▼</span>
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
