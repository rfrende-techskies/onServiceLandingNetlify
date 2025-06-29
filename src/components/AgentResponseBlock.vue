<template>
  <div
    class="agent-chat-outer-glass"
    :style="syncHeight && $vuetify?.breakpoint?.mdAndUp !== false ? { maxHeight: syncHeight + 'px', minHeight: '120px' } : { minHeight: '120px' }"
  >
    <div class="agent-chat-glass glass-hero-panel">
      <div v-if="loading" class="chat-row chat-agent">
        <div class="chat-bubble agent">
          <span>Pensando<span class="thinking-dots"><span v-for="n in 3" :key="n" :class="['dot', {active: dotIdx === n}]">.</span></span></span>
        </div>
      </div>
      <div v-else ref="chatContainer" class="chat-messages chat-scrollable">
        <div v-for="(msg, idx) in renderedMessages" :key="'msg-' + idx" :class="['chat-row', msg.role === 'Agent' ? 'chat-agent' : 'chat-user']">
          <div :class="['chat-bubble', msg.role === 'Agent' ? 'agent' : 'user', msg.role === 'user' && idx === renderedMessages.length - 1 ? 'last' : '']">
            <span v-if="msg.role === 'user'" class="chat-badge user-badge">User</span>
            <span v-else-if="msg.role === 'Agent'" class="chat-badge agent-badge">Agent</span>
            <span class="chat-text" v-if="msg.role === 'Agent'">
              <span v-if="msg.partial">{{ msg.text }}<span v-if="showCursor && idx === typingMsgIdx && typingCharIdx > 0" class="editor-cursor">|</span></span>
              <span v-else v-html="colorize(msg.text)"></span>
            </span>
            <span class="chat-text" v-else v-html="colorize(msg.text)"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed, nextTick } from 'vue';
import { onBeforeUnmount } from 'vue';
const props = defineProps({
  responses: Array, // array de arrays de strings
  typing: Boolean,
  tabKey: String,
  loading: Boolean,
  exampleIdx: Number,
  tab: String,
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
const emit = defineEmits(['example-change', 'typing']);

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
  const messages = parseMessages(props.responses[props.exampleIdx ?? 0]);
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
        typingTimeout = setTimeout(typeNextMsg, 180);
      }
    } else {
      showCursor.value = false;
      typingMsgIdx.value = -1;
      typingCharIdx.value = -1;
      typingText.value = '';
      emit('typing', false);
    }
  }
  function typeCharInMsg() {
    const msg = parseMessages(props.responses[props.exampleIdx ?? 0])[typingMsgIdx.value];
    if (typingCharIdx.value <= msg.text.length) {
      typingText.value = msg.text.slice(0, typingCharIdx.value);
      scrollToBottom();
      typingCharIdx.value++;
      typingTimeout = setTimeout(typeCharInMsg, 18);
    } else {
      typingText.value = msg.text;
      typingMsgIdx.value = -1;
      typingCharIdx.value = -1;
      typing = false;
      i++;
      typingTimeout = setTimeout(typeNextMsg, 180);
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
  if (props.responses.length > 1) {
    const nextIdx = (props.exampleIdx + 1) % props.responses.length;
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

watch(() => props.tabKey, () => {
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

onMounted(() => {
  if (props.loading) startThinking();
  else if (props.typing) startTyping();
  else {
    visibleMessages.value = parseMessages(props.responses[0]);
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
.agent-chat-outer-glass {
  background: rgba(17, 18, 28, 0.55);
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(124, 58, 237, 0.18);
  border: 1.5px solid rgba(139, 92, 246, 0.13);
  padding: 0.7rem 1.2rem 0.7rem 1.2rem;
  min-width: 560px;
  max-width: 560px;
  width: 100%;
  min-height: 120px;
  height: auto;
  max-height: unset;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  z-index: 10;
  position: relative;
  overflow-y: auto;
}
.agent-chat-glass.glass-hero-panel {
  backdrop-filter: blur(8px) saturate(1.1);
  -webkit-backdrop-filter: blur(8px) saturate(1.1);
  border: none;
  box-shadow: none;
  border-radius: 1.5rem;
  padding: 0 1.1rem 0.7rem 1.1rem;
  min-width: 560px;
  max-width: 560px;
  width: 100%;
  min-height: 120px;
  height: auto;
  max-height: unset;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-top: 0;
  overflow-y: auto;
}
.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  height: 100%;
  max-height: 260px;
  overflow-y: auto;
  transition: max-height 0.4s cubic-bezier(.4,1.2,.4,1);
  scroll-behavior: smooth;
  margin: 0;
  padding: 0.2rem 1.2rem 0.2rem 1.2rem;
}
.chat-row {
  display: flex;
  width: 100%;
  margin: 0;
}
.chat-user {
  justify-content: flex-end;
}
.chat-agent {
  justify-content: flex-start;
}
.chat-bubble {
  max-width: 80%;
  padding: 0.5rem 1.2rem;
  border-radius: 1.1rem;
  font-size: 15px;
  font-family: 'Fira Mono', 'Menlo', 'Consolas', monospace;
  box-shadow: 0 2px 12px 0 rgba(124, 58, 237, 0.13), 0 1.5px 8px 0 #7c3aed22;
  background: rgba(36, 36, 44, 0.85);
  color: #e5e7eb;
  word-break: break-word;
  line-height: 1.22;
  position: relative;
  border: none;
  transition: background 0.18s, box-shadow 0.18s;
  margin: 0;
  opacity: 0;
  transform: translateY(16px);
  animation: fadeInMsg 0.5s cubic-bezier(.4,1.6,.6,1) forwards;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.2rem;
  text-align: left;
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
.chat-bubble.agent {
  background: linear-gradient(90deg, #23272e 0%, #444950 100%);
  color: #e5e7eb;
  align-self: flex-start;
  box-shadow: 0 2px 12px 0 #7c3aed22;
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
  color: #a78bfa;
  font-weight: bold;
  animation: blink-violet 1s steps(1) infinite;
  margin-left: 0.1em;
}
@keyframes blink-violet {
  0%, 100% { opacity: 0; color: #a78bfa; }
  50% { opacity: 1; color: #7c3aed; }
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
  background: #a78bfa22;
  color: #a78bfa;
  border: 1px solid #a78bfa55;
}
.agent-badge {
  background: #38bdf822;
  color: #38bdf8;
  border: 1px solid #38bdf855;
}
@media (max-width: 900px) {
  .agent-chat-outer-glass,
  .agent-chat-glass.glass-hero-panel {
    min-width: 90vw;
    max-width: 98vw;
    padding-left: 0.7rem;
    padding-right: 0.7rem;
  }
}
</style> 