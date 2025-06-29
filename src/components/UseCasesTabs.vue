<template>
  <section class="usecases-section relative py-24 overflow-hidden">
    <ParticleBackground class="absolute inset-0 w-full h-full z-0" />
    <div class="container mx-auto px-4 relative z-10">
      <h2 class="usecases-title text-3xl md:text-4xl font-extrabold text-white mb-10 pt-6 pb-6 text-center">
        Casos de uso
        <span class="gradient-underline block mx-auto mt-2"></span>
      </h2>
      <div class="usecases-card mx-auto rounded-3xl shadow-2xl bg-black/60 border border-[#23233a] flex flex-col md:flex-row items-stretch justify-center max-w-4xl p-6 md:p-12 gap-0 md:gap-0 animate-fade-in-section backdrop-blur-xl">
        <div class="usecases-tabs flex flex-col justify-center w-full md:w-1/2 max-w-xs md:max-w-xs mr-0 md:mr-8">
          <button
            v-for="(uc, idx) in useCases"
            :key="uc.title"
            class="usecase-tab"
            :class="{ active: idx === activeIdx }"
            @click="onTap(idx)"
            :tabindex="0"
            :aria-expanded="idx === activeIdx"
          >
            <div class="tab-title flex items-center gap-2">
              <span v-if="idx === activeIdx" class="tab-indicator"></span>
              <span class="tab-label">{{ uc.title }}</span>
            </div>
          </button>
        </div>
        <div class="usecase-image flex-1 flex items-center justify-center min-h-[260px] w-full md:w-1/2">
          <transition name="pop-fade" mode="out-in">
            <div :key="activeIdx" class="image-panel glass-hero-panel flex flex-col items-center justify-center p-5 md:p-8 rounded-2xl shadow-2xl w-full max-w-md min-h-[260px] glow-border"
              ref="imagePanel"
              @mousemove="onParallax"
              @mouseleave="resetParallax"
            >
              <img :src="useCases[activeIdx].img" :alt="useCases[activeIdx].title" class="usecase-img mb-3 rounded-xl shadow-lg object-contain h-32 md:h-44 w-auto" loading="lazy" :style="imgStyle" />
              <ul class="tab-bullets mt-1 space-y-1 w-full max-w-xs mx-auto">
                <li v-for="(b, i) in useCases[activeIdx].bullets" :key="i" class="flex items-start gap-2 text-sm md:text-base text-white/90">
                  <span class="bullet-icon shrink-0 mt-0.5" v-html="b.icon"></span>
                  <span>{{ b.text }}</span>
                </li>
              </ul>
              <div class="text-center text-white/80 text-xs md:text-sm font-medium mt-3 animate-fade-in">{{ useCases[activeIdx].highlight }}</div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import ParticleBackground from './ParticleBackground.vue';

const useCases = [
  {
    title: 'Soporte automatizado 24/7',
    bullets: [
      { icon: `<svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#7c3aed"/><path d="M9 12l2 2 4-4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`, text: 'Responde en segundos, incluso en picos de demanda.' },
      { icon: `<svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#38bdf8"/><path d="M8 12l2 2 4-4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`, text: 'Automatiza el 80% de las consultas sin perder calidad.' },
      { icon: `<svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="10" fill="#06b6d4"/><path d="M8 12l2 2 4-4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`, text: '+30% NPS, -40% en costos operativos.' },
    ],
    highlight: 'Ejemplo: "¿Puedo cambiar mi vuelo?" → "¡Claro! Te ayudo a gestionarlo en segundos."',
    img: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Upselling inteligente',
    bullets: [
      { icon: `<svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#38bdf8"/><path d="M9 12l2 2 4-4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`, text: 'Recomienda upgrades y servicios en el momento exacto.' },
      { icon: `<svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#a78bfa"/><path d="M8 12l2 2 4-4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`, text: '+20% ventas ancillaries con AI contextual.' },
      { icon: `<svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="10" fill="#7c3aed"/><path d="M8 12l2 2 4-4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`, text: 'Personalización en cada interacción.' },
    ],
    highlight: 'Ejemplo: "¿Querés sumar equipaje extra a tu reserva?"',
    img: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Integración omnicanal',
    bullets: [
      { icon: `<svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#06b6d4"/><path d="M9 12l2 2 4-4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`, text: 'Unifica WhatsApp, web y email en una sola vista.' },
      { icon: `<svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#38bdf8"/><path d="M8 12l2 2 4-4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`, text: 'Mantiene el contexto y la personalización en todos los canales.' },
      { icon: `<svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="10" fill="#a78bfa"/><path d="M8 12l2 2 4-4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`, text: 'Integración lista en 1 semana.' },
    ],
    highlight: 'Ejemplo: "Te sigo ayudando por WhatsApp o email, ¡vos elegís!"',
    img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Automatización de procesos internos',
    bullets: [
      { icon: `<svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#a78bfa"/><path d="M9 12l2 2 4-4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`, text: 'Resuelve tickets IT y RRHH en minutos.' },
      { icon: `<svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#06b6d4"/><path d="M8 12l2 2 4-4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`, text: 'Reduce el tiempo de gestión interna un 60%.' },
      { icon: `<svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="10" fill="#38bdf8"/><path d="M8 12l2 2 4-4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`, text: 'Libera a tu staff para tareas de mayor valor.' },
    ],
    highlight: 'Ejemplo: "Necesito resetear mi password" → "Listo, ya podés ingresar"',
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Asistente de ventas y onboarding',
    bullets: [
      { icon: `<svg width="16" height="16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#7c3aed"/><path d="M9 12l2 2 4-4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`, text: 'Guía a cada usuario según su perfil y necesidades.' },
      { icon: `<svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="#a78bfa"/><path d="M8 12l2 2 4-4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`, text: 'Reduce el churn inicial un 25%.' },
      { icon: `<svg width="16" height="16" fill="none" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="10" fill="#06b6d4"/><path d="M8 12l2 2 4-4" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`, text: 'Acelera la adopción y la conversión.' },
    ],
    highlight: 'Ejemplo: "¿Cómo empiezo a usar la plataforma?" → "Te guío paso a paso"',
    img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80',
  },
];

