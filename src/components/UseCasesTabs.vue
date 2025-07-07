<script setup>
defineProps({
  tabs: {
    type: Array,
    required: true
  },
  activeTab: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['tab-change']);
</script>

<template>
  <div class="space-y-4">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      @click="emit('tab-change', tab.key)"
      :class="[
        'w-full p-4 rounded-lg text-left transition-all duration-300 border-2',
        activeTab === tab.key
          ? 'border-blue-500 bg-blue-500/10 dark:bg-blue-500/20 text-white dark:text-gray-900'
          : 'border-gray-600 dark:border-gray-400 hover:border-gray-500 dark:hover:border-gray-300 text-gray-300 dark:text-gray-600 hover:text-white dark:hover:text-gray-900'
      ]"
    >
      <div class="flex items-center">
        <div class="w-3 h-3 rounded-full mr-3" 
             :class="activeTab === tab.key ? 'bg-blue-500' : 'bg-gray-500'"></div>
        <span class="font-semibold">{{ tab.label }}</span>
      </div>
    </button>
  </div>
</template>



<style scoped>
.usecases-section {
  position: relative;
  z-index: 1;
  background: none !important;
}
.usecases-title {
  letter-spacing: -0.01em;
}
.gradient-underline {
  width: 60px;
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(90deg, #7c3aed 0%, #38bdf8 100%);
  margin-top: 0.4rem;
}
.usecases-subtitle {
  margin-bottom: 1.5rem;
}
.usecases-card {
  width: 100%;
  align-items: flex-start;
  justify-content: center;
  gap: 1.5rem;
  background: rgba(16, 18, 28, 0.82);
  box-shadow: 0 8px 48px 0 rgba(56, 189, 248, 0.13), 0 2px 12px 0 #7c3aed22;
  backdrop-filter: blur(18px) saturate(1.08);
  border: 1.5px solid rgba(139, 92, 246, 0.13);
  animation: fadeInCard 0.8s cubic-bezier(.4,1.6,.6,1);
}
@keyframes fadeInCard {
  from { opacity: 0; transform: translateY(32px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fade-in-section {
  animation: fadeInCard 0.8s cubic-bezier(.4,1.6,.6,1);
}
.usecases-tabs {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: rgba(24, 24, 32, 0.38);
  border-radius: 1.7rem;
  box-shadow: 0 4px 32px 0 rgba(56, 189, 248, 0.08);
  padding: 1.2rem 0.7rem;
  backdrop-filter: blur(12px) saturate(1.1);
  border: 1.5px solid rgba(139, 92, 246, 0.13);
}
.usecase-tab {
  background: rgba(24, 24, 32, 0.18);
  border: none;
  outline: none;
  text-align: left;
  padding: 1.05rem 1.4rem 1.05rem 1.1rem;
  border-radius: 1.2rem;
  color: #c7c6e9;
  font-weight: 700;
  font-size: 1.08rem;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: background 0.22s, color 0.18s, box-shadow 0.18s, border 0.18s, transform 0.18s;
  position: relative;
  box-shadow: 0 1px 8px 0 rgba(56, 189, 248, 0.04);
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 0.1rem;
  border-bottom: 1px solid rgba(139, 92, 246, 0.07);
  min-width: 240px;
  max-width: 320px;
  min-height: 56px;
  height: 56px;
  white-space: normal;
  word-break: break-word;
}
.usecase-tab:last-child {
  border-bottom: none;
}
.usecase-tab:hover {
  background: rgba(56, 189, 248, 0.10);
  color: #fff;
  box-shadow: 0 2px 12px 0 #38bdf855, 0 1.5px 8px 0 #7c3aed33;
  transform: translateY(-2px) scale(1.025);
}
.usecase-tab.active {
  background: rgba(56, 189, 248, 0.13);
  color: #fff;
  box-shadow: 0 4px 24px 0 #38bdf844, 0 2px 12px 0 #7c3aed22;
  border: 1.5px solid #38bdf8;
  transform: scale(1.03);
  z-index: 2;
}
.tab-title {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  height: 100%;
}
.tab-label {
  display: block;
  width: 100%;
  line-height: 1.3;
  text-align: left;
}
.tab-indicator {
  display: inline-block;
  width: 6px;
  height: 32px;
  border-radius: 6px;
  background: linear-gradient(180deg, #7c3aed 0%, #38bdf8 100%);
  margin-right: 0.7rem;
  box-shadow: 0 0 8px 2px #38bdf8aa;
  animation: fadeIn 0.4s cubic-bezier(.4,1.6,.6,1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.image-panel {
  min-height: 320px;
  min-width: 260px;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: rgba(17, 18, 28, 0.22);
  border: 1.5px solid rgba(56, 189, 248, 0.08);
  box-shadow: 0 1px 8px 0 rgba(56, 189, 248, 0.05);
  backdrop-filter: blur(5px) saturate(1.01);
  transition: box-shadow 0.2s, border 0.2s, background 0.2s;
  will-change: box-shadow, border, background;
  position: relative;
  padding: 2.6rem 2.6rem 1.7rem 2.6rem;
}
.glow-border {
  box-shadow: 0 0 6px 0 #38bdf844, 0 2px 8px 0 rgba(56, 189, 248, 0.04);
  border-image: none;
}
.usecase-img {
  width: auto;
  height: 180px;
  max-width: 100%;
  object-fit: cover;
  margin-bottom: 1.4rem;
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px 0 rgba(56, 189, 248, 0.13);
  will-change: transform;
}
.image-panel .text-center {
  padding-top: 0.7rem;
  padding-bottom: 0.2rem;
  padding-left: 0.2rem;
  padding-right: 0.2rem;
  text-align: left;
  width: 100%;
}
.pop-fade-enter-active, .pop-fade-leave-active {
  transition: opacity 0.35s cubic-bezier(.4,1.6,.6,1), transform 0.35s cubic-bezier(.4,1.6,.6,1);
}
.pop-fade-enter-from, .pop-fade-leave-to {
  opacity: 0;
  transform: scale(0.98) translateY(16px);
}
.pop-fade-enter-to, .pop-fade-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}
.animate-fade-in {
  animation: fadeIn 0.7s cubic-bezier(.4,1.6,.6,1);
}
@media (max-width: 900px) {
  .usecases-card {
    flex-direction: column;
    gap: 1.5rem;
    align-items: stretch;
  }
  .image-panel {
    min-width: 0;
    max-width: 98vw;
    padding: 0.7rem 0.3rem;
  }
  .usecase-img {
    height: 60px;
  }
}
@media (max-width: 768px) {
  .usecases-section {
    padding: 1.5rem 0 1.5rem 0;
  }
  .container {
    flex-direction: column !important;
    gap: 1.5rem !important;
  }
  .usecases-tabs {
    flex-direction: row;
    gap: 0.1rem;
    overflow-x: auto;
    padding-bottom: 0.4rem;
    scrollbar-width: none;
  }
  .usecases-tabs::-webkit-scrollbar {
    display: none;
  }
  .usecase-tab {
    min-width: 120px;
    font-size: 0.95rem;
    padding: 0.5rem 0.4rem;
    margin-bottom: 0;
    margin-right: 0.2rem;
    border-radius: 0.7rem;
  }
  .image-panel {
    min-width: 0;
    max-width: 98vw;
    padding: 0.7rem 0.3rem;
  }
  .usecase-img {
    height: 38px;
  }
}
</style> 