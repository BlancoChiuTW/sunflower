<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '@/stores/gameStore';

const gameStore = useGameStore();

const title = computed(() => {
  return gameStore.showSaveLoadMenu === 'save' ? 'Save Data 儲存進度' : 'Load Data 讀取進度';
});

const handleClose = () => {
  gameStore.showSaveLoadMenu = null;
};

const handleSlotClick = (slot: any) => {
  const mode = gameStore.showSaveLoadMenu;
  if (mode === 'save') {
    if (slot.metadata) {
      if (!confirm(`確定要覆蓋存檔 ${slot.id} 嗎？\n現有進度：${slot.metadata.levelName}`)) {
        return;
      }
    }
    gameStore.saveGame(slot.id);
    // Refresh UI implicitly via getter
  } else if (mode === 'load') {
    if (slot.metadata) {
      gameStore.loadGame(slot.id);
    }
  }
};
</script>

<template>
  <div 
    class="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl animate-fade-in"
    @click.self="handleClose"
  >
    <!-- Main Panel -->
    <div class="bg-slate-900 border-2 border-slate-700 w-full max-w-4xl h-[80vh] rounded-3xl shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden">
      
      <!-- Header -->
      <div class="p-8 border-b-2 border-slate-800 flex justify-between items-center bg-slate-900/50">
        <h2 class="text-4xl font-black text-white italic tracking-tighter uppercase">
          {{ title }}
        </h2>
        <button 
          @click="handleClose"
          class="text-slate-500 hover:text-white transition-colors text-4xl font-bold"
        >
          &times;
        </button>
      </div>

      <!-- Slot List -->
      <div class="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-4 custom-scrollbar">
        <div 
          v-for="slot in gameStore.saveSlots" 
          :key="slot.id"
          @click="handleSlotClick(slot)"
          class="group relative bg-slate-800/50 border-2 rounded-2xl p-6 transition-all duration-300 flex flex-col gap-2 cursor-pointer"
          :class="[
            slot.metadata 
              ? 'border-slate-600 hover:border-blue-500 hover:bg-slate-800' 
              : (gameStore.showSaveLoadMenu === 'save' ? 'border-dashed border-slate-700 hover:border-slate-500' : 'border-slate-800 opacity-40 cursor-not-allowed')
          ]"
        >
          <!-- Slot Number -->
          <div class="absolute top-4 right-6 text-4xl font-black text-slate-700 group-hover:text-blue-900/30 transition-colors">
            {{ String(slot.id).padStart(2, '0') }}
          </div>

          <div v-if="slot.metadata" class="relative z-10">
            <div class="text-blue-400 font-black text-xs uppercase tracking-widest mb-1">Synchronized Memory</div>
            <div class="text-xl font-bold text-white mb-1">{{ slot.metadata.levelName }}</div>
            <div class="flex gap-4 text-sm text-slate-400 font-bold">
              <span>TURN: {{ slot.metadata.turn }}</span>
              <span class="opacity-50">|</span>
              <span>{{ slot.metadata.timestamp }}</span>
            </div>
          </div>

          <div v-else class="h-full flex items-center justify-center py-4">
            <span class="text-slate-600 font-black tracking-widest uppercase text-sm">-- No Data --</span>
          </div>

          <!-- Hover Overlay -->
          <div 
            v-if="gameStore.showSaveLoadMenu === 'save' || slot.metadata"
            class="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"
          ></div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-6 bg-slate-950/50 border-t-2 border-slate-800 text-center">
        <p class="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em]">Sunflower Protocol // Data Management Unit</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #334155;
}
</style>
