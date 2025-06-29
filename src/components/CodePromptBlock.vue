<template>
  <div class="code-block-container">
    <div class="code-block-glass code-block-terminal glass-hero-panel">
      <div class="terminal-bar flex items-center gap-2 mb-2">
        <span class="flex-1"></span>
        <span v-for="tab in tabs" :key="tab.key" :class="['example-tab-underline', tab.key === props.tab ? 'active' : '']" @click="setTab(tab.key)">
          {{ tab.label }}
        </span>
      </div>
      <div class="editor-block">
        <div class="editor-gutter">
          <span v-for="idx in typingLineIdx + 1" :key="'gutter-' + idx" class="gutter-line">{{ idx }}</span>
        </div>
        <div class="editor-code" tabindex="0">
          <div v-for="(line, idx) in visibleLines" :key="'code-' + idx" class="editor-line">
            <span v-if="idx < typingLineIdx" v-html="colorize(line)"></span>
            <span v-else-if="idx === typingLineIdx">
              {{ line }}<span v-if="showCursor && typingCharIdx > 0" class="editor-cursor">|</span>
            </span>
            <span v-else></span>
          </div>
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

const visibleLines = ref([]);
const typingLineIdx = ref(-1);
const typingCharIdx = ref(-1);
const showCursor = ref(true);
let typingTimeout = null;
let typingLoopTimeout = null;

const currentPrompt = computed(() => props.prompts[props.tab]);
const currentExampleIdx = computed(() => props.exampleIdx ?? 0);

function setTab(tabKey) {
  clearTimeout(typingTimeout);
  clearTimeout(typingLoopTimeout);
  typingTimeout = null;
  typingLoopTimeout = null;
  emit('tab-change', tabKey);
}

function startTyping() {
  clearTimeout(typingTimeout);
  clearTimeout(typingLoopTimeout);
  typingTimeout = null;
  typingLoopTimeout = null;
  visibleLines.value = [];
  typingLineIdx.value = -1;
  typingCharIdx.value = -1;
  showCursor.value = true;
  emit('typing', true);
  const linesArr = currentPrompt.value.examples[currentExampleIdx.value];
  if (!linesArr || !Array.isArray(linesArr)) {
    showCursor.value = false;
    emit('typing', false);
    return;
  }
  const lines = linesArr;
  let i = 0;
  function typeNextLine() {
    if (i < lines.length) {
      typingLineIdx.value = i;
      typingCharIdx.value = 0;
      typeCharInLine();
    } else {
      showCursor.value = false;
      emit('typing', false);
    }
  }
  function typeCharInLine() {
    const linesArr = [...visibleLines.value];
    const line = lines[typingLineIdx.value];
    if (typingCharIdx.value <= line.length) {
      linesArr[typingLineIdx.value] = line.slice(0, typingCharIdx.value);
      visibleLines.value = linesArr;
      typingCharIdx.value++;
      typingTimeout = setTimeout(typeCharInLine, 32);
    } else {
      linesArr[typingLineIdx.value] = line;
      visibleLines.value = linesArr;
      i++;
      typingTimeout = setTimeout(typeNextLine, 180);
    }
  }
  visibleLines.value = Array(lines.length).fill('');
  typeNextLine();
}

function colorize(line) {
  // 1. Extraer strings y reemplazar por placeholders
  const stringRegex = /"[^"]*"/g;
  const strings = [];
  let safeLine = line.replace(stringRegex, (match) => {
    strings.push(match);
    return `___STR${strings.length - 1}___`;
  });

  // 2. Colorear tokens fuera de los strings
  safeLine = safeLine
    .replace(/^\$ /, '<span class="prompt-blue">$</span> ')
    .replace(/^# /, '<span class="prompt-violet">#</span> ')
    .replace(/User:/, '<span class="user-label">User:</span>')
    .replace(/Assistant:/, '<span class="assistant-label">Assistant:</span>')
    .replace(/(System Prompt|Ejemplo)/, '<span class="keyword">$1</span>');

  // 3. Restaurar los strings resaltados
  safeLine = safeLine.replace(/___STR(\d+)___/g, (_, idx) => {
    return `<span class=\"string\">${strings[idx]}</span>`;
  });

  return safeLine;
}

onMounted(() => {
  startTyping();
});

watch(() => [props.tab, props.exampleIdx, props.prompts], () => {
  startTyping();
}, { flush: 'pre' });

onBeforeUnmount(() => {
  clearTimeout(typingTimeout);
  clearTimeout(typingLoopTimeout);
  typingTimeout = null;
  typingLoopTimeout = null;
});
</script>

<style scoped>
.code-block-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 560px;
  max-width: 560px;
}
.code-block-glass.code-block-terminal {
  background: rgba(17, 18, 28, 0.55);
  box-shadow: 0 8px 32px 0 rgba(124, 58, 237, 0.18);
  border: 1.5px solid rgba(139, 92, 246, 0.13);
  border-radius: 1.5rem;
  padding: 0.7rem 1rem 1.1rem 1rem;
  min-width: 560px;
  max-width: 560px;
  min-height: 180px;
  height: auto;
  max-height: 320px;
  z-index: 10;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0;
  overflow-y: auto;
  transition: box-shadow 0.25s, border 0.25s, background 0.25s;
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
  display: flex;
  flex-direction: row;
  background: #18181b;
  border: 2px solid #7c3aed;
  border-radius: 1.1rem;
  box-shadow: 0 2px 12px 0 rgba(124, 58, 237, 0.08);
  padding: 0.7rem 1rem;
  margin-top: 0.7rem;
  margin-bottom: 0.2rem;
  width: 100%;
  height: auto;
  min-height: 120px;
  max-height: 240px;
  overflow: auto;
  transition: box-shadow 0.18s, border 0.18s;
}
.editor-block:hover {
  box-shadow: 0 4px 24px 0 rgba(124, 58, 237, 0.13);
  border-color: #a78bfa;
}
.editor-gutter {
  background: none;
  color: #8b8fa3;
  opacity: 0.5;
  font-family: 'Fira Mono', 'Menlo', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.18;
  text-align: right;
  padding-right: 1.2em;
  user-select: none;
  min-width: 2.2em;
  margin-right: 0.5em;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.gutter-line {
  height: 1.5em;
  display: block;
}
.editor-code {
  font-family: 'Fira Mono', 'Menlo', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.18;
  color: #e5e7eb;
  background: none;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.editor-line {
  min-height: 1.5em;
  display: flex;
  align-items: center;
  white-space: pre;
}
.prompt-blue {
  color: #38bdf8;
  font-weight: bold;
}
.prompt-violet {
  color: #a78bfa;
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
  color: #facc15;
}
.keyword {
  color: #7c3aed;
  font-weight: bold;
}
.comment {
  color: #a3a3a3;
  font-style: italic;
}
.editor-cursor {
  color: #38bdf8;
  font-weight: bold;
  animation: blink 1s steps(1) infinite;
  margin-left: 0.1em;
}
@keyframes blink {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}
@media (max-width: 900px) {
  .code-block-glass.code-block-terminal {
    min-width: 90vw;
    max-width: 98vw;
    padding-left: 0.7rem;
    padding-right: 0.7rem;
    min-height: 120px;
    height: auto;
    max-height: 220px;
  }
  .editor-block {
    font-size: 12px;
    line-height: 1.13;
    min-height: 80px;
    max-height: 160px;
    height: auto;
    padding: 0.5rem 0.5rem;
  }
  .editor-gutter, .editor-code {
    font-size: 12px;
    line-height: 1.13;
  }
  .gutter-line, .editor-line {
    min-height: 1.2em;
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
    max-width: 98vw !important;
    width: 100% !important;
    margin: 0 auto !important;
    justify-content: center !important;
    align-items: center !important;
  }
  .code-block-glass.code-block-terminal {
    min-width: 0 !important;
    max-width: 98vw !important;
    width: 100% !important;
    padding: 0.7rem 0.3rem 1.1rem 0.3rem !important;
    min-height: 140px !important;
    height: auto !important;
    max-height: 220px !important;
    margin: 0 auto !important;
  }
  .editor-gutter {
    min-width: 1.5em !important;
    text-align: right !important;
    padding-right: 0.4em !important;
    font-size: 12px !important;
  }
  .editor-line {
    min-height: 1.1em !important;
  }
}
</style> 