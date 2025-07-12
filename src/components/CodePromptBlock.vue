<template>
  <div class="w-full flex flex-col items-stretch justify-stretch h-full min-h-0">
    <div class="bg-[rgba(24,24,32,0.85)] backdrop-blur-2xl border border-white/30 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/10 w-full h-full min-h-0 flex flex-col p-4 md:p-6 min-h-0 h-full">
      <!-- Tabs mejoradas -->
      <div class="tabs-bar">
        <span class="tabs-bar-bg"></span>
        <span v-for="tab in tabs" :key="tab.key" :class="['example-tab-underline', tab.key === props.tab ? 'active pointer-events-none cursor-default' : '']" @click="tab.key !== props.tab && setTab(tab.key)">
          {{ tab.label }}
        </span>
      </div>
      <div class="editor-block flex-1 w-full h-full min-h-0 bg-transparent p-0 flex flex-col items-stretch">
        <div v-for="(line, idx) in codeLines" :key="idx" class="editor-line-flex">
          <span class="gutter-line">{{ idx + 1 }}</span>
          <pre class="editor-code-line" v-html="colorizeBlock(line + (showCursor && idx === codeLines.length - 1 ? '<span class=\'editor-cursor\'>|</span>' : ''))"></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed, onBeforeUnmount } from 'vue';
const emit = defineEmits(['tab-change', 'typing', 'prompt-typing']);

const props = defineProps({
  tab: String,
  exampleIdx: Number,
  prompts: Object
});

const tabs = computed(() => [
  { key: 'airline', label: props.prompts.airline.label },
  { key: 'travel', label: props.prompts.travel.label },
  { key: 'it', label: props.prompts.it.label }
]);

const animatedText = ref('');
const showCursor = ref(true);
let typingTimeout = null;
let restartTimeout = null;

const currentPrompt = computed(() => props.prompts[props.tab]);
const currentExampleIdx = computed(() => props.exampleIdx ?? 0);

// Computed para dividir el texto animado en líneas, filtrando líneas vacías
const codeLines = computed(() => {
  return animatedText.value.split('\n').filter(line => line.trim() !== '');
});

function setTab(tabKey) {
  clearTimeout(typingTimeout);
  typingTimeout = null;
  emit('tab-change', tabKey);
}

function startTyping() {
  clearTimeout(typingTimeout);
  clearTimeout(restartTimeout);
  typingTimeout = null;
  restartTimeout = null;
  animatedText.value = '';
  showCursor.value = true;
  emit('typing', true);
  emit('prompt-typing', true); // NUEVO: avisar que el prompt está tipeando
  const linesArr = currentPrompt.value?.examples?.[currentExampleIdx.value] || [];
  const fullText = linesArr.join('\n');
  let charIdx = 0;
  function typeChar() {
    if (charIdx <= fullText.length) {
      animatedText.value = fullText.slice(0, charIdx);
      charIdx++;
      typingTimeout = setTimeout(typeChar, 22); // MÁS RÁPIDO
    } else {
      showCursor.value = false;
      emit('typing', false);
      emit('prompt-typing', false); // NUEVO: avisar que terminó el typing del prompt
      // Reiniciar animación después de 6 segundos
      restartTimeout = setTimeout(() => {
        startTyping();
      }, 6000); // MÁS LENTO EL REINICIO
    }
  }
  typeChar();
}

