<template>
  <div class="typewriter-title-wrapper text-center mb-8 relative">
    <div v-if="badgeText" class="badge-row flex justify-center mb-4">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full badge-gradient text-white text-sm font-semibold animate-badge-glow">
        <span v-if="badgeIcon" v-html="badgeIcon" class="w-4 h-4"></span>
        <span>{{ badgeText }}</span>
      </div>
    </div>
    <h2 class="typewriter-title text-3xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent">
      <span>{{ displayedTitle }}</span><span class="typewriter-cursor" :class="{ 'invisible': !showCursor }">|</span>
    </h2>
    <p v-if="subtitleText" class="typewriter-subtitle text-xl text-muted-foreground max-w-2xl mx-auto mt-2">
      {{ subtitleText }}
    </p>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  i18nKey: { type: String, required: true },
  subtitleI18nKey: { type: String, default: '' },
  badge: { type: Object, default: null } // { icon, text, i18nKey }
});

const { t } = useI18n();

const fullTitle = computed(() => t(props.i18nKey));
const subtitleText = computed(() => props.subtitleI18nKey ? t(props.subtitleI18nKey) : '');
const badgeText = computed(() => props.badge ? (props.badge.i18nKey ? t(props.badge.i18nKey) : props.badge.text) : '');
const badgeIcon = computed(() => props.badge && props.badge.icon ? props.badge.icon : null);

const displayedTitle = ref('');
const showCursor = ref(true);
let typingTimeout = null;
let cursorInterval = null;
let resetInterval = null;

function startTypewriter() {
  clearTimeout(typingTimeout);
  clearInterval(cursorInterval);
  clearInterval(resetInterval);
  displayedTitle.value = '';
  showCursor.value = true;
  const text = fullTitle.value;
  let idx = 0;
  function typeChar() {
    if (idx <= text.length) {
      displayedTitle.value = text.slice(0, idx);
      idx++;
      typingTimeout = setTimeout(typeChar, 38);
    } else {
      showCursor.value = true;
      // Cursor parpadeante
      cursorInterval = setInterval(() => {
        showCursor.value = !showCursor.value;
      }, 500);
      // Reiniciar animación cada 4 segundos
      resetInterval = setInterval(() => {
        clearInterval(cursorInterval);
        startTypewriter();
      }, 4000);
    }
  }
  typeChar();
}

onMounted(() => {
  startTypewriter();
});

watch(fullTitle, () => {
  startTypewriter();
});

onBeforeUnmount(() => {
  clearTimeout(typingTimeout);
  clearInterval(cursorInterval);
  clearInterval(resetInterval);
});
</script>

<style scoped>
.typewriter-title-wrapper {
  position: relative;
  z-index: 1;
}
.typewriter-title {
  letter-spacing: -0.01em;
  line-height: 1.13;
  display: inline-block;
  min-height: 1.2em;
}
.typewriter-cursor {
  color: #d1d5db;
  font-weight: 300;
  font-size: 1em;
  margin-left: 1px;
  opacity: 0.7;
  vertical-align: middle;
  display: inline-block;
  width: 0.6ch;
  transition: opacity 0.18s;
  /* No usar visibility:hidden porque cambia el layout, usar opacity o una clase .invisible */
}
.typewriter-cursor.invisible {
  opacity: 0;
}
.badge-row {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.7rem;
}
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
.badge-gradient {
  background: linear-gradient(90deg, #432889 0%, #6d28d9 60%, #0891b2 100%);
  box-shadow: 0 0 16px 2px #a78bfa44, 0 2px 16px 0 #7c3aed33;
}
.animate-badge-glow {
  animation: badge-glow 2.2s infinite;
}
@keyframes badge-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(139,92,246,0.18), 0 0 0 0 rgba(34,211,238,0.12); }
  50% { box-shadow: 0 0 16px 4px rgba(139,92,246,0.28), 0 0 8px 2px rgba(34,211,238,0.18); }
}
.typewriter-subtitle {
  color: #a1a1aa;
  font-weight: 400;
  line-height: 1.3;
}
</style> 