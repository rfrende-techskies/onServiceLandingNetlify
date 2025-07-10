<template>
  <section class="py-20 bg-gray-800 dark:bg-gray-200">
    <div class="w-full max-w-[1440px] mx-auto px-6 md:px-10">
      <TypewriterTitle
        :i18n-key="'sections.tech.title'"
        :subtitle-i18n-key="'sections.tech.subtitle'"
        :badge="{ icon: `<svg class='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M13 10V3L4 14h7v7l9-11h-7z'/></svg>`, i18nKey: 'sections.tech.badge' }"
      />

      <!-- AI Models Section -->
      <div class="mb-20">
        <h3 class="text-2xl font-bold text-white dark:text-gray-900 mb-8 text-center">
          Modelos de IA
        </h3>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(model, index) in iaModels" :key="index"
               :class="[
                 'p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer',
                 selectedModelIdx === index
                   ? 'border-blue-500 bg-blue-500/10 dark:bg-blue-500/20'
                   : 'border-gray-600 dark:border-gray-400 hover:border-gray-500 dark:hover:border-gray-300'
               ]"
               @click="selectedModelIdx = index"
               @keydown="handleKeydown"
               :tabindex="0"
               :ref="el => tabRefs[index] = el">
            
            <div class="flex items-center mb-4">
              <img :src="model.logo" :alt="model.name" class="w-8 h-8 mr-3">
              <h4 class="text-lg font-semibold text-white dark:text-gray-900">{{ model.name }}</h4>
            </div>
            
            <p class="text-gray-300 dark:text-gray-600 mb-4">{{ model.desc }}</p>
            
            <div class="flex flex-wrap gap-2 mb-4">
              <span v-for="tag in model.tags" :key="tag.label"
                    class="px-2 py-1 text-xs rounded-full bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900">
                {{ tag.icon }} {{ tag.label }}
              </span>
            </div>
            
            <div class="grid grid-cols-3 gap-2 text-xs text-gray-400 dark:text-gray-500">
              <div>
                <div class="font-semibold">Velocidad</div>
                <div>{{ model.speed }}</div>
              </div>
              <div>
                <div class="font-semibold">Contexto</div>
                <div>{{ model.context }}</div>
              </div>
              <div>
                <div class="font-semibold">Precio</div>
                <div>{{ model.price }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Technologies Section -->
      <div>
        <h3 class="text-2xl font-bold text-white dark:text-gray-900 mb-8 text-center">
          Tecnologías y Herramientas
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <a v-for="(tech, index) in techs" :key="index"
             :href="tech.link" target="_blank" rel="noopener noreferrer"
             :class="[
               'p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105',
               featuredIdx === index
                 ? 'border-blue-500 bg-blue-500/10 dark:bg-blue-500/20'
                 : 'border-gray-600 dark:border-gray-400 hover:border-gray-500 dark:hover:border-gray-300'
             ]">
            <div class="flex flex-col items-center text-center">
              <img :src="tech.logo" :alt="tech.name" class="w-12 h-12 mb-2">
              <span class="text-sm font-medium text-white dark:text-gray-900">{{ tech.name }}</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue';

const iaModels = [
  {
    name: 'Claude 3.5 Haiku',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Anthropic_logo.svg',
    desc: 'Ultra rápido, ideal para chat y tareas de soporte.',
    tags: [
      { label: 'Chatbot', icon: '💬' },
      { label: 'Soporte', icon: '🤖' }
    ],
    color: 'bg-blue-500',
    speed: '≈1s',
    context: '200K tokens',
    price: '$0.25/millón tokens',
    link: 'https://www.anthropic.com/news/claude-3-5-haiku'
  },
  {
    name: 'GPT-4o',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/OpenAI_Logo.svg',
    desc: 'Multimodal, excelente para análisis, generación de texto e imágenes.',
    tags: [
      { label: 'Multimodal', icon: '🖼️' },
      { label: 'Creatividad', icon: '✨' }
    ],
    color: 'bg-violet-500',
    speed: '≈2s',
    context: '128K tokens',
    price: '$5/millón tokens',
    link: 'https://openai.com/index/gpt-4o/'
  },
  {
    name: 'Gemini 2.5 Pro',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    desc: 'IA de Google para análisis avanzado y procesamiento de datos.',
    tags: [
      { label: 'Análisis', icon: '📊' },
      { label: 'Datos', icon: '🔢' }
    ],
    color: 'bg-cyan-500',
    speed: '≈1.5s',
    context: '1M tokens',
    price: '$3/millón tokens',
    link: 'https://deepmind.google/technologies/gemini/'
  },
  {
    name: 'Amazon Nova Premier',
    logo: '/aws-partner-badge.png',
    desc: 'IA de Amazon para automatización y procesamiento empresarial.',
    tags: [
      { label: 'Automatización', icon: '⚙️' },
      { label: 'Negocios', icon: '💼' }
    ],
    color: 'bg-amber-500',
    speed: '≈2s',
    context: '512K tokens',
    price: '$2/millón tokens',
    link: 'https://aws.amazon.com/bedrock/amazon-nova/'
  },
  {
    name: 'Claude Opus 4',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Anthropic_logo.svg',
    desc: 'IA de Anthropic para tareas complejas y razonamiento avanzado.',
    tags: [
      { label: 'Razonamiento', icon: '🧠' },
      { label: 'Complejidad', icon: '🧩' }
    ],
    color: 'bg-green-500',
    speed: '≈3s',
    context: '200K tokens',
    price: '$15/millón tokens',
    link: 'https://www.anthropic.com/news/claude-3-opus'
  },
];

const techs = [
  { name: 'AWS', logo: '/aws-partner-badge.png', link: 'https://aws.amazon.com/' },
  { name: 'GitHub', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', link: 'https://github.com/' },
  { name: 'GitLab', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg', link: 'https://gitlab.com/' },
  { name: 'Vue.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg', link: 'https://vuejs.org/' },
  { name: 'OpenAI', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/OpenAI_Logo.svg', link: 'https://openai.com/' },
  { name: 'Sentry', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sentry/sentry-original.svg', link: 'https://sentry.io/' },
  { name: 'PostgreSQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', link: 'https://www.postgresql.org/' },
  { name: 'Snowflake', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/snowflake/snowflake-original.svg', link: 'https://www.snowflake.com/' },
  { name: 'Notion', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/notion/notion-original.svg', link: 'https://www.notion.so/' },
  { name: 'Slack', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg', link: 'https://slack.com/' },
  { name: 'Airtable', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/airtable/airtable-original.svg', link: 'https://airtable.com/' },
  { name: 'Google Drive', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg', link: 'https://drive.google.com/' },
];

const selectedModelIdx = ref(0);
const tabRefs = ref([]);
const featuredIdx = ref(0);
let badgeInterval = null;

const focusTab = idx => {
  tabRefs.value[idx]?.focus();
};

const handleKeydown = e => {
  if (e.key === 'ArrowDown') {
    selectedModelIdx.value = (selectedModelIdx.value + 1) % iaModels.length;
    nextTick(() => focusTab(selectedModelIdx.value));
  } else if (e.key === 'ArrowUp') {
    selectedModelIdx.value = (selectedModelIdx.value - 1 + iaModels.length) % iaModels.length;
    nextTick(() => focusTab(selectedModelIdx.value));
  }
};

onMounted(() => {
  badgeInterval = setInterval(() => {
    featuredIdx.value = (featuredIdx.value + 1) % techs.length;
  }, 4000);
});

onBeforeUnmount(() => {
  if (badgeInterval) {
    clearInterval(badgeInterval);
  }
});
</script> 