function colorizeBlock(text) {
  // Resalta palabras clave y roles en todo el bloque
  return text
    .replace(/("[^"]*")/g, '<span class="string">$1</span>')
    .replace(/^\$ /gm, '<span class="prompt-blue">$</span> ')
    .replace(/^# /gm, '<span class="prompt-violet">#</span> ')
    .replace(/User:/g, '<span class="user-label">User:</span>')
    .replace(/Assistant:/g, '<span class="assistant-label">Assistant:</span>')
    .replace(/(System Prompt|Ejemplo)/g, '<span class="keyword">$1</span>');
}

onMounted(() => {
  startTyping();
});

watch(() => [props.tab, props.exampleIdx, props.prompts], () => {
  startTyping();
}, { flush: 'pre' });

onBeforeUnmount(() => {
  clearTimeout(typingTimeout);
  clearTimeout(restartTimeout);
  typingTimeout = null;
  restartTimeout = null;
});
</script>

<style scoped>
.tabs-bar {
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  position: relative;
  width: 100%;
  margin-bottom: 0.3rem;
  min-height: 48px;
  background: rgba(40,40,60,0.13);
  border-radius: 1.2rem 1.2rem 0 0;
  box-shadow: 0 2px 12px 0 rgba(124,58,237,0.04);
  padding: 0.12rem 0.12rem 0 0.12rem;
  gap: 0.4rem;
}
.tabs-bar-bg {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3.5px;
  background: linear-gradient(90deg, #ede9fe 0%, #cffafe 100%);
  opacity: 0.55;
  border-radius: 2px;
  z-index: 0;
}
.example-tab-underline {
  position: relative;
  font-size: 1.08rem;
  padding: 0.38rem 1.45rem 0.38rem 1.45rem;
  background: rgba(124,58,237,0.06);
  color: #a78bfa;
  font-weight: 600;
  cursor: pointer;
  margin-right: 0.1rem;
  border: none;
  outline: none;
  transition: color 0.22s, box-shadow 0.22s, background 0.22s, border-radius 0.22s;
  border-radius: 0.7rem 0.7rem 0 0;
  box-shadow: none;
  display: inline-block;
  z-index: 1;
}
.example-tab-underline:last-child {
  margin-right: 0;
}
.example-tab-underline.active {
  color: #fff;
  background: rgba(124,58,237,0.06);
  border-radius: 0.7rem 0.7rem 0 0;
  font-weight: 700;
  box-shadow: none;
}
.example-tab-underline::after {
  content: '';
  display: block;
  position: absolute;
  left: 50%;
  right: 50%;
  bottom: 0.10em;
  height: 3px;
  background: linear-gradient(90deg, #7c3aed 0%, #38bdf8 100%);
  border-radius: 2px;
  opacity: 0;
  box-shadow: none;
  transform: scaleX(0.7) translateY(2px);
  transition: opacity 0.32s cubic-bezier(.4,0,.2,1), transform 0.32s cubic-bezier(.4,0,.2,1), left 0.32s cubic-bezier(.4,0,.2,1), right 0.32s cubic-bezier(.4,0,.2,1), height 0.32s cubic-bezier(.4,0,.2,1);
  z-index: 3;
}
.example-tab-underline.active::after {
  opacity: 1;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #7c3aed 0%, #38bdf8 100%);
  box-shadow: 0 2px 12px 0 rgba(56,189,248,0.18);
  transform: scaleX(1) translateY(2px);
}
.example-tab-underline:not(.active):hover::after,
.example-tab-underline:not(.active):focus::after {
  opacity: 0.7;
  left: 10%;
  right: 10%;
  height: 3px;
  background: linear-gradient(90deg, #a78bfa 0%, #38bdf8 100%);
  box-shadow: none;
  transform: scaleX(1.08) translateY(2px);
}
.editor-block {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  font-family: 'Fira Mono', 'Menlo', 'Consolas', monospace;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  background: transparent;
  border-radius: 1.2rem;
  box-shadow: none;
  padding: 0;
  color: #e5e7eb;
  backdrop-filter: blur(16px) saturate(1.1);
  -webkit-backdrop-filter: blur(16px) saturate(1.1);
  border: none;
  animation: fadeSlideIn 0.9s cubic-bezier(.4,1.6,.6,1);
  overflow-y: auto;
  height: 100%;
  min-height: 0;
  justify-content: flex-start;
  align-items: stretch;
}
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(32px); }
  to { opacity: 1; transform: translateY(0); }
}
.editor-line-flex {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  min-height: 1.5em;
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  width: 100%;
}
.gutter-line {
  min-width: 2.5em;
  width: 2.5em;
  text-align: right;
  color: #8b8fa3;
  opacity: 0.6;
  user-select: none;
  font-size: 14px;
  margin-right: 1em;
  font-family: 'Fira Mono', 'Menlo', 'Consolas', monospace;
  padding-right: 0.5em;
  display: inline-block;
  vertical-align: top;
}
.editor-code-line {
  font-family: 'Fira Mono', 'Menlo', 'Consolas', monospace;
  font-size: clamp(14px, 1.1vw, 16px);
  color: #e5e7eb;
  white-space: pre-wrap;
  word-break: break-word;
  flex: 1 1 0;
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}
.prompt-blue {
  color: #2563eb;
  font-weight: bold;
}
.prompt-violet {
  color: #7c3aed;
  font-weight: bold;
}
.user-label {
  color: #38bdf8;
  font-weight: bold;
}
.assistant-label {
  color: #22c55e;
  font-weight: bold;
}
.string {
  color: #f59e42;
}
.keyword {
  color: #a78bfa;
  font-weight: bold;
}
.comment {
  color: #a3a3a3;
  font-style: italic;
}
.editor-cursor {
  color: #8b5cf6;
  animation: blink 1s infinite;
  font-weight: bold;
  text-shadow: 0 0 8px rgba(139, 92, 246, 0.6);
}
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
@media (max-width: 900px) {
  .bg-\[rgba\(24\,24\,32\,0\.85\)\] {
    min-height: 470px !important;
    height: 470px !important;
  }
  .prompt-glass-inner {
    padding: 0.8rem 0.7rem;
    min-height: 420px;
    height: 420px;
  }
  .editor-block {
    font-size: 15px !important;
    padding: 0.8rem 0.7rem;
  }
}
@media (max-width: 768px) {
  .prompt-glass-inner {
    padding: 0.6rem 0.3rem 0.7rem 0.3rem !important;
    min-height: 0 !important;
    height: 100% !important;
    max-height: 100% !important;
  }
  .editor-block {
    font-size: 13px !important;
    padding: 0.6rem 0.3rem !important;
    gap: 0.05rem !important;
    min-height: 0 !important;
    height: calc(100% - 36px) !important;
    max-height: calc(100% - 36px) !important;
    overflow-y: hidden !important;
    flex-grow: 1 !important;
    flex-shrink: 1 !important;
  }
  .gutter-line {
    min-width: 1.1em !important;
    width: 1.1em !important;
    text-align: right !important;
    padding-right: 0.2em !important;
    font-size: 11px !important;
    margin-right: 0.4em !important;
  }
  .editor-line-flex {
    min-height: 1em !important;
  }
  .editor-code-line, pre.editor-code-line {
    font-size: 13px !important;
    word-break: break-word !important;
    white-space: pre-line !important;
    overflow-wrap: break-word !important;
    line-height: 1.25 !important;
  }
}
pre.editor-code-line {
  font-family: 'Fira Mono', 'Menlo', 'Consolas', monospace;
  font-size: clamp(14px, 1.1vw, 16px);
  color: #e5e7eb;
  white-space: pre-wrap;
  word-break: break-word;
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  margin: 0;
  padding: 0;
}
.editor-line-flex:first-child {
  margin-top: 33px;
}
@media (max-width: 768px) {
  .editor-line-flex:first-child {
    margin-top: 5px;
  }
}
</style> 