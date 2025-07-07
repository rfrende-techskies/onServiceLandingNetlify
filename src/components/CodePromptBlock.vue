<template>
  <div class="code-block-container">
    <div class="code-block-glass code-block-terminal glass-hero-panel">
      <div class="terminal-bar flex items-center gap-2 mb-2">
        <span class="flex-1"></span>
        <span v-for="tab in tabs" :key="tab.key" :class="['example-tab-underline', tab.key === props.tab ? 'active pointer-events-none cursor-default' : '']" @click="tab.key !== props.tab && setTab(tab.key)">
          {{ tab.label }}
        </span>
      </div>
      <div class="editor-block">
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
const emit = defineEmits(['tab-change', 'typing']);

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

const currentPrompt = computed(() => props.prompts[props.tab]);
const currentExampleIdx = computed(() => props.exampleIdx ?? 0);

// NUEVO: Computed para dividir el texto animado en líneas sin agregar líneas vacías extra
const codeLines = computed(() => {
  // Split normal, sin agregar línea vacía extra
  return animatedText.value.split('\n');
});

function setTab(tabKey) {
  clearTimeout(typingTimeout);
  typingTimeout = null;
  emit('tab-change', tabKey);
}

function startTyping() {
  clearTimeout(typingTimeout);
  typingTimeout = null;
  animatedText.value = '';
  showCursor.value = true;
  emit('typing', true);
  const linesArr = currentPrompt.value?.examples?.[currentExampleIdx.value] || [];
  const fullText = linesArr.join('\n');
  let charIdx = 0;
  function typeChar() {
    if (charIdx <= fullText.length) {
      animatedText.value = fullText.slice(0, charIdx);
      charIdx++;
      typingTimeout = setTimeout(typeChar, 35);
    } else {
      showCursor.value = false;
      emit('typing', false);
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
  typingTimeout = null;
});
</script>

<style scoped>
.code-block-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  min-width: 0;
  max-width: 100%;
  padding: 0;
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}
.code-block-glass.code-block-terminal {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  background: rgba(24,24,32,0.85) !important;
  box-shadow: 0 8px 32px 0 rgba(124, 58, 237, 0.10), 0 2px 8px 0 rgba(56, 189, 248, 0.08) !important;
  border: 1.5px solid rgba(139, 92, 246, 0.13) !important;
  border-radius: 1.2rem;
  padding: 1.2rem 1.2rem;
  min-height: 0;
  height: auto;
  max-height: none;
  z-index: 10;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-size: 15px;
}
.terminal-bar {
  align-items: center;
  min-height: 2.2rem;
}
.example-tab-underline {
  position: relative;
  font-size: 0.97rem;
  padding: 0.13rem 1.1rem 0.13rem 1.1rem;
  background: none;
  color: #a78bfa;
  font-weight: 600;
  cursor: pointer;
  margin-right: 0.2rem;
  border: none;
  outline: none;
  transition: color 0.18s;
  border-radius: 0;
  box-shadow: none;
  display: inline-block;
}
.example-tab-underline.active {
  color: #fff;
  background: rgba(124,58,237,0.13);
  border-radius: 0.7rem;
  font-weight: 700;
}
.example-tab-underline::after {
  content: '';
  display: block;
  position: absolute;
  left: 18%;
  right: 18%;
  bottom: 0.1em;
  height: 2.5px;
  background: linear-gradient(90deg, #7c3aed 0%, #38bdf8 100%);
  border-radius: 2px;
  opacity: 0;
  transform: scaleX(0.7);
  transition: opacity 0.18s, transform 0.18s;
}
.example-tab-underline.active::after {
  opacity: 1;
  transform: scaleX(1);
}
.editor-block {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  font-family: 'Fira Mono', 'Menlo', 'Consolas', monospace;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  background: rgba(24,24,32,0.55);
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px 0 rgba(124, 58, 237, 0.08), 0 2px 8px 0 rgba(56, 189, 248, 0.06);
  padding: 1.1rem 1.2rem;
  color: #e5e7eb;
  backdrop-filter: blur(16px) saturate(1.1);
  -webkit-backdrop-filter: blur(16px) saturate(1.1);
  border: 1.5px solid rgba(139, 92, 246, 0.13);
  animation: fadeSlideIn 0.9s cubic-bezier(.4,1.6,.6,1);
  overflow-x: auto;
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
  .code-block-glass.code-block-terminal {
    min-height: 140px;
    height: auto;
    max-height: none;
    padding: 0.8rem 0.7rem;
  }
  .editor-block {
    font-size: 15px !important;
    padding: 0.8rem 0.7rem;
  }
}
@media (min-width: 768px) {
  .code-block-glass.code-block-terminal {
    padding-top: 1.1rem;
    padding-bottom: 2.5rem;
  }
}
@media (max-width: 768px) {
  .code-block-container {
    min-width: 0 !important;
    max-width: 99vw !important;
    width: 100% !important;
    margin: 0 auto !important;
    justify-content: center !important;
    align-items: center !important;
  }
  .code-block-glass.code-block-terminal {
    min-width: 0 !important;
    max-width: 99vw !important;
    width: 100% !important;
    padding: 0.4rem 0.1rem 0.7rem 0.1rem !important;
    min-height: 120px !important;
    height: auto !important;
    max-height: 340px !important;
    margin: 0 auto !important;
    font-size: 13px !important;
  }
  .editor-block {
    font-size: 13px !important;
    padding: 0.4rem 0.2rem !important;
    gap: 0.05rem !important;
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
.code-block-container, .editor-block, .editor-line-flex, .editor-code-line {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  text-align: left !important;
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
</style> 