<template>
  <transition name="fade-slide-scale-block" mode="out-in">
    <div
      class="agent-chat-outer-glass min-h-[540px] h-[540px]"
      v-show="showAgentResponse || props.promptTyping || props.loading"
    >
      <div class="agent-chat-glass min-h-[540px] h-[540px]">
        <div ref="chatContainer" class="chat-messages chat-scrollable min-h-[540px] h-[540px]">
          <!-- Mensajes y loading como antes -->
          <transition-group name="fadeInMsgSeq" tag="div" v-if="showAgentResponse">
            <div v-for="(msg, idx) in compactedMessages" :key="'msg-' + idx" :class="['chat-row', msg.role === 'Agent' ? 'chat-agent' : 'chat-user']" :style="{ transitionDelay: (idx * 200) + 'ms' }">
              <div :class="['chat-bubble', msg.role === 'Agent' ? 'kai' : 'user', msg.role === 'user' && idx === compactedMessages.length - 1 ? 'last' : '']">
                <span v-if="msg.role === 'user'" class="chat-badge user-badge">User</span>
                <span v-else-if="msg.role === 'Agent'" class="chat-badge kai-badge">KAI</span>
                <span class="chat-text" v-if="msg.role === 'Agent'">
                  <span v-if="msg.partial">{{ msg.text }}<span v-if="showCursor && idx === typingMsgIdx && typingCharIdx > 0" class="editor-cursor">|</span></span>
                  <span v-else v-html="colorize(msg.text)"></span>
                </span>
                <span class="chat-text" v-else v-html="colorize(msg.text)"></span>
              </div>
            </div>
          </transition-group>
          <transition name="fade-slide-scale-block" mode="out-in">
            <div v-if="props.promptTyping" class="kai-thinking-placeholder min-h-[540px] h-[540px] flex items-center justify-center">
              <div class="flex flex-col items-center justify-center w-full h-full">
                <div class="kai-loading-avatar">
                  <div class="kai-avatar-core"></div>
                </div>
                <transition-group name="fade-phrase" tag="div">
                  <span :key="currentPhrase" class="main-loading-text block">{{ currentPhrase }}</span>
                </transition-group>
                <div class="flex items-center gap-2 text-gray-400 text-sm mt-1">
                  <span class="spinner"></span>
                  <span>KAI está iniciando...</span>
                </div>
              </div>
            </div>
          </transition>
          <transition name="fade-slide-scale-block" mode="out-in">
            <div v-if="(props.typing || props.loading) && compactedMessages.length === 0 && !props.promptTyping" class="kai-thinking-placeholder flex flex-col items-center justify-center w-full h-full min-h-[540px] h-[540px] py-8" aria-live="polite">
              <div class="flex flex-col items-center gap-3 w-full">
                <!-- Avatar de KAI con animación -->
                <div class="kai-loading-avatar">
                  <div class="kai-avatar-glow"></div>
                  <div class="kai-avatar-core"></div>
                </div>
                <!-- Mensaje principal -->
                <transition-group name="fade-phrase" tag="div">
                  <span :key="currentPhrase" class="font-semibold text-lg md:text-xl text-violet-700 dark:text-cyan-300 animate-grow block text-center mb-2">{{ currentPhrase }}
                    <span class="thinking-dots ml-1">
                      <span v-for="i in 3" :key="i" class="dot-bounce" :class="['dot-bounce-'+i, { active: dotIdx === i }]">●</span>
                    </span>
                  </span>
                </transition-group>
                <!-- Mensaje secundario -->
                <div class="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mt-1">
                  <span class="spinner"></span>
                  <span v-if="props.typing">Configurando personalidad de KAI...</span>
                  <span v-else>Por favor, espera unos segundos...</span>
                </div>
              </div>
            </div>
          </transition>
          <!-- Placeholder invisible para evitar saltos de layout -->
          <div class="invisible absolute pointer-events-none select-none h-0 overflow-hidden">
            <div class="chat-row chat-agent"><div class="chat-bubble kai">KAI: Esta es una respuesta de ejemplo muy larga para reservar espacio y evitar saltos de layout en la UI. Puedes ajustar este texto según el máximo esperado.</div></div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onMounted, computed, nextTick } from 'vue';
