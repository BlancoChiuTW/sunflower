<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '@/stores/gameStore';

const gameStore = useGameStore();

const currentDialogue = computed(() => {
  if (gameStore.activeDialogues.length === 0) return null;
  return gameStore.activeDialogues[gameStore.currentDialogueIndex];
});

const handleNext = () => {
  gameStore.nextDialogueLine();
};
</script>

<template>
  <div
    v-if="gameStore.currentDialogueId && currentDialogue"
    class="fixed inset-0 z-50 flex flex-col justify-end bg-black/30 backdrop-blur-sm transition-all duration-500 cursor-pointer"
    @click="handleNext"
  >
    <!-- Portrait Area (Mockups) -->
    <div class="flex justify-between items-end h-full px-20 pb-40">
      <div
        v-if="currentDialogue.position === 'left'"
        class="w-64 h-96 bg-gradient-to-t from-slate-400/50 to-transparent border-b-4 border-blue-400 flex items-center justify-center text-white font-bold italic text-xl animate-fade-in-up"
      >
        {{ currentDialogue.portrait }}
      </div>
      <div
        v-if="currentDialogue.position === 'right'"
        class="w-64 h-96 bg-gradient-to-t from-slate-400/50 to-transparent border-b-4 border-red-400 flex items-center justify-center text-white font-bold italic text-xl animate-fade-in-up"
      >
        {{ currentDialogue.portrait }}
      </div>
    </div>

    <!-- Dialogue Box -->
    <div class="relative h-64 bg-gradient-to-t from-black via-black/90 to-black/70 p-8 border-t-4 border-blue-900 shadow-[0_-10px_50px_rgba(0,0,0,0.5)]">
      <div class="max-w-4xl mx-auto h-full flex flex-col">
        <!-- Speaker Name Tag -->
        <div class="absolute -top-6 left-1/4 bg-blue-700 text-white px-8 py-2 font-bold skew-x-[-12deg] shadow-lg border-l-4 border-white">
          <span class="skew-x-[12deg] inline-block text-xl tracking-widest">{{ currentDialogue.speaker }}</span>
        </div>

        <!-- Text Area -->
        <div class="mt-4 text-white text-2xl leading-relaxed tracking-wide font-medium">
          {{ currentDialogue.text }}
        </div>

        <!-- Next Indicator -->
        <div class="mt-auto flex justify-end animate-bounce">
          <span class="text-blue-400 font-bold text-sm tracking-widest">▼ CLICK TO CONTINUE</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
