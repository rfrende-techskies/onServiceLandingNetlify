<script setup>
import { ref, nextTick, computed, Transition, watch, onMounted, onBeforeUnmount } from "vue";
import Header from "./components/Header.vue";
import CircuitBackground from "./components/CircuitBackground.vue";
import CodePromptBlock from "./components/CodePromptBlock.vue";
import AgentResponseBlock from "./components/AgentResponseBlock.vue";
import UseCasesTabs from './components/UseCasesTabs.vue';
import ParticleBackground from "./components/ParticleBackground.vue";

const questions = ref({
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
  6: false,
});
const loading = ref({
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
  6: false,
});

const features = [
  {
    icon: "/bot.png",
    title: "Virtual Agent",
    desc: "Friendly AI chat agent on your favorite platforms.",
  },
  {
    icon: "/conversation.png",
    title: "Quick Answers",
    desc: "Instant responses to FAQs, boosting satisfaction.",
  },
  {
    icon: "/upselling.png",
    title: "Smart Upselling",
    desc: "Suggest relevant ancillaries at the perfect moment.",
  },
  {
    icon: "/speech-bubble.png",
    title: "Natural Conversations",
    desc: "Context-aware, free-form chat—no rigid trees here.",
  },
  {
    icon: "/customer-support.png",
    title: "24/7 Support",
    desc: "Around-the-clock service in multiple languages.",
  },
  {
    icon: "/clipboard.png",
    title: "Task Automation",
    desc: "Automate FAQs and free your staff for complex cases.",
  },
];

const team = [
  {
    name: "Sofía Torres",
    role: "AI Lead",
    desc: "Leads the AI strategy and model development for all our products.",
  },
  {
    name: "Lucas Fernández",
    role: "Frontend Developer",
    desc: "Builds beautiful and performant user interfaces for our clients.",
  },
  {
    name: "Martina Gómez",
    role: "Backend Developer",
    desc: "Designs and maintains robust, scalable backend systems.",
  },
  {
    name: "Julián Rivas",
    role: "Prompt Engineer",
    desc: "Crafts and optimizes prompts for our AI models to maximize performance.",
  },
  {
    name: "Valentina Ruiz",
    role: "UX/UI Designer",
    desc: "Ensures our products are intuitive, accessible, and visually stunning.",
  },
  {
    name: "Tomás Herrera",
    role: "DevOps Engineer",
    desc: "Automates deployments and keeps our infrastructure running smoothly.",
  },
  {
    name: "Camila Duarte",
    role: "Data Scientist",
    desc: "Analyzes data and extracts insights to drive product improvements.",
  },
  {
    name: "Ignacio Pérez",
    role: "QA Engineer",
    desc: "Guarantees the quality and reliability of our software releases.",
  },
  {
    name: "Florencia Vidal",
    role: "Product Manager",
    desc: "Coordinates the team and aligns product vision with business goals.",
  },
  {
    name: "Emilia Castro",
    role: "Full Stack Developer",
    desc: "Bridges frontend and backend to deliver seamless experiences.",
  },
  {
    name: "Ramiro López",
    role: "AI Researcher",
    desc: "Explores new AI techniques and keeps us at the cutting edge.",
  },
  {
    name: "Gabriela Molina",
    role: "Customer Success",
    desc: "Ensures our clients get the most value from our solutions.",
  },
];

// Memoización de arrays grandes
const memoizedTeam = computed(() => team);
const memoizedFeatures = computed(() => features);

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typing = ref("");
const cursor = ref(null);
const showScrollTop = ref(false);
const scrollBtn = ref(null);
const underline = ref(null);
const cards = ref([]);

const teamTrack = ref(null);
let teamScrollTrigger = null;
let resizeTimeout = null;

function getTeamSlides() {
  const isMobile = window.innerWidth < 768;
  const perSlide = isMobile ? 1 : 3;
  const slides = [];
  for (let i = 0; i < memoizedTeam.value.length; i += perSlide) {
    slides.push(memoizedTeam.value.slice(i, i + perSlide));
  }
  return slides;
}

const teamSlides = ref(getTeamSlides());

// Debounced resize handler
function debouncedResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    teamSlides.value = getTeamSlides();
  }, 150);
}

window.addEventListener('resize', debouncedResize);

const prompts = {
  airline: {
    label: 'Aerolínea',
    examples: [
      [
        '✈️ # System Prompt',
        'Eres AeroBot, tu asistente virtual de aerolíneas.',
        'Tono cordial y profesional.',
        'Responde en español claro.',
        'Ayuda con reservas, check-in y vuelos.',
        '# Ejemplo',
        '$ User: "¿Puedo cambiar mi vuelo?"'
      ],
      [
        '🛫 # System Prompt',
        'Hola, soy AeroBot, asistente digital de la aerolínea.',
        'Responde con amabilidad y precisión.',
        'Brinda información sobre equipaje y reservas.',
        '# Ejemplo',
        '$ User: "¿Cuánto equipaje puedo llevar en cabina?"'
      ],
      [
        '✈️ # System Prompt',
        'AeroBot, asistente de vuelos.',
        'Tono profesional y empático.',
        'Responde dudas sobre horarios y servicios.',
        '# Ejemplo',
        '$ User: "¿El vuelo AM123 está demorado?"'
      ],
      [
        '🛬 # System Prompt',
        'Eres AeroBot, experto en atención al pasajero.',
        'Responde en español neutro.',
        'Ayuda con selección de asientos y embarque.',
        '# Ejemplo',
        '$ User: "¿Puedo seleccionar mi asiento online?"'
      ],
      [
        '✈️ # System Prompt',
        'AeroBot, asistente de aerolínea.',
        'Tono cercano y resolutivo.',
        'Brinda soporte para servicios especiales.',
        '# Ejemplo',
        '$ User: "¿Cómo solicito asistencia especial para mi vuelo?"'
      ]
    ]
  },
  travel: {
    label: 'Viajes',
    examples: [
      [
        '🌍 # System Prompt',
        'Eres TravelGuru, experto en viajes internacionales.',
        'Tono amigable y claro.',
        'Recomienda destinos y tips de viaje.',
        '# Ejemplo',
        '$ User: "¿Necesito visa para viajar a Brasil?"'
      ],
      [
        '🧳 # System Prompt',
        'TravelGuru, tu asesor de vacaciones.',
        'Tono cercano y entusiasta.',
        'Sugiere destinos y actividades.',
        '# Ejemplo',
        '$ User: "¿Qué destino recomendás para vacaciones en invierno?"'
      ],
      [
        '🌏 # System Prompt',
        'Eres TravelGuru, guía de viajes.',
        'Tono informativo y cordial.',
        'Ayuda a reservar tours y excursiones.',
        '# Ejemplo',
        '$ User: "¿Cómo reservo un tour en París?"'
      ],
      [
        '🗾 # System Prompt',
        'TravelGuru, experto en cultura y turismo.',
        'Tono claro y detallista.',
        'Responde sobre mejores épocas para viajar.',
        '# Ejemplo',
        '$ User: "¿Cuál es la mejor época para visitar Japón?"'
      ],
      [
        '🚗 # System Prompt',
        'Eres TravelGuru, asistente de viajes.',
        'Tono práctico y directo.',
        'Brinda información sobre alquiler de autos.',
        '# Ejemplo',
        '$ User: "¿Qué documentos necesito para alquilar un auto en Europa?"'
      ]
    ]
  },
  it: {
    label: 'Soporte IT',
    examples: [
      [
        '💻 # System Prompt',
        'Eres ITBot, soporte técnico de la empresa.',
        'Tono técnico y resolutivo.',
        'Ayuda con acceso a sistemas y correo.',
        '# Ejemplo',
        '$ User: "No puedo acceder a mi correo corporativo."'
      ],
      [
        '🔒 # System Prompt',
        'ITBot, tu asistente de tecnología.',
        'Tono profesional y paciente.',
        'Guía para configurar VPN y acceso remoto.',
        '# Ejemplo',
        '$ User: "¿Cómo configuro la VPN en mi laptop?"'
      ],
      [
        '🖥️ # System Prompt',
        'Eres ITBot, experto en soporte digital.',
        'Tono claro y directo.',
        'Responde sobre sistemas y tickets.',
        '# Ejemplo',
        '$ User: "¿El sistema de tickets está caído?"'
      ],
      [
        '🔑 # System Prompt',
        'ITBot, asistente de soporte.',
        'Tono resolutivo y cordial.',
        'Ayuda a restablecer contraseñas.',
        '# Ejemplo',
        '$ User: "¿Cómo restablezco mi contraseña?"'
      ],
      [
        '💾 # System Prompt',
        'Eres ITBot, soporte informático.',
        'Tono técnico y claro.',
        'Brinda ayuda sobre instalaciones de software.',
        '# Ejemplo',
        '$ User: "¿Puedo instalar software en mi equipo?"'
      ]
    ]
  }
};

const agentResponses = {
  airline: [
    [
      'User: "¿Puedo cambiar mi vuelo?"',
      'Agent: "¡Por supuesto! ¿Podrías indicarme tu número de reserva?"',
      'User: "Es 123456."',
      'Agent: "Gracias. Verificando... Tu tarifa permite un cambio con costo adicional. ¿Deseas continuar?"'
    ],
    [
      'User: "¿Cuánto equipaje puedo llevar en cabina?"',
      'Agent: "Puedes llevar una pieza de hasta 10kg en cabina. ¿Te gustaría saber sobre equipaje en bodega?"'
    ],
    [
      'User: "¿El vuelo AM123 está demorado?"',
      'Agent: "El vuelo AM123 está programado para salir a tiempo. ¿Necesitas información de la puerta de embarque?"'
    ],
    [
      'User: "¿Puedo seleccionar mi asiento online?"',
      'Agent: "Sí, puedes seleccionar tu asiento desde la web o la app hasta 24h antes del vuelo."'
    ],
    [
      'User: "¿Cómo solicito asistencia especial para mi vuelo?"',
      'Agent: "Claro, puedo ayudarte a solicitar asistencia especial. ¿Requieres silla de ruedas o asistencia en el embarque?"'
    ]
  ],
  travel: [
    [
      'User: "¿Necesito visa para viajar a Brasil?"',
      'Agent: "No necesitas visa para viajes turísticos menores a 90 días si eres ciudadano argentino."'
    ],
    [
      'User: "¿Qué destino recomendás para vacaciones en invierno?"',
      'Agent: "Bariloche es ideal para esquí y paisajes nevados. ¿Te gustaría info de hoteles o actividades?"'
    ],
    [
      'User: "¿Cómo reservo un tour en París?"',
      'Agent: "Puedo ayudarte a reservar tours en París. ¿Prefieres museos, gastronomía o paseos guiados?"'
    ],
    [
      'User: "¿Cuál es la mejor época para visitar Japón?"',
      'Agent: "La primavera (marzo-abril) es famosa por los cerezos en flor. ¿Te gustaría recomendaciones de ciudades?"'
    ],
    [
      'User: "¿Qué documentos necesito para alquilar un auto en Europa?"',
      'Agent: "Necesitarás tu pasaporte, licencia de conducir internacional y una tarjeta de crédito."'
    ]
  ],
  it: [
    [
      'User: "No puedo acceder a mi correo corporativo."',
      'Agent: "¿Recibes algún mensaje de error al intentar ingresar?"',
      'User: "Sí, dice contraseña incorrecta."',
      'Agent: "Te ayudo a restablecerla. ¿Prefieres recibir el enlace por email o SMS?"'
    ],
    [
      'User: "¿Cómo configuro la VPN en mi laptop?"',
      'Agent: "Debes descargar el cliente VPN desde el portal interno y seguir la guía paso a paso. ¿Te la envío?"'
    ],
    [
      'User: "¿El sistema de tickets está caído?"',
      'Agent: "No se reportan incidentes. ¿Qué error ves al intentar ingresar?"'
    ],
    [
      'User: "¿Cómo restablezco mi contraseña?"',
      'Agent: "Puedes restablecerla desde el portal de autoservicio o te envío un enlace. ¿Qué prefieres?"'
    ],
    [
      'User: "¿Puedo instalar software en mi equipo?"',
      'Agent: "Depende del software. ¿Cuál necesitas instalar? Te ayudo con el proceso o la autorización."'
    ]
  ]
};

const agentTab = ref('airline');
const promptTyping = ref(true);
const responseTyping = ref(true);
const currentExampleIdx = ref(0);

// --- AUTOAVANCE DE EJEMPLO ---
const autoAdvanceTimeout = ref(null);
const showPromptAndResponse = ref(true);

watch([
  promptTyping,
  responseTyping,
  agentTab,
  currentExampleIdx
], ([isPromptTyping, isResponseTyping, tab, idx], [oldPrompt, oldResponse, oldTab, oldIdx]) => {
  clearTimeout(autoAdvanceTimeout.value);
  // Solo avanza si ambas animaciones terminaron y hay más ejemplos
  if (!isPromptTyping && !isResponseTyping && prompts[tab].examples.length > 1) {
    autoAdvanceTimeout.value = setTimeout(() => {
      if (!promptTyping.value && !responseTyping.value && agentTab.value === tab) {
        // No ocultar los bloques antes del cambio, solo avanzar el ejemplo
        currentExampleIdx.value = (currentExampleIdx.value + 1) % prompts[tab].examples.length;
      }
    }, 4000); // 4 segundos de espera
  }
});

function onPromptTyping(val) {
  promptTyping.value = val;
}

function onResponseTyping(val) {
  responseTyping.value = val;
}

function onTabChange(tab) {
  agentTab.value = tab;
  currentExampleIdx.value = 0;
}

const promptBlockHeight = ref(null);
const promptBlockRef = ref(null);

function updatePromptBlockHeight() {
  if (promptBlockRef.value) {
    promptBlockHeight.value = promptBlockRef.value.offsetHeight;
  }
}

watch([
  () => agentTab.value,
  () => currentExampleIdx.value,
  promptTyping,
], () => {
  nextTick(() => {
    updatePromptBlockHeight();
  });
});

function backToTopEnter(el, done) {
  gsap.fromTo(
    el,
    { opacity: 0, scale: 0.3, y: 40 },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.5,
      ease: "back.out(1.7)",
      onComplete: done,
    }
  );
  // Animación flotante
  gsap.to(el, {
    y: -8,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: 0.5,
  });
}

function backToTopLeave(el, done) {
  gsap.killTweensOf(el); // Limpia animaciones previas
  gsap.to(el, {
    opacity: 0,
    scale: 0.3,
    y: 40,
    duration: 0.4,
    ease: "back.in(1.7)",
    onComplete: done,
  });
}

function scrollTeamToStart() {
  const st = window.ScrollTrigger && window.ScrollTrigger.getById && window.ScrollTrigger.getById('teamPin');
  if (st) {
    window.scrollTo({ top: st.start, behavior: 'smooth' });
  } else {
    const section = document.getElementById('team');
    if (section) window.scrollTo({ top: section.offsetTop, behavior: 'smooth' });
  }
}

function scrollTeamToEnd() {
  const st = window.ScrollTrigger && window.ScrollTrigger.getById && window.ScrollTrigger.getById('teamPin');
  if (st) {
    window.scrollTo({ top: st.end, behavior: 'smooth' });
  } else {
    const section = document.getElementById('team');
    if (section) window.scrollTo({ top: section.offsetTop + section.offsetHeight - window.innerHeight, behavior: 'smooth' });
  }
}

function sectionEnter(el, done) {
  gsap.fromTo(
    el,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", onComplete: done }
  );
}
function sectionLeave(el, done) {
  gsap.to(el, { opacity: 0, y: 40, duration: 0.5, ease: "power2.in", onComplete: done });
}

function featuresEnter(el, done) {
  gsap.fromTo(
    el,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", onComplete: done }
  );
}
function featuresLeave(el, done) {
  gsap.to(el, { opacity: 0, y: 40, duration: 0.5, ease: "power2.in", onComplete: done });
}

const clientLogos = [
  { src: '/aeromexico.png', alt: 'Aeromexico' },
  { src: '/avianca.png', alt: 'Avianca' },
  { src: '/clic.png', alt: 'Clic' },
  { src: '/vite.svg', alt: 'Vite' },
  { src: '/logo.png', alt: 'OnService' },
  { src: '/aws-partner-badge.png', alt: 'AWS Partner', badge: true, label: 'Partner oficial de AWS' },
];
const currentSlide = ref(0);
const slideCount = clientLogos.length;
let autoSlideInterval = null;

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slideCount;
}
function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + slideCount) % slideCount;
}

onMounted(() => {
  autoSlideInterval = setInterval(nextSlide, 3500);
});
onBeforeUnmount(() => {
  clearInterval(autoSlideInterval);
  clearTimeout(resizeTimeout);
  window.removeEventListener('resize', debouncedResize);
});

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
const selectedModelIdx = ref(0);
const tabRefs = ref([]);
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
const featuredIdx = ref(0);
let badgeInterval = null;

onMounted(() => {
  badgeInterval = setInterval(() => {
    featuredIdx.value = (featuredIdx.value + 1) % techs.length;
  }, 4000);
});
onBeforeUnmount(() => {
  clearInterval(badgeInterval);
});
</script>

<template>
  <div class="flex min-h-screen flex-col bg-black">
    <Header />
    <main class="flex-1 bg-black pt-16 md:pt-20">
      <!-- HERO con fondo animado tipo circuito -->
      <section id="hero" class="relative w-full flex flex-col md:flex-row items-start justify-center px-4 md:px-10 py-20 md:py-28 gap-8 bg-black overflow-hidden min-h-[520px] md:min-h-[600px]">
        <CircuitBackground class="absolute inset-0 w-full h-full pointer-events-none z-0" />
        <div class="flex-1 flex flex-col items-start justify-center max-w-full md:max-w-2xl z-10 min-w-0">
          <div class="glass-hero-panel mx-auto px-4 py-8 md:px-10 md:py-10 rounded-2xl shadow-lg border border-white/10 backdrop-blur-md bg-black/40 w-full max-w-xl flex flex-col items-center text-center">
            <h1 class="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
              La nueva generación de <span class="text-violet-400">IA</span> para tu empresa
            </h1>
            <p class="text-base sm:text-lg md:text-xl text-gray-300 my-8 md:my-14">
              Soluciones de inteligencia artificial para potenciar ventas, soporte y operaciones.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 mb-2 justify-center w-full">
              <a href="#contact" class="px-8 py-3.5 rounded-xl font-semibold shadow-lg border-0 focus:outline-none focus:ring-2 focus:ring-violet-400 btn-contacto-gradient text-base min-w-[170px] text-center">Solicitar demo</a>
              <a href="https://playground.kiut.ai" target="_blank" rel="noopener" class="px-8 py-3.5 rounded-xl font-semibold border border-violet-500 text-violet-200 bg-black/60 hover:bg-violet-900/20 transition text-base min-w-[170px] text-center">Probar playground</a>
            </div>
          </div>
        </div>
        <div class="flex-1 flex flex-col items-start justify-center w-full max-w-xl z-10 min-w-[320px] md:min-w-[420px]">
          <div class="prompt-chat-stack" style="gap: 2rem; align-items: stretch; width: 100%; max-width: 560px; margin: 0 auto;">
            <div ref="promptBlockRef" style="width: 100%;">
              <CodePromptBlock
                :tab="agentTab"
                :example-idx="currentExampleIdx"
                :prompts="prompts"
                @tab-change="onTabChange"
                @typing="onPromptTyping"
              />
            </div>
            <Transition name="fade-slide">
              <AgentResponseBlock
                v-if="!promptTyping"
                class="w-full"
                :responses="agentResponses[agentTab]"
                :typing="true"
                :tab="agentTab"
                :example-idx="currentExampleIdx"
                @typing="onResponseTyping"
                :sync-height="promptBlockHeight"
              />
            </Transition>
          </div>
        </div>
      </section>

      <!-- Clientes -->
      <section id="clients" class="py-20 bg-black">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-12 relative inline-block animate-fade-in-title">
            Confían en nosotros
            <span class="block h-1 w-full max-w-[220px] min-w-[64px] mx-auto mt-2 bg-gradient-to-r from-violet-500 via-cyan-400 to-blue-400 rounded-full animate-underline"></span>
          </h2>
          <div class="relative flex items-center justify-center max-w-3xl mx-auto py-8">
            <button @click="prevSlide" aria-label="Anterior" class="absolute left-0 z-10 bg-black/60 hover:bg-violet-700/40 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200">
              <span>&lt;</span>
            </button>
            <div class="overflow-hidden w-full">
              <ul class="flex transition-transform duration-700" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
                <li v-for="(logo, idx) in clientLogos" :key="logo.src" class="flex flex-col items-center justify-center min-w-full py-6">
                  <img :src="logo.src" :alt="logo.alt" class="h-16 mx-auto mb-4" :class="logo.badge ? 'drop-shadow-lg' : ''" loading="lazy" />
                  <span v-if="logo.badge" class="text-xs text-amber-400 font-semibold mt-2">{{ logo.label }}</span>
                </li>
              </ul>
            </div>
            <button @click="nextSlide" aria-label="Siguiente" class="absolute right-0 z-10 bg-black/60 hover:bg-violet-700/40 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all duration-200">
              <span>&gt;</span>
            </button>
          </div>
          <div class="flex justify-center gap-3 mt-8">
            <button v-for="(logo, idx) in clientLogos" :key="'dot-'+idx" @click="currentSlide = idx" :class="['w-3 h-3 rounded-full', currentSlide === idx ? 'bg-violet-400' : 'bg-gray-600']" aria-label="Ir al logo" />
          </div>
        </div>
      </section>

      <!-- Tecnologías IA -->
      <section id="ai-tech" class="relative py-24 overflow-hidden">
        <ParticleBackground class="absolute inset-0 w-full h-full z-0" />
        <div class="container mx-auto px-4 text-center relative z-10">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-20">Tecnologías y Cloud
            <span class="block h-1 w-full max-w-[220px] min-w-[64px] mx-auto mt-2 bg-gradient-to-r from-violet-500 via-cyan-400 to-blue-400 rounded-full animate-underline"></span>
          </h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 max-w-5xl mx-auto mb-20">
            <div v-for="tech in techs" :key="tech.name" class="tech-card group relative flex flex-col items-center justify-center p-6 rounded-2xl glass-tech shadow-xl transition-all duration-300 cursor-pointer">
              <a :href="tech.link" target="_blank" rel="noopener" class="flex flex-col items-center justify-center w-full h-full">
                <img :src="tech.logo" :alt="tech.name" class="h-12 w-12 object-contain mb-3 transition-all duration-300 group-hover:scale-110" loading="lazy" />
                <span class="text-sm text-white/80 font-medium">{{ tech.name }}</span>
              </a>
            </div>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-white my-20">Modelos de IA
            <span class="block h-1 w-full max-w-[220px] min-w-[64px] mx-auto mt-2 bg-gradient-to-r from-violet-500 via-cyan-400 to-blue-400 rounded-full animate-underline"></span>
          </h2>
          <div class="flex flex-col md:flex-row gap-8 md:gap-12 max-w-5xl mx-auto items-stretch animate-fade-in-section">
            <!-- Tabs verticales -->
            <div class="flex md:flex-col flex-row md:w-56 w-full md:items-stretch items-center md:justify-start justify-center gap-2 md:gap-3 mb-4 md:mb-0 relative">
              <div class="hidden md:block absolute right-[-28px] top-0 h-full w-[2px] bg-gradient-to-b from-violet-500/60 via-cyan-400/40 to-blue-400/20 rounded-full"></div>
              <button v-for="(model, idx) in iaModels" :key="model.name"
                ref="el => tabRefs.value[idx] = el"
                @click="selectedModelIdx = idx"
                @keydown="handleKeydown"
                :tabindex="idx === selectedModelIdx ? 0 : -1"
                :aria-selected="idx === selectedModelIdx"
                :aria-label="model.name"
                :title="model.name"
                :class="['flex items-center gap-3 px-4 py-3 md:py-4 rounded-xl font-semibold transition-all duration-200 w-full md:w-auto outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
                  idx === selectedModelIdx
                    ? 'bg-gradient-to-r from-violet-600 via-cyan-500 to-blue-400 text-white shadow-2xl scale-105 border-l-4 border-cyan-400 animate-gradient-border'
                    : 'bg-[#23233a] text-white/70 hover:bg-violet-800/40 hover:scale-105']">
                <img :src="model.logo" :alt="model.name" class="h-7 w-7 object-contain transition-transform duration-300" :class="{'animate-pop': idx === selectedModelIdx}" loading="lazy" />
                <span class="hidden md:inline">{{ model.name }}</span>
                <span class="md:hidden">{{ model.name.split(' ')[0] }}</span>
              </button>
            </div>
            <!-- Panel de detalle -->
            <transition name="fade-slide-scale" mode="out-in">
              <div :key="iaModels[selectedModelIdx].name" class="ia-model-card flex flex-col md:flex-row items-center md:items-stretch bg-[rgba(35,35,58,0.85)] backdrop-blur-lg rounded-2xl shadow-2xl p-6 md:p-10 w-full animate-fade-in-card border border-cyan-400/10">
                <div class="flex-shrink-0 flex items-center justify-center w-20 h-20 md:w-32 md:h-32 rounded-xl bg-black/30 mr-0 md:mr-10 mb-4 md:mb-0">
                  <img :src="iaModels[selectedModelIdx].logo" :alt="iaModels[selectedModelIdx].name" class="h-12 w-12 md:h-20 md:w-20 object-contain transition-transform duration-300 animate-pop" :title="iaModels[selectedModelIdx].name" loading="lazy" />
                </div>
                <div class="flex-1 flex flex-col items-center md:items-start">
                  <span class="text-xl md:text-2xl font-bold text-white mb-2">{{ iaModels[selectedModelIdx].name }}</span>
                  <span class="text-base text-white/80 mb-4">{{ iaModels[selectedModelIdx].desc }}</span>
                  <div class="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                    <span v-for="tag in iaModels[selectedModelIdx].tags" :key="tag.label" :class="['px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1', iaModels[selectedModelIdx].color]">
                      <span>{{ tag.icon }}</span> {{ tag.label }}
                    </span>
                  </div>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-3 w-full mb-4">
                    <div class="flex flex-col items-center md:items-start">
                      <span class="text-xs text-white/60">Velocidad</span>
                      <span class="font-semibold text-white">{{ iaModels[selectedModelIdx].speed }}</span>
                    </div>
                    <div class="flex flex-col items-center md:items-start">
                      <span class="text-xs text-white/60">Contexto</span>
                      <span class="font-semibold text-white">{{ iaModels[selectedModelIdx].context }}</span>
                    </div>
                    <div class="flex flex-col items-center md:items-start">
                      <span class="text-xs text-white/60">Precio</span>
                      <span class="font-semibold text-white">{{ iaModels[selectedModelIdx].price }}</span>
                    </div>
                    <div class="flex flex-col items-center md:items-start">
                      <span class="text-xs text-white/60">Web</span>
                      <a :href="iaModels[selectedModelIdx].link" target="_blank" rel="noopener" class="text-cyan-400 underline hover:text-violet-400 transition-colors text-xs">Ver más</a>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </section>

      <!-- Casos de uso -->
      <section id="usecases" class="py-20 bg-black">
        <div class="container mx-auto px-4">
          <UseCasesTabs />
        </div>
      </section>

      <!-- Métricas -->
      <section id="metrics" class="py-20 bg-gradient-to-b from-black via-[#18181b] to-black">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-8 relative inline-block animate-fade-in-title">
            Resultados en números
            <span class="block h-1 w-full max-w-[220px] min-w-[64px] mx-auto mt-2 bg-gradient-to-r from-violet-500 via-cyan-400 to-blue-400 rounded-full animate-underline"></span>
          </h2>
          <div class="flex flex-wrap justify-center gap-12">
            <div class="flex flex-col items-center">
              <span class="text-5xl font-bold text-violet-400">+98%</span>
              <span class="text-gray-300 mt-2">Satisfacción de clientes</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-5xl font-bold text-violet-400">-40%</span>
              <span class="text-gray-300 mt-2">Costos operativos</span>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-5xl font-bold text-violet-400">+3x</span>
              <span class="text-gray-300 mt-2">Ventas por canal digital</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing (sin precios) -->
      <section id="pricing" class="py-20 bg-black">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-8 relative inline-block animate-fade-in-title">
            Planes y características
            <span class="block h-1 w-full max-w-[220px] min-w-[64px] mx-auto mt-2 bg-gradient-to-r from-violet-500 via-cyan-400 to-blue-400 rounded-full animate-underline"></span>
          </h2>
          <div class="flex flex-wrap justify-center gap-8">
            <div class="rounded-2xl bg-[#18181b] p-10 shadow-lg text-white max-w-xs w-full flex flex-col items-center">
              <h3 class="text-xl font-semibold mb-4">Starter</h3>
              <ul class="text-gray-300 text-left mb-6 space-y-2">
                <li>✔️ Chatbot IA multicanal</li>
                <li>✔️ Integración básica</li>
                <li>✔️ Soporte por email</li>
              </ul>
              <button class="px-6 py-2 rounded-xl bg-violet-600 text-white font-semibold shadow-lg hover:bg-violet-700 transition-all duration-300">Solicitar info</button>
            </div>
            <div class="rounded-2xl bg-[#18181b] p-10 shadow-lg text-white max-w-xs w-full flex flex-col items-center border-2 border-violet-600">
              <h3 class="text-xl font-semibold mb-4">Pro</h3>
              <ul class="text-gray-300 text-left mb-6 space-y-2">
                <li>✔️ Todo lo de Starter</li>
                <li>✔️ Integraciones avanzadas</li>
                <li>✔️ Soporte prioritario</li>
                <li>✔️ Analítica avanzada</li>
              </ul>
              <button class="px-6 py-2 rounded-xl bg-violet-600 text-white font-semibold shadow-lg hover:bg-violet-700 transition-all duration-300">Solicitar info</button>
            </div>
            <div class="rounded-2xl bg-[#18181b] p-10 shadow-lg text-white max-w-xs w-full flex flex-col items-center">
              <h3 class="text-xl font-semibold mb-4">Enterprise</h3>
              <ul class="text-gray-300 text-left mb-6 space-y-2">
                <li>✔️ Todo lo de Pro</li>
                <li>✔️ Integraciones personalizadas</li>
                <li>✔️ SLA dedicado</li>
                <li>✔️ Consultoría IA</li>
              </ul>
              <button class="px-6 py-2 rounded-xl bg-violet-600 text-white font-semibold shadow-lg hover:bg-violet-700 transition-all duration-300">Solicitar info</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Equipo (dummy, como antes) -->
      <section id="team" class="py-20 bg-gradient-to-b from-black via-[#18181b] to-black">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-8 relative inline-block animate-fade-in-title">
            Nuestro equipo
            <span class="block h-1 w-full max-w-[220px] min-w-[64px] mx-auto mt-2 bg-gradient-to-r from-violet-500 via-cyan-400 to-blue-400 rounded-full animate-underline"></span>
          </h2>
          <div class="flex flex-wrap justify-center gap-8">
            <div v-for="i in 6" :key="i" class="rounded-2xl bg-[#18181b] p-8 shadow-lg text-white max-w-xs w-full flex flex-col items-center">
              <div class="w-24 h-24 rounded-full bg-violet-700 mb-4"></div>
              <h3 class="text-xl font-semibold mb-1">Nombre Apellido</h3>
              <p class="text-violet-400 font-semibold mb-2">Rol</p>
              <p class="text-gray-300 text-center">Breve descripción del integrante del equipo y su aporte.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Imágenes IA (dummy) -->
      <section id="ia-images" class="py-20 bg-black">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-8 relative inline-block animate-fade-in-title">
            Imágenes generadas por IA
            <span class="block h-1 w-full max-w-[220px] min-w-[64px] mx-auto mt-2 bg-gradient-to-r from-violet-500 via-cyan-400 to-blue-400 rounded-full animate-underline"></span>
          </h2>
          <div class="flex flex-wrap justify-center gap-8">
            <img src="https://placehold.co/400x300?text=IA+Image+1" alt="IA 1" class="rounded-2xl shadow-lg w-64 h-40 object-cover" loading="lazy" />
            <img src="https://placehold.co/400x300?text=IA+Image+2" alt="IA 2" class="rounded-2xl shadow-lg w-64 h-40 object-cover" loading="lazy" />
            <img src="https://placehold.co/400x300?text=IA+Image+3" alt="IA 3" class="rounded-2xl shadow-lg w-64 h-40 object-cover" loading="lazy" />
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style>
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;

  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;

  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;

  --primary: 262.1 83.3% 57.8%;
  --primary-foreground: 210 40% 98%;

  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;

  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;

  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;

  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;

  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;

  --radius: 0.5rem;
}

.dark {
  --background: 0 0 0;
  --foreground: 210 40% 98%;

  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;

  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;

  --primary: 262.1 83.3% 57.8%;
  --primary-foreground: 210 40% 98%;

  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;

  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;

  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;

  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;

  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 212.7 26.8% 83.9%;
}

* {
  border-color: hsl(var(--border));
}

body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  font-feature-settings: "rlig" 1, "calt" 1;
}

.bg-background {
  background-color: hsl(var(--background));
}

.bg-card {
  background-color: hsl(var(--card));
}

.bg-primary {
  background-color: hsl(var(--primary));
}

.bg-muted {
  background-color: hsl(var(--muted));
}

.text-primary {
  color: hsl(var(--primary));
}

.text-primary-foreground {
  color: hsl(var(--primary-foreground));
}

.text-muted-foreground {
  color: hsl(var(--muted-foreground));
}

.border-primary {
  border-color: hsl(var(--primary));
}

.container {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
  padding-right: 1.5rem;
  padding-left: 1.5rem;
}

@media (min-width: 1400px) {
  .container {
    max-width: 1400px;
  }
}

html {
  scroll-behavior: smooth;
}

section {
  position: relative;
}
section:not(:first-child):not(:last-child)::before {
  content: "";
  height: 1px;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-image: linear-gradient(
    90deg,
    #1e1e1e 0%,
    #7c3aed 60%,
    #1e1e1e 100%
  );
}

@keyframes blink {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
}

.faq-loader .dot {
  opacity: 0.2;
  animation: blink 1s infinite ease-in-out;
}

.faq-loader .dot:nth-child(1) {
  animation-delay: 0s;
}
.faq-loader .dot:nth-child(2) {
  animation-delay: 0.2s;
}
.faq-loader .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-1220px);
  }
}

.scroll-container {
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  position: relative;
}

.scroll-content {
  display: flex;
  animation: scroll 10s linear infinite;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.feature-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(139, 92, 246, 0.1);
}

.feature-card:hover {
  border-color: rgba(139, 92, 246, 0.3);
  box-shadow: 
    0 4px 20px rgba(124, 58, 237, 0.3),
    0 0 0 1px rgba(139, 92, 246, 0.1);
}

.faq-loader .dot {
  opacity: 0.2;
}

/* Partículas flotantes */
.floating-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: linear-gradient(45deg, #8b5cf6, #a855f7);
  border-radius: 50%;
  opacity: 0.6;
  animation: float 6s ease-in-out infinite;
}

.particle-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
  animation-duration: 8s;
}

.particle-2 {
  top: 60%;
  left: 80%;
  animation-delay: 2s;
  animation-duration: 10s;
}

.particle-3 {
  top: 80%;
  left: 20%;
  animation-delay: 4s;
  animation-duration: 7s;
}

.particle-4 {
  top: 30%;
  left: 70%;
  animation-delay: 1s;
  animation-duration: 9s;
}

.particle-5 {
  top: 70%;
  left: 60%;
  animation-delay: 3s;
  animation-duration: 6s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) translateX(0px);
    opacity: 0.6;
  }
  25% {
    transform: translateY(-20px) translateX(10px);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-10px) translateX(-5px);
    opacity: 0.4;
  }
  75% {
    transform: translateY(-30px) translateX(15px);
    opacity: 0.9;
  }
}

/* Gradiente radial */
.bg-gradient-radial {
  background: radial-gradient(circle at center, var(--tw-gradient-stops));
}

/* Efecto de typing mejorado */
.typing {
  position: relative;
}

/* Mejoras en el scroll to top */
.scroll-to-top-btn {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  background-color: #7c3aed; /* bg-violet-600 */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform, box-shadow;
}
.scroll-to-top-btn:hover {
  background-color: #6d28d9; /* bg-violet-700 */
  box-shadow: 0 12px 40px rgba(139, 92, 246, 0.4);
  transform: translateY(-2px) scale(1.05);
}
.scroll-to-top-btn:active {
  transform: translateY(0) scale(0.95);
  transition: all 0.1s ease;
}

/* Efecto de pulso sutil */
.scroll-to-top-btn::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(168, 85, 247, 0.3));
  border-radius: 50%;
  z-index: -1;
  opacity: 0;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.1);
  }
  100% {
    opacity: 0;
    transform: scale(1.2);
  }
}

/* Animaciones de entrada mejoradas */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in-up {
  animation: slideInUp 0.6s ease-out;
}

/* Efecto de glassmorphism para el header */
.glass-header {
  backdrop-filter: blur(20px);
  background: rgba(0, 0, 0, 0.8);
  border-bottom: 1px solid rgba(139, 92, 246, 0.1);
}

/* Team horizontal scroll styles */
.team-horizontal-scroll {
  position: relative;
  width: 100vw;
  max-width: 100vw;
  overflow-x: hidden;
  min-height: 500px;
}
.team-panel-track {
  display: flex;
  will-change: transform;
}
.team-panel-slide {
  min-width: 100vw;
  width: 100vw;
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: visible;
}
.team-panel-slide::-webkit-scrollbar {
  display: none;
}
.team-panel-slide {
  scrollbar-width: none;
}
.avatar svg {
  animation: avatar-bounce 2.2s infinite cubic-bezier(.68,-0.55,.27,1.55);
}
@keyframes avatar-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

/* Team member card styles */
.team-member-card {
  background: rgba(24, 24, 27, 0.95);
  box-shadow: 0 4px 32px 0 rgba(124, 58, 237, 0.08);
  border: 1.5px solid rgba(139, 92, 246, 0.15);
  min-height: 420px;
  min-width: 0;
  transition: box-shadow 0.3s, border 0.3s;
}
.team-member-card:hover {
  box-shadow: 0 8px 40px 0 rgba(124, 58, 237, 0.18);
  border-color: #a78bfa;
}
@media (min-width: 768px) {
  .team-panel-slide > .flex {
    flex-direction: row;
    gap: 2rem;
  }
}
@media (max-width: 767px) {
  .team-panel-slide > .flex {
    flex-direction: column;
    gap: 2rem;
  }
  .team-member-card {
    max-width: 90vw;
    min-width: 0;
  }
}

@keyframes scroll-x {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.animate-scroll-x {
  animation: scroll-x 24s linear infinite;
  will-change: transform;
  transform: translateZ(0);
}

.team-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  background: rgba(124, 58, 237, 0.18);
  color: #fff;
  border: none;
  border-radius: 9999px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px 0 rgba(124, 58, 237, 0.12);
  opacity: 0.5;
  transition: opacity 0.2s, background 0.2s, box-shadow 0.2s;
}
.team-nav-btn:hover {
  opacity: 1;
  background: rgba(124, 58, 237, 0.35);
  box-shadow: 0 4px 24px 0 rgba(124, 58, 237, 0.18);
}

.btn-contacto-gradient {
  background: linear-gradient(90deg, #7c3aed 0%, #38bdf8 100%);
  color: #fff;
  font-weight: 700;
  box-shadow: 0 2px 16px 0 rgba(139, 92, 246, 0.18);
  border: none;
  transition: box-shadow 0.18s, filter 0.18s;
  filter: brightness(1);
}
.btn-contacto-gradient:hover, .btn-contacto-gradient:focus {
  filter: brightness(1.08) saturate(1.2);
  box-shadow: 0 4px 32px 0 rgba(56, 189, 248, 0.18);
}

.glass-hero-panel {
  background: rgba(17, 18, 28, 0.40);
  backdrop-filter: blur(8px) saturate(1.1);
  -webkit-backdrop-filter: blur(8px) saturate(1.1);
  border: 1.5px solid rgba(139, 92, 246, 0.10);
  box-shadow: 0 4px 24px 0 rgba(124, 58, 237, 0.08);
  z-index: 10;
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(32px);
}
.fade-slide-enter-to, .fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.prompt-chat-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
}
.code-block-container,
.agent-chat-outer-glass {
  min-width: 320px;
  max-width: 520px;
  width: 100%;
  min-height: 340px;
  height: 340px;
  margin: 0;
  padding: 0;
}
.agent-chat-glass.glass-hero-panel {
  justify-content: flex-start !important;
  padding-bottom: 1.1rem !important;
}

/* Slider styles */
#clients ul { min-width: 100%; }
#clients li { transition: opacity 0.4s; }

.glass-tech {
  background: rgba(24, 24, 32, 0.45);
  backdrop-filter: blur(8px) saturate(1.1);
  border: 1.5px solid rgba(139, 92, 246, 0.13);
  box-shadow: 0 4px 24px 0 rgba(124, 58, 237, 0.08);
  transition: box-shadow 0.25s, border 0.25s, background 0.25s;
}
.tech-card {
  position: relative;
  overflow: hidden;
  min-height: 120px;
  transition: transform 0.25s, box-shadow 0.25s;
  will-change: transform;
  transform: translateZ(0);
  background: rgba(24, 24, 32, 0.45);
  /* backdrop-filter: blur(8px) saturate(1.1); */
  border: 1.5px solid rgba(139, 92, 246, 0.13);
  box-shadow: 0 4px 24px 0 rgba(124, 58, 237, 0.08);
}
.tech-card:hover {
  transform: translateY(-8px) scale(1.06) translateZ(0);
  box-shadow: 0 8px 32px 0 rgba(56, 189, 248, 0.18);
  z-index: 2;
}
.ia-model-card {
  border: 1.5px solid rgba(139, 92, 246, 0.13);
  box-shadow: 0 4px 24px 0 rgba(124, 58, 237, 0.08);
  transition: box-shadow 0.25s, border 0.25s, background 0.25s, transform 0.25s;
  will-change: transform, box-shadow;
  transform: translateZ(0);
}
.ia-model-card:hover {
  box-shadow: 0 8px 32px 0 rgba(56, 189, 248, 0.18);
  border-color: #38bdf8;
  transform: translateZ(0);
}
@media (max-width: 768px) {
  .tech-card {
    background: rgba(24, 24, 32, 0.85) !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
    border: 1.5px solid rgba(139, 92, 246, 0.08) !important;
    padding: 1.1rem 0.5rem !important;
  }
  .ia-model-card {
    padding: 1.2rem !important;
  }
  #ai-tech .flex.md\:flex-col {
    flex-direction: row !important;
    overflow-x: auto;
    scrollbar-width: thin;
    gap: 0.5rem !important;
  }
  #ai-tech button[aria-selected="true"] {
    border-left: none;
    border-bottom: 4px solid #06b6d4;
    background: linear-gradient(90deg, #7c3aed 0%, #06b6d4 100%);
  }
  #ai-tech .absolute.right-\[-28px\] {
    display: none;
  }
  .glass-hero-panel {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
    padding-top: 2rem !important;
    padding-bottom: 2rem !important;
    max-width: 98vw !important;
  }
  #hero h1 {
    font-size: 2.1rem !important;
    line-height: 2.5rem !important;
  }
  #hero p {
    font-size: 1rem !important;
    margin-top: 1.2rem !important;
    margin-bottom: 1.2rem !important;
  }
  #hero .flex.flex-col.sm\:flex-row {
    flex-direction: column !important;
    gap: 0.7rem !important;
  }
  #hero .btn-contacto-gradient, #hero a {
    min-width: 0 !important;
    width: 100%;
    font-size: 1rem !important;
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
  }
  /* Tabs swipeables */
  .prompt-chat-stack .flex.flex-row {
    flex-wrap: nowrap !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch;
    gap: 0.5rem !important;
    padding-left: 0.7rem;
    padding-right: 0.7rem;
    scrollbar-width: none;
  }
  .prompt-chat-stack .flex.flex-row::-webkit-scrollbar {
    display: none;
  }
  /* Bloque de código/prompt responsive */
  .code-block-glass, .agent-chat-outer-glass, .agent-chat-glass.glass-hero-panel {
    max-width: 98vw !important;
    min-width: 0 !important;
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
    font-size: 13px !important;
  }
  .editor-code, .editor-gutter {
    font-size: 12px !important;
  }
  .editor-line {
    min-height: 1.1em !important;
  }
}
</style>