import { onBeforeUnmount } from 'vue';
const props = defineProps({
  responses: {
    type: [Array, Object],
    required: true
  },
  typing: Boolean,
  tabKey: String,
  loading: Boolean,
  exampleIdx: Number,
  tab: String,
  syncHeight: Number, // nuevo: alto sincronizado desde el prompt
  promptTyping: Boolean // NUEVO: typing del prompt
});
const visibleMessages = ref([]);
const typingMsgIdx = ref(-1);
const typingCharIdx = ref(-1);
const typingText = ref('');
const showCursor = ref(true);
let typingTimeout = null;
let dotInterval = null;
let autoNextTimeout = null;
const dotIdx = ref(1);
const chatContainer = ref(null);
const emit = defineEmits(['example-change', 'typing', 'conversation-finished']);
const showAgentResponse = computed(() =>
  !props.promptTyping && !props.loading && !props.typing
);

const renderedMessages = computed(() => {
  // Devuelve los mensajes a mostrar, con typing parcial solo en el Agent que está animando
  return visibleMessages.value.map((msg, idx) => {
    if (msg.role === 'Agent' && idx === typingMsgIdx.value) {
      return { ...msg, partial: true, text: typingText.value };
    } else {
      return { ...msg, partial: false, text: msg.text };
    }
  });
});

// Nuevo: computed para compactar los mensajes de KAI en uno solo
const compactedMessages = computed(() => {
  if (!visibleMessages.value.length) return [];
  const result = [];
  let lastKai = null;
  visibleMessages.value.forEach(msg => {
    if (msg.role === 'Agent') {
      if (lastKai) {
        lastKai.text += '\n' + msg.text;
      } else {
        lastKai = { ...msg };
        result.push(lastKai);
      }
    } else {
      result.push({ ...msg });
      lastKai = null;
    }
  });
  return result;
});

function parseMessages(convArr) {
  // Convierte ['User: "..."', 'Agent: "..."'] en [{role, text}]
  return convArr.map(line => {
    const match = line.match(/^(User|Agent|Assistant):\s*(.*)$/);
    if (match) {
      return { role: match[1] === 'Assistant' ? 'Agent' : match[1], text: match[2].replace(/^"|"$/g, '') };
    }
    return { role: 'Agent', text: line };
  });
}

function startThinking() {
  dotIdx.value = 1;
  clearInterval(dotInterval);
  dotInterval = setInterval(() => {
    dotIdx.value = dotIdx.value === 3 ? 1 : dotIdx.value + 1;
  }, 400);
}
function stopThinking() {
  clearInterval(dotInterval);
  dotInterval = null;
  dotIdx.value = 1;
}

function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  });
}

function startTyping() {
  clearTimeout(typingTimeout);
  clearTimeout(autoNextTimeout);
  typingTimeout = null;
  autoNextTimeout = null;
  
  // Limpiar inmediatamente para evitar saltos
  visibleMessages.value = [];
  typingMsgIdx.value = -1;
  typingCharIdx.value = -1;
  typingText.value = '';
  showCursor.value = true;
  emit('typing', true);
  
  // Obtener las respuestas según el tab actual
  const currentResponses = props.responses[props.tab] || props.responses;
  const messages = parseMessages(currentResponses[props.exampleIdx ?? 0]);
  
  let i = 0;
  let typing = false;
  
  function typeNextMsg() {
    if (i < messages.length) {
      visibleMessages.value = messages.slice(0, i + 1);
      scrollToBottom();
      if (messages[i].role === 'Agent' && !typing) {
        typingMsgIdx.value = i;
        typingCharIdx.value = 0;
        typingText.value = '';
        typing = true;
        typeCharInMsg();
      } else {
        typingMsgIdx.value = -1;
        typingCharIdx.value = -1;
        typingText.value = '';
        i++;
        typingTimeout = setTimeout(typeNextMsg, 700); // más lento
      }
    } else {
      showCursor.value = false;
      typingMsgIdx.value = -1;
      typingCharIdx.value = -1;
      typingText.value = '';
      emit('typing', false);
      setTimeout(() => {
        emit('conversation-finished');
      }, 1200); // 1.2 segundos igual que el loading
    }
  }
  
  function typeCharInMsg() {
    const currentResponses = props.responses[props.tab] || props.responses;
    const messages = parseMessages(currentResponses[props.exampleIdx ?? 0]);
    const msg = messages[typingMsgIdx.value];
    
    if (typingCharIdx.value <= msg.text.length) {
      typingText.value = msg.text.slice(0, typingCharIdx.value);
      scrollToBottom();
      typingCharIdx.value++;
      typingTimeout = setTimeout(typeCharInMsg, 35);
    } else {
      typingText.value = msg.text;
      typingMsgIdx.value = -1;
      typingCharIdx.value = -1;
      typing = false;
      i++;
      typingTimeout = setTimeout(typeNextMsg, 700); // más lento
    }
  }
  
  visibleMessages.value = [];
  typeNextMsg();
}

function nextExample() {
  clearTimeout(typingTimeout);
  clearTimeout(autoNextTimeout);
  typingTimeout = null;
  autoNextTimeout = null;
  
  const currentResponses = props.responses[props.tab] || props.responses;
  if (currentResponses.length > 1) {
    const nextIdx = (props.exampleIdx + 1) % currentResponses.length;
    emit('example-change', nextIdx);
  } else {
    emit('example-change', 0);
  }
  startTyping();
}

function colorize(text) {
  // Solo resalta strings y roles
  return text
    .replace(/("[^"]*")/g, '<span class="string">$1</span>')
    .replace(/\b(User)\b/, '<span class="user-label">$1</span>')
    .replace(/\b(Agent)\b/, '<span class="agent-label">$1</span>');
}

watch(() => props.tab, () => {
  clearTimeout(autoNextTimeout);
  autoNextTimeout = null;
  if (!props.loading && !props.promptTyping) startTyping();
});

watch(() => props.exampleIdx, () => {
  clearTimeout(autoNextTimeout);
  autoNextTimeout = null;
  if (!props.loading && !props.promptTyping) startTyping();
});

watch(() => props.loading, (val) => {
  if (val) {
    startThinking();
    clearTimeout(autoNextTimeout);
    autoNextTimeout = null;
  } else if (!props.promptTyping) {
    stopThinking();
    startTyping();
  }
});

watch(() => props.promptTyping, (val) => {
  // No hacer nada aquí para evitar resets prematuros
});

const phrases = [
  'KAI está configurando su personalidad',
  'Cargando IA de KAI',
  'Preparando entorno conversacional'
];
const currentPhraseIdx = ref(0);
const currentPhrase = computed(() => phrases[currentPhraseIdx.value]);
let phraseInterval = null;



onMounted(() => {
  if (props.loading) startThinking();
  else if (props.typing) startTyping();
  else {
    const currentResponses = props.responses[props.tab] || props.responses;
    visibleMessages.value = parseMessages(currentResponses[0]);
    showCursor.value = false;
  }
  // Ciclo de frases animadas
  phraseInterval = setInterval(() => {
    currentPhraseIdx.value = (currentPhraseIdx.value + 1) % phrases.length;
  }, 2600);

});
onBeforeUnmount(() => {
  clearTimeout(typingTimeout);
  clearTimeout(autoNextTimeout);
  clearInterval(dotInterval);
  clearInterval(phraseInterval);
  typingTimeout = null;
  autoNextTimeout = null;
  dotInterval = null;
  phraseInterval = null;

});
</script>

<style scoped>
.agent-chat-outer-glass, .agent-chat-glass {
  background: rgba(24,24,32,0.55) !important;
  box-shadow: 0 8px 32px 0 rgba(124, 58, 237, 0.10), 0 2px 8px 0 rgba(56, 189, 248, 0.08) !important;
  border: 1.5px solid rgba(139, 92, 246, 0.13) !important;
  border-radius: 1.2rem;
  padding-left: 0.2rem;
  padding-right: 0.2rem;
}
.agent-chat-outer-glass {
  min-width: 0;
  max-width: none;
  width: 100%;
  min-height: 60px;
  height: 100%;
  transition: opacity 0.3s;
}
.agent-chat-outer-glass[style*='display: none'] {
  opacity: 0 !important;
  pointer-events: none !important;
}
.agent-chat-glass {
  background: none !important;
  box-shadow: none !important;
  border: none !important;
  border-radius: 0;
  padding: 0;
  font-family: 'Fira Mono', 'Menlo', 'Consolas', monospace;
  font-size: 1rem;
}
.chat-messages {
  width: 100%;
  height: 100%;
  min-height: 0;
  max-width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.4rem;
  margin: 0;
  padding: 0.7rem 0.7rem 0.7rem 0.7rem;
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
  color: #e5e7eb;
  animation: fadeSlideIn 0.9s cubic-bezier(.4,1.6,.6,1);
}
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(32px); }
  to { opacity: 1; transform: translateY(0); }
}
.chat-row {
  display: flex;
  width: 100%;
  margin: 0 0 1.2rem 0;
}
.chat-user {
  justify-content: flex-end;
}
.chat-agent {
  justify-content: flex-start;
}
.chat-bubble {
  width: auto;
  max-width: 85%;
  min-width: 0;
  margin-left: 0;
  margin-right: 0;
  padding: 1rem 1.5rem;
  border-radius: 1.1rem;
  font-size: clamp(14px, 1.1vw, 16px);
  font-family: 'Fira Mono', 'Menlo', 'Consolas', monospace;
  box-shadow: 0 2px 12px 0 rgba(124, 58, 237, 0.13), 0 1.5px 8px 0 #7c3aed22;
  background: rgba(36, 36, 44, 0.85);
  color: #e5e7eb;
  word-break: break-word;
  line-height: 1.3;
  position: relative;
  border: none;
  transition: background 0.18s, box-shadow 0.18s;
  margin-bottom: 0.2rem;
  opacity: 0;
  transform: translateY(16px);
  animation: fadeInMsg 0.5s cubic-bezier(.4,1.6,.6,1) forwards;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.15rem;
  text-align: left;
  white-space: normal;
  overflow: visible;
}
.chat-row.chat-user .chat-bubble {
  align-self: flex-end;
  margin-left: auto;
  margin-right: 0;
}
.chat-row.chat-agent .chat-bubble {
  align-self: flex-start;
  margin-left: 0;
  margin-right: auto;
}
@keyframes fadeInMsg {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
.chat-bubble.user {
  background: #7c3aed;
  color: #fff;
  align-self: flex-end;
  box-shadow: 0 2px 16px 0 #7c3aed55, 0 1.5px 8px 0 #7c3aed22;
}
.chat-bubble.user.last {
  box-shadow: 0 0 16px 2px #a78bfa99, 0 2px 16px 0 #7c3aed55;
  border: 1.5px solid #a78bfa;
}
.chat-bubble.kai {
  background: #23272e;
  color: #f3f4f6;
  align-self: flex-start;
  box-shadow: 0 0 18px 2px #7c3aed22, 0 2px 8px 0 #38bdf822;
  border-radius: 1.6rem;
  padding: 1.15rem 1.6rem;
  font-size: 1rem;
  font-family: 'Figtree', 'Inter', sans-serif;
  margin-bottom: 0;
  margin-top: 0;
  min-width: 180px;
  max-width: 90%;
  position: relative;
  transition: box-shadow 0.18s;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1.55;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.3em;
}
.kai-badge {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(90deg, #7c3aed 0%, #38bdf8 100%);
  color: #fff;
  font-weight: 700;
  font-size: 0.98rem;
  font-family: 'Figtree', 'Inter', sans-serif;
  border-radius: 999px;
  padding: 0.13em 1em 0.13em 1em;
  margin: 0 0 0.3em 0;
  letter-spacing: 0.03em;
  box-shadow: 0 0 8px 2px #7c3aed33;
  height: 2.1em;
}
.thinking-dots {
  display: inline-block;
  margin-left: 0.2em;
}
.dot {
  opacity: 0.2;
  font-size: 1.2em;
  transition: opacity 0.18s, color 0.18s;
  color: #a78bfa;
}
.dot.active {
  opacity: 1;
  color: #7c3aed;
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
.chat-icon {
  font-size: 1.15em;
  margin-top: 1px;
  flex-shrink: 0;
  opacity: 0.85;
  user-select: none;
}
.user-icon {
  color: #a78bfa;
}
.agent-icon {
  color: #38bdf8;
}
.chat-text {
  display: block;
  width: 100%;
  text-align: left;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  hyphens: auto;
  font-size: 1.13rem;
  font-family: 'Figtree', 'Inter', sans-serif;
  font-weight: 500;
  line-height: 1.55;
  letter-spacing: 0.01em;
}
.chat-badge {
  display: inline-block;
  font-size: 0.78em;
  font-weight: 600;
  padding: 0.13em 0.7em;
  border-radius: 0.7em;
  margin-bottom: 0.18em;
  letter-spacing: 0.01em;
  opacity: 0.92;
  user-select: none;
}
.user-badge {
  display: inline-block;
  background: #23272e;
  color: #fff;
  font-weight: 700;
  font-size: 1.05rem;
  font-family: 'Fira Mono', 'Menlo', 'Consolas', monospace;
  border-radius: 999px;
  padding: 0.18em 1.1em 0.18em 1.1em;
  margin-bottom: 0.7em;
  margin-right: 0.7em;
  letter-spacing: 0.03em;
}
.agent-badge {
  background: #38bdf822;
  color: #38bdf8;
  border: 1px solid #38bdf855;
}
@media (max-width: 900px) {
  .agent-chat-outer-glass, .agent-chat-glass {
    padding-left: 0.1rem;
    padding-right: 0.1rem;
  }
  .chat-messages {
    padding: 0.5rem 0.3rem 0.5rem 0.3rem;
    gap: 0.5rem;
  }
  .agent-chat-outer-glass {
    min-height: 140px;
    height: auto;
    max-height: none;
  }
  .agent-chat-glass {
    height: 100%;
    min-height: 0;
    max-height: 100%;
  }
  .chat-bubble {
    font-size: clamp(13px, 2vw, 15px);
    padding: 0.85rem 1.1rem;
  }
  .chat-bubble.kai {
    padding: 1rem 1.2rem;
    font-size: 0.95rem;
    border-radius: 1rem;
  }
}
.agent-response-hidden {
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  transition: opacity 0.2s;
}
.agent-response-visible {
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
  transition: opacity 0.2s;
}
.fadeInMsgSeq-enter-active {
  transition: opacity 0.5s cubic-bezier(.4,1.6,.6,1), transform 0.5s cubic-bezier(.4,1.6,.6,1);
}
.fadeInMsgSeq-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.fadeInMsgSeq-enter-to {
  opacity: 1;
  transform: translateY(0);
}
/* Estilos para el loading del prompt */
.kai-thinking-placeholder {
  min-height: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeInMsg 0.4s cubic-bezier(.4,1.6,.6,1);
  background: rgba(24,24,32,0.55) !important;
  border-radius: 1.2rem;
  box-shadow: 0 8px 32px 0 rgba(124, 58, 237, 0.10), 0 2px 8px 0 rgba(56, 189, 248, 0.08) !important;
  border: 1.5px solid rgba(139, 92, 246, 0.13) !important;
}
.kai-thinking-placeholder > .flex,
.kai-thinking-placeholder > div {
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 0;
}
.kai-loading-avatar {
  width: 40px;
  height: 40px;
  margin-bottom: 0.7rem;
  position: relative;
}
.kai-avatar-glow {
  display: none;
}
.kai-avatar-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed 0%, #38bdf8 100%);
  box-shadow: 0 0 10px rgba(124, 58, 237, 0.10);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: #fff;
  font-weight: bold;
}
.kai-thinking-placeholder .main-loading-text {
  min-height: 2.2em;
  font-size: 1.15rem;
  color: #e5e7eb;
  font-weight: 500;
  text-align: center;
  letter-spacing: 0.01em;
  margin-bottom: 0.7rem;
  transition: opacity 0.4s;
}
.spinner {
  width: 1em;
  height: 1em;
  border: 2px solid #a78bfa;
  border-top: 2px solid #38bdf8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
  margin-right: 0.5em;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}


</style> 