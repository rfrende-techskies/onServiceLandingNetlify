<template>
  <div class="typewriter-title-wrapper text-center mb-8 relative">
    <div v-if="badgeText" class="badge-row flex justify-center mb-6">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full badge-gradient text-white text-sm font-semibold animate-badge-glow">
        <span v-if="badgeIcon" v-html="badgeIcon" class="w-4 h-4"></span>
        <span>{{ badgeText }}</span>
      </div>
    </div>
    <!-- Wrapper con min-height fijo solo si se pasa la prop -->
    <div :class="['title-container relative', fixedTitleHeight ? fixedTitleHeight : '']">
      <h2 class="typewriter-title text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent leading-tight">
        <span class="title-text">{{ displayedTitle }}</span>
        <span class="typewriter-cursor" :class="{ 'invisible': !showCursor }" aria-hidden="true">|</span>
      </h2>
    </div>
    <p v-if="subtitleText" class="typewriter-subtitle text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
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
  badge: { type: Object, default: null }, // { icon, text, i18nKey }
  fixedTitleHeight: { type: String, default: '' } // ej: 'min-h-[4.5rem] md:min-h-[6.5rem]'
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

.title-container {
  /* Altura fija basada en el contenido máximo esperado para evitar saltos */
  /* min-height se puede sobreescribir por prop */
}

.typewriter-title {
  letter-spacing: -0.02em;
  line-height: 1.1;
  display: block;
  position: relative;
}

.title-text {
  display: inline;
}

.typewriter-cursor {
  color: #d1d5db;
  font-weight: 300;
  font-size: 1em;
  margin-left: 2px;
  opacity: 0.8;
  vertical-align: baseline;
  display: inline;
  transition: opacity 0.15s ease-in-out;
  position: relative;
  user-select: none;
  pointer-events: none;
}

.typewriter-cursor.invisible {
  opacity: 0;
}

.badge-row {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
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
  line-height: 1.4;
  margin-top: 1rem;
}

@media (max-width: 767px) {
  .typewriter-title {
    letter-spacing: -0.01em;
  }
  .typewriter-cursor {
    margin-left: 1px;
  }
  .badge-row {
    margin-bottom: 1rem;
  }
  .typewriter-subtitle {
    margin-top: 0.75rem;
  }
}
</style> 