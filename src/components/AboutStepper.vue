<template>
  <section id="about" ref="aboutSection" class="relative w-full min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
    <div class="absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
      <ParticleBackground />
    </div>
    
    <!-- Desktop Layout (md y superior) -->
    <div class="hidden md:flex flex-row w-full min-h-screen">
      <!-- Stepper y contenido (izquierda) -->
      <div class="w-1/2 flex flex-col items-start justify-start px-20 py-28 gap-8">
        <!-- Título con Typewriter -->
        <div class="w-full mb-12">
          <TypewriterTitle
            i18nKey="about.title"
            subtitleI18nKey="about.subtitle"
            :badge="{
              icon: `<svg class='w-4 h-4' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'/></svg>`,
              text: 'Pioneros en IA y Aviación'
            }"
          />
        </div>
        <ol class="relative border-l-4 stepper-gradient-line ml-12 w-full scroll-snap-y scroll-smooth" style="scroll-snap-type: y mandatory;">
          <li v-for="(step, idx) in steps" :key="step.key" class="mb-36 last:mb-0 group transition-transform duration-200 hover:scale-[1.03]" style="scroll-snap-align: center;">
            <div
              :class="[
                'flex items-center cursor-pointer group',
                idx === activeStep ? 'font-extrabold text-violet-600 dark:text-cyan-400' : 'text-gray-700 dark:text-gray-300'
              ]"
              @click="scrollToStep(idx)"
            >
              <span
                :class="[
                  'w-12 h-12 flex items-center justify-center rounded-full border-4 transition-all duration-300 mr-6 text-2xl font-bold relative z-10',
                  idx === activeStep
                    ? 'bg-gradient-to-br from-violet-500 to-cyan-400 border-transparent text-white scale-110'
                    : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-violet-500 dark:text-cyan-400 opacity-80'
                ]"
              >
                {{ idx + 1 }}
              </span>
              <span :class="['text-2xl font-bold transition-all duration-500', idx === activeStep ? 'grow-title' : '']">{{ step.title }}</span>
            </div>
            <div
              :ref="el => stepRefs[idx] = el"
              class="mt-4 ml-20 max-w-xl transition-all duration-500"
              :class="[idx === activeStep ? 'grow-desc' : 'shrink-desc']"
            >
              {{ step.description }}
            </div>
          </li>
        </ol>
      </div>
      <!-- Imagen fija (derecha) solo visible cuando la sección está en viewport -->
      <transition name="fade-slide-scale-bg" mode="out-in">
        <div v-if="showImage" class="fixed right-0 top-0 w-1/2 h-screen z-0 pointer-events-none">
          <div class="relative flex justify-center items-center w-full h-full">
            <!-- Fondo blur glassmorphism -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] max-w-lg max-h-[50vh] rounded-3xl bg-white/10 dark:bg-gray-900/20 backdrop-blur-xl shadow-2xl pointer-events-none z-0"></div>
            <!-- Imagen principal -->
            <transition name="fade-slide-up-image" mode="out-in">
              <img
                :key="steps[activeStep].image"
                :src="steps[activeStep].image"
                :alt="steps[activeStep].title"
                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl border-4 border-violet-300 dark:border-cyan-700 object-cover w-[50%] h-[50%] max-w-lg max-h-[50vh] transition-all duration-500 z-10"
              />
            </transition>
          </div>
        </div>
      </transition>
    </div>

    <!-- Mobile Layout (menor a md) -->
    <div class="md:hidden flex flex-col w-full min-h-screen">
      <!-- Título con Typewriter -->
      <div class="w-full px-6 pt-12 pb-8">
        <TypewriterTitle
          i18nKey="about.title"
          subtitleI18nKey="about.subtitle"
          :badge="{
            icon: `<svg class='w-4 h-4' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'/></svg>`,
            text: 'Pioneros en IA y Aviación'
          }"
        />
      </div>

      <!-- Cards horizontales con scroll -->
      <div class="flex-1 px-6 pb-8">
        <div class="relative">
          <!-- Scroll horizontal container -->
          <div 
            ref="mobileScrollContainer"
            class="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
            @scroll="handleMobileScroll"
          >
            <div 
              v-for="(step, idx) in steps" 
              :key="step.key"
              :ref="el => mobileStepRefs[idx] = el"
              class="flex-shrink-0 w-[85vw] max-w-sm snap-center"
            >
              <!-- Card individual -->
              <div class="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-violet-100 dark:border-gray-800 overflow-hidden transition-all duration-500 hover:scale-[1.02]">
                <!-- Imagen superior -->
                <div class="relative h-48 overflow-hidden">
                  <div class="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-cyan-400/20 z-10"></div>
                  <img
                    :src="step.image"
                    :alt="step.title"
                    class="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                  <!-- Badge del número -->
                  <div class="absolute top-4 left-4 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-white text-lg font-bold shadow-lg">
                    {{ idx + 1 }}
                  </div>
                </div>
                
                <!-- Contenido -->
                <div class="p-6">
                  <h3 class="text-xl font-bold mb-3 text-violet-700 dark:text-cyan-300">
                    {{ step.title }}
                  </h3>
                  <p class="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                    {{ step.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Indicadores de progreso -->
          <div class="flex justify-center items-center gap-2 mt-6">
            <div 
              v-for="(step, idx) in steps" 
              :key="`indicator-${idx}`"
              :class="[
                'w-3 h-3 rounded-full transition-all duration-300 cursor-pointer',
                idx === mobileActiveStep 
                  ? 'bg-gradient-to-r from-violet-500 to-cyan-400 scale-125' 
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-violet-300 dark:hover:bg-cyan-600'
              ]"
              @click="scrollToMobileStep(idx)"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tiles pequeños debajo de todo -->
    <div class="w-full mt-20 flex flex-col items-center">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto px-6 md:px-0">
        <div class="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg border border-violet-100 dark:border-gray-800 p-8 flex flex-col items-center text-center">
          <div class="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 text-white text-2xl font-bold shadow-md">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm-4 4v4m0 0h4m-4 0H8"/></svg>
          </div>
          <h4 class="text-lg font-bold mb-2 text-violet-700 dark:text-cyan-300">Canalización Inteligente</h4>
          <p class="text-gray-700 dark:text-gray-300 text-base">Operamos a través de WhatsApp, Instagram, Facebook Messenger y chat web, adaptándonos a las preferencias de comunicación de cada usuario.</p>
        </div>
        <div class="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg border border-cyan-100 dark:border-gray-800 p-8 flex flex-col items-center text-center">
          <div class="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-400 text-white text-2xl font-bold shadow-md">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h2l1 2h13a1 1 0 010 2H6l-1 2H3"/></svg>
          </div>
          <h4 class="text-lg font-bold mb-2 text-cyan-700 dark:text-blue-300">Respuestas Rápidas</h4>
          <p class="text-gray-700 dark:text-gray-300 text-base">Información precisa y escalabilidad global diseñada para superar las expectativas del sector aéreo más exigente.</p>
        </div>
        <div class="bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-lg border border-blue-100 dark:border-gray-800 p-8 flex flex-col items-center text-center">
          <div class="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-white text-2xl font-bold shadow-md">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 20v-6m0 0V4m0 10l-3-3m3 3l3-3"/></svg>
          </div>
          <h4 class="text-lg font-bold mb-2 text-blue-700 dark:text-violet-300">Seguridad Garantizada</h4>
          <p class="text-gray-700 dark:text-gray-300 text-base">Compromiso total con la seguridad de los datos y la privacidad de nuestros clientes y sus pasajeros.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import ParticleBackground from './ParticleBackground.vue';
import TypewriterTitle from './TypewriterTitle.vue';

const aboutSection = ref(null);
const mobileScrollContainer = ref(null);
const showImage = ref(false);
const SCROLL_OFFSET = -120; // px, para ajustar cuándo aparece la imagen y el step activo
const IMAGE_BOTTOM_OFFSET = 480; // px, para que la imagen desaparezca mucho antes de los tiles

const steps = [
  {
    key: 'historia',
    title: 'Nuestra Historia',
    description: 'Somos OnService, pioneros en la intersección de IA, aviación y atención al cliente. Nuestro equipo combina experiencia tecnológica y conocimiento profundo del sector aéreo.',
    image: '/history-stepper1.png',
  },
  {
    key: 'mision',
    title: 'Nuestra Misión',
    description: 'Transformar la atención al cliente y optimizar procesos críticos para aerolíneas, agencias y empresas de aviación a nivel global.',
    image: '/mision-stepper2.png',
  },
  {
    key: 'vision',
    title: 'Nuestra Visión',
    description: 'Hacer que la interacción entre aerolíneas y pasajeros sea más fluida, personalizada y eficaz que nunca, superando los desafíos de la industria aérea.',
    image: '/vision-stepper3.png',
  },
  {
    key: 'valores',
    title: 'Nuestros Valores',
    description: 'Innovación continua, seguridad de los datos y entrega de valor medible. Construimos el futuro de la atención al cliente en la aviación.',
    image: '/values-stepper4.png',
  },
];

const activeStep = ref(0);
const mobileActiveStep = ref(0);
const stepRefs = [];
const mobileStepRefs = [];

function scrollToStep(idx) {
  if (stepRefs[idx]) {
    stepRefs[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
    activeStep.value = idx;
  }
}

function scrollToMobileStep(idx) {
  if (mobileStepRefs[idx] && mobileScrollContainer.value) {
    mobileStepRefs[idx].scrollIntoView({ 
      behavior: 'smooth', 
      block: 'nearest',
      inline: 'center'
    });
    mobileActiveStep.value = idx;
  }
}

function handleMobileScroll() {
  if (!mobileScrollContainer.value) return;
  
  const container = mobileScrollContainer.value;
  const scrollLeft = container.scrollLeft;
  const containerWidth = container.offsetWidth;
  const cardWidth = containerWidth * 0.85; // 85vw
  
  // Calcular qué card está más centrada
  const centerPosition = scrollLeft + containerWidth / 2;
  const activeIndex = Math.round(centerPosition / cardWidth);
  
  mobileActiveStep.value = Math.max(0, Math.min(activeIndex, steps.length - 1));
}

function handleScroll() {
  // Solo para desktop
  if (window.innerWidth >= 768) {
    // Centro del viewport con offset
    const viewportCenter = window.scrollY + window.innerHeight / 2 + SCROLL_OFFSET;

    // Mostrar imagen solo si el centro del viewport (con offset) está dentro de la sección, pero desaparece antes de los tiles
    if (aboutSection.value) {
      const sectionRect = aboutSection.value.getBoundingClientRect();
      const sectionTop = window.scrollY + sectionRect.top;
      const sectionBottom = sectionTop + sectionRect.height - IMAGE_BOTTOM_OFFSET;
      showImage.value = viewportCenter > sectionTop && viewportCenter < sectionBottom;
    }

    // Calcular el step cuyo centro está más cerca del centro del viewport (con offset)
    let minDist = Infinity;
    let closestIdx = 0;
    for (let i = 0; i < stepRefs.length; i++) {
      const el = stepRefs[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const elCenter = window.scrollY + rect.top + rect.height / 2 + SCROLL_OFFSET;
      const dist = Math.abs(viewportCenter - elCenter);
      if (dist < minDist) {
        minDist = dist;
        closestIdx = i;
      }
    }
    activeStep.value = closestIdx;
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
});
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.fade-slide-up-image-enter-active, .fade-slide-up-image-leave-active {
  transition: opacity 1s cubic-bezier(.4,0,.2,1), transform 1s cubic-bezier(.4,0,.2,1);
}
.fade-slide-up-image-enter-from, .fade-slide-up-image-leave-to {
  opacity: 0;
  transform: translateY(120px) scale(0.88);
}
.fade-slide-up-image-enter-to, .fade-slide-up-image-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.fade-slide-scale-bg-enter-active, .fade-slide-scale-bg-leave-active {
  transition: opacity 1.2s cubic-bezier(.4,0,.2,1), transform 1.2s cubic-bezier(.4,0,.2,1);
}
.fade-slide-scale-bg-enter-from, .fade-slide-scale-bg-leave-to {
  opacity: 0;
  transform: translateY(60px) scale(0.95);
}
.fade-slide-scale-bg-enter-to, .fade-slide-scale-bg-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.grow-title {
  animation: growFontTitle 0.7s cubic-bezier(.4,0,.2,1);
  font-size: 2.1rem !important;
}
@keyframes growFontTitle {
  0% { font-size: 1.2rem; }
  100% { font-size: 2.1rem; }
}
.grow-desc {
  animation: growFontDesc 0.7s cubic-bezier(.4,0,.2,1);
  font-size: 1.35rem !important;
  opacity: 1;
}
.shrink-desc {
  font-size: 1.1rem;
  opacity: 0.7;
  transition: font-size 0.5s, opacity 0.5s;
}
@keyframes growFontDesc {
  0% { font-size: 1.1rem; opacity: 0.7; }
  100% { font-size: 1.35rem; opacity: 1; }
}

/* Línea gradiente simple del stepper */
.stepper-gradient-line {
  border-image: linear-gradient(180deg, #7c3aed 0%, #38bdf8 100%) 1;
}

/* Ocultar scrollbar en mobile */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style> 