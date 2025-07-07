<template>
  <transition name="fade-slide">
    <div
      class="agent-chat-outer-glass"
      v-show="showAgentResponse"
    >
      <div class="agent-chat-glass">
        <div ref="chatContainer" class="chat-messages chat-scrollable">
          <transition-group name="fadeInMsgSeq" tag="div">
            <div v-for="(msg, idx) in visibleMessages" :key="'msg-' + idx" :class="['chat-row', msg.role === 'Agent' ? 'chat-agent' : 'chat-user']" :style="{ transitionDelay: (idx * 200) + 'ms' }">
              <div :class="['chat-bubble', msg.role === 'Agent' ? 'kai' : 'user', msg.role === 'user' && idx === visibleMessages.length - 1 ? 'last' : '']">
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
  syncHeight: Number // nuevo: alto sincronizado desde el prompt
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
const showAgentResponse = ref(false);

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
      emit('conversation-finished');
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
  if (!props.loading) startTyping();
});

watch(() => props.exampleIdx, () => {
  clearTimeout(autoNextTimeout);
  autoNextTimeout = null;
  if (!props.loading) startTyping();
});

watch(() => props.loading, (val) => {
  if (val) {
    startThinking();
    clearTimeout(autoNextTimeout);
    autoNextTimeout = null;
  } else {
    stopThinking();
    startTyping();
  }
});

watch(() => props.typing, (val) => {
  if (!val) {
    // Cuando termina la animación del prompt, mostrar la respuesta
    showAgentResponse.value = true;
  } else {
    showAgentResponse.value = false;
  }
});

onMounted(() => {
  if (props.loading) startThinking();
  else if (props.typing) startTyping();
  else {
    const currentResponses = props.responses[props.tab] || props.responses;
    visibleMessages.value = parseMessages(currentResponses[0]);
    showCursor.value = false;
  }
});

onBeforeUnmount(() => {
  clearTimeout(typingTimeout);
  clearTimeout(autoNextTimeout);
  clearInterval(dotInterval);
  typingTimeout = null;
  autoNextTimeout = null;
  dotInterval = null;
});
</script>

<style scoped>
.agent-chat-outer-glass, .agent-chat-glass {
  background: rgba(24,24,32,0.55) !important;
  box-shadow: 0 8px 32px 0 rgba(124, 58, 237, 0.10), 0 2px 8px 0 rgba(56, 189, 248, 0.08) !important;
  border: 1.5px solid rgba(139, 92, 246, 0.13) !important;
  border-radius: 1.2rem;
  padding-left: 1.2rem;
  padding-right: 1.2rem;
}
.agent-chat-outer-glass {
  min-width: 0;
  max-width: none;
  width: 100%;
  min-height: 100px;
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
  height: auto;
  min-height: 0;
  max-width: 100%;
  overflow: visible;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1.1rem;
  margin: 0;
  padding: 1.3rem 1.5rem 1.3rem 1.5rem;
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
  padding: 0.5rem 1.2rem;
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
  padding: 1.25rem 1.9rem;
  font-size: 1.13rem;
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
    padding-left: 0.7rem;
    padding-right: 0.7rem;
  }
  .chat-messages {
    padding-left: 0.7rem;
    padding-right: 0.7rem;
    gap: 1.7rem;
    padding: 1.1rem 0.5rem 1.1rem 0.5rem;
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
  }
  .chat-bubble.kai {
    padding: 1.1rem 1.1rem;
    font-size: 1rem;
    border-radius: 1.2rem;
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
  transition: opacity 0.7s cubic-bezier(.4,1.6,.6,1), transform 0.7s cubic-bezier(.4,1.6,.6,1);
}
.fadeInMsgSeq-enter-from {
  opacity: 0;
  transform: translateY(24px);
}
.fadeInMsgSeq-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style> 