const activeIdx = ref(0);
const imagePanel = ref(null);
const parallax = ref({ x: 0, y: 0 });
const imgStyle = computed(() => {
  if (window.innerWidth < 768) return {};
  return {
    transform: `translate3d(${parallax.value.x}px, ${parallax.value.y}px, 0) scale(1.04)`,
    transition: 'transform 0.35s cubic-bezier(.4,1.6,.6,1)',
    willChange: 'transform',
  };
});
function onTap(idx) {
  activeIdx.value = idx;
}
function onParallax(e) {
  if (window.innerWidth < 768) return;
  const rect = imagePanel.value?.getBoundingClientRect();
  if (!rect) return;
  const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
  const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
  parallax.value = { x, y };
}
function resetParallax() {
  parallax.value = { x: 0, y: 0 };
}
onMounted(() => {
  window.addEventListener('resize', resetParallax);
});
</script>

<style scoped>
.usecases-section {
  position: relative;
  z-index: 1;
  background: none !important;
}
.usecases-title {
  letter-spacing: -0.01em;
}
.gradient-underline {
  width: 60px;
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(90deg, #7c3aed 0%, #38bdf8 100%);
  margin-top: 0.4rem;
}
.usecases-subtitle {
  margin-bottom: 1.5rem;
}
.usecases-card {
  width: 100%;
  align-items: flex-start;
  justify-content: center;
  gap: 1.5rem;
  background: rgba(16, 18, 28, 0.82);
  box-shadow: 0 8px 48px 0 rgba(56, 189, 248, 0.13), 0 2px 12px 0 #7c3aed22;
  backdrop-filter: blur(18px) saturate(1.08);
  border: 1.5px solid rgba(139, 92, 246, 0.13);
  animation: fadeInCard 0.8s cubic-bezier(.4,1.6,.6,1);
}
@keyframes fadeInCard {
  from { opacity: 0; transform: translateY(32px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fade-in-section {
  animation: fadeInCard 0.8s cubic-bezier(.4,1.6,.6,1);
}
.usecases-tabs {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: rgba(24, 24, 32, 0.38);
  border-radius: 1.7rem;
  box-shadow: 0 4px 32px 0 rgba(56, 189, 248, 0.08);
  padding: 1.2rem 0.7rem;
  backdrop-filter: blur(12px) saturate(1.1);
  border: 1.5px solid rgba(139, 92, 246, 0.13);
}
.usecase-tab {
  background: rgba(24, 24, 32, 0.18);
  border: none;
  outline: none;
  text-align: left;
  padding: 1.05rem 1.4rem 1.05rem 1.1rem;
  border-radius: 1.2rem;
  color: #c7c6e9;
  font-weight: 700;
  font-size: 1.08rem;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: background 0.22s, color 0.18s, box-shadow 0.18s, border 0.18s, transform 0.18s;
  position: relative;
  box-shadow: 0 1px 8px 0 rgba(56, 189, 248, 0.04);
  display: flex;
  align-items: center;
  gap: 0.9rem;
  margin-bottom: 0.1rem;
  border-bottom: 1px solid rgba(139, 92, 246, 0.07);
  min-width: 240px;
  max-width: 320px;
  min-height: 56px;
  height: 56px;
  white-space: normal;
  word-break: break-word;
}
.usecase-tab:last-child {
  border-bottom: none;
}
.usecase-tab:hover {
  background: rgba(56, 189, 248, 0.10);
  color: #fff;
  box-shadow: 0 2px 12px 0 #38bdf855, 0 1.5px 8px 0 #7c3aed33;
  transform: translateY(-2px) scale(1.025);
}
.usecase-tab.active {
  background: rgba(56, 189, 248, 0.13);
  color: #fff;
  box-shadow: 0 4px 24px 0 #38bdf844, 0 2px 12px 0 #7c3aed22;
  border: 1.5px solid #38bdf8;
  transform: scale(1.03);
  z-index: 2;
}
.tab-title {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  height: 100%;
}
.tab-label {
  display: block;
  width: 100%;
  line-height: 1.3;
  text-align: left;
}
.tab-indicator {
  display: inline-block;
  width: 6px;
  height: 32px;
  border-radius: 6px;
  background: linear-gradient(180deg, #7c3aed 0%, #38bdf8 100%);
  margin-right: 0.7rem;
  box-shadow: 0 0 8px 2px #38bdf8aa;
  animation: fadeIn 0.4s cubic-bezier(.4,1.6,.6,1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.image-panel {
  min-height: 320px;
  min-width: 260px;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: rgba(17, 18, 28, 0.22);
  border: 1.5px solid rgba(56, 189, 248, 0.08);
  box-shadow: 0 1px 8px 0 rgba(56, 189, 248, 0.05);
  backdrop-filter: blur(5px) saturate(1.01);
  transition: box-shadow 0.2s, border 0.2s, background 0.2s;
  will-change: box-shadow, border, background;
  position: relative;
  padding: 2.6rem 2.6rem 1.7rem 2.6rem;
}
.glow-border {
  box-shadow: 0 0 6px 0 #38bdf844, 0 2px 8px 0 rgba(56, 189, 248, 0.04);
  border-image: none;
}
.usecase-img {
  width: auto;
  height: 180px;
  max-width: 100%;
  object-fit: cover;
  margin-bottom: 1.4rem;
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px 0 rgba(56, 189, 248, 0.13);
  will-change: transform;
}
.image-panel .text-center {
  padding-top: 0.7rem;
  padding-bottom: 0.2rem;
  padding-left: 0.2rem;
  padding-right: 0.2rem;
  text-align: left;
  width: 100%;
}
.pop-fade-enter-active, .pop-fade-leave-active {
  transition: opacity 0.35s cubic-bezier(.4,1.6,.6,1), transform 0.35s cubic-bezier(.4,1.6,.6,1);
}
.pop-fade-enter-from, .pop-fade-leave-to {
  opacity: 0;
  transform: scale(0.98) translateY(16px);
}
.pop-fade-enter-to, .pop-fade-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}
.animate-fade-in {
  animation: fadeIn 0.7s cubic-bezier(.4,1.6,.6,1);
}
@media (max-width: 900px) {
  .usecases-card {
    flex-direction: column;
    gap: 1.5rem;
    align-items: stretch;
  }
  .image-panel {
    min-width: 0;
    max-width: 98vw;
    padding: 0.7rem 0.3rem;
  }
  .usecase-img {
    height: 60px;
  }
}
@media (max-width: 768px) {
  .usecases-section {
    padding: 1.5rem 0 1.5rem 0;
  }
  .container {
    flex-direction: column !important;
    gap: 1.5rem !important;
  }
  .usecases-tabs {
    flex-direction: row;
    gap: 0.1rem;
    overflow-x: auto;
    padding-bottom: 0.4rem;
    scrollbar-width: none;
  }
  .usecases-tabs::-webkit-scrollbar {
    display: none;
  }
  .usecase-tab {
    min-width: 120px;
    font-size: 0.95rem;
    padding: 0.5rem 0.4rem;
    margin-bottom: 0;
    margin-right: 0.2rem;
    border-radius: 0.7rem;
  }
  .image-panel {
    min-width: 0;
    max-width: 98vw;
    padding: 0.7rem 0.3rem;
  }
  .usecase-img {
    height: 38px;
  }
}
</style> 