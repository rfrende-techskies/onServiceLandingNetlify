<template>
  <section
    id="about"
    ref="aboutSection"
    class="relative w-full min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300 overflow-hidden"
  >
    <div
      class="absolute inset-0 w-full h-full z-0 pointer-events-none select-none"
    >
      <ParticleBackground />
    </div>

    <div class="w-full max-w-[1440px] mx-auto px-6 md:px-10">
    <!-- Desktop Layout (md y superior) -->
    <div class="hidden md:flex flex-row w-full min-h-screen items-start">
      <!-- Stepper y contenido (izquierda) -->
      <div
        class="w-1/2 flex flex-col items-start justify-start px-12 py-16 gap-8"
      >
        <!-- Título con Typewriter -->
        <div class="w-full mb-8">
          <TypewriterTitle
            i18nKey="about.title"
            subtitleI18nKey="about.subtitle"
            :badge="{
              icon: `<svg class='w-4 h-4' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'/></svg>`,
              text: 'Pioneros en IA y Aviación',
            }"
          />
        </div>
        
        <!-- Contenedor del stepper con altura fija -->
        <div class="relative w-full" style="height: calc(3 * 350px + 500px);">
          <!-- Línea base y línea de progreso -->
          <div
            class="absolute left-6 top-0 bottom-0 w-2 flex flex-col items-center z-0"
          >
            <!-- Línea base -->
            <div class="stepper-line-base w-full h-full rounded-full"></div>
            <!-- Línea de progreso -->
            <div
              class="stepper-line-progress w-full rounded-full"
              :style="{
                height: progressHeight + '%',
                top: 0,
                bottom: 'auto',
                transition: 'height 0.5s cubic-bezier(.4,0,.2,1)',
              }"
            ></div>
            <!-- Círculo inicio -->
            <div class="stepper-dot start"></div>
            <!-- Círculo fin -->
            <div class="stepper-dot end"></div>
          </div>
          
          <!-- Grid de steps con altura fija -->
          <div class="relative z-10 w-full h-full grid grid-rows-4">
            <div
              v-for="(step, idx) in steps"
              :key="step.key"
              class="relative flex items-center"
              :style="idx === 3 ? 'height: 500px;' : 'height: 350px;'"
            >
              <!-- Círculo del step alineado al centro vertical -->
              <div
                class="absolute z-20"
                style="left: 28px; top: 50%; width: 48px; height: 48px; transform: translate(-50%, -50%);"
              >
                <span
                  class="stepper-circle flex items-center justify-center rounded-full border-4 transition-all duration-300 text-2xl font-bold bg-white border-violet-500 text-violet-600 shadow-lg"
                  :class="[activeStep === idx ? 'active' : '']"
                  style="width: 48px; height: 48px;"
                >
                  {{ idx + 1 }}
                </span>
              </div>
              
              <!-- Contenido del step -->
              <div
                :ref="(el) => (stepRefs[idx] = el)"
                class="ml-16 w-full pr-8"
                :class="[
                  'transition-all duration-500',
                  idx === activeStep ? 'grow-desc' : 'shrink-desc',
                  idx === 3 ? 'pb-24' : '',
                ]"
              >
                <div
                  :class="[
                    'flex items-center cursor-pointer mb-4',
                    idx === activeStep
                      ? 'font-extrabold text-violet-600 dark:text-violet-400' : 'text-gray-700 dark:text-gray-300',
                  ]"
                  @click="scrollToStep(idx)"
                >
                  <span
                    :class="[
                      'text-2xl font-bold transition-all duration-500',
                      idx === activeStep ? 'grow-title' : '',
                      'group-hover:scale-[1.03] group-hover:translate-x-1',
                    ]"
                  >
                    {{ step.title() }}
                  </span>
                </div>
                
                <div class="text-left">
                  <p class="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    {{ step.descriptionParts()[0] }}
                  </p>
                  <span
                    v-if="step.badge()"
                    :class="[
                      'inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold',
                      idx % 2 === 0 ? 'bg-violet-100 text-violet-700' : 'bg-cyan-100 text-cyan-700'
                    ]"
                  >
                    {{ step.badge() }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Imagen fija (derecha) solo visible cuando la sección está en viewport -->
      <transition name="fade-slide-scale-bg" mode="out-in">
        <div v-if="showImage" class="relative w-2/5 flex items-center justify-center ml-0 z-0">
          <div ref="imageBlockRef"
            class="image-block relative rounded-3xl shadow-2xl overflow-visible"
            :class="[imageLoaded ? 'border-4 border-violet-200 dark:border-cyan-700 bg-white/70 dark:bg-gray-900/70' : 'border-0 bg-transparent']"
            :style="{width: isLargeScreen ? '570px' : '490px', height: isLargeScreen ? '570px' : '490px', maxHeight: 'calc(100vh - 120px)', opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.5s'}">
            <transition name="fade-slide-up-image-smooth" mode="out-in">
              <img
                :key="steps[activeStep].image"
                :src="steps[activeStep].image"
                :alt="steps[activeStep].title"
                class="w-full h-full object-cover rounded-3xl transition-all duration-500"
                @load="imageLoaded = true"
                @before-enter="imageLoaded = false"
              />
            </transition>
            <!-- Círculos decorativos con iconos -->
            <div class="decorative-circles pointer-events-none">
              <div v-for="(icon, i) in stepIcons[activeStep]" :key="i" class="circle-icon" :style="circleIconStyle(i)">
                <span v-html="icon"></span>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    
    <!-- Mobile Layout (menor a md) restaurado -->
    <div class="md:hidden flex flex-col w-full min-h-screen">
      <!-- Título con Typewriter -->
      <div class="w-full px-3 pt-6 pb-4">
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
      <div class="flex-1 px-2 pb-4">
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
                    {{ step.title() }}
                  </h3>
                  <p class="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
                    {{ step.descriptionParts()[0] }}
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
  </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed, nextTick } from "vue";
import { useI18n } from 'vue-i18n';
import ParticleBackground from "./ParticleBackground.vue";
import TypewriterTitle from "./TypewriterTitle.vue";
import OnServiceAI from './OnServiceAI.vue';

const { t } = useI18n();

const props = defineProps({
  forceFirstStep: { type: [Object, Boolean], required: false, default: false }
})

const aboutSection = ref(null);
const mobileScrollContainer = ref(null);
const showImage = ref(false);
const imageBlockRef = ref(null);
const steps = [
  {
    key: "historia",
    title: () => t('aboutStepper.steps[0].title'),
    descriptionParts: () => t('aboutStepper.steps[0].description').split('{brand}'),
    badge: () => t('aboutStepper.steps[0].badge'),
    image: "/mision-stepper2.png",
  },
  {
    key: "mision",
    title: () => t('aboutStepper.steps[1].title'),
    descriptionParts: () => [t('aboutStepper.steps[1].description'), ''],
    badge: () => t('aboutStepper.steps[1].badge'),
    image: "/ia-generated-02.png",
  },
  {
    key: "vision",
    title: () => t('aboutStepper.steps[2].title'),
    descriptionParts: () => [t('aboutStepper.steps[2].description'), ''],
    badge: () => t('aboutStepper.steps[2].badge'),
    image: "/vision-stepper3.png",
  },
  {
    key: "valores",
    title: () => t('aboutStepper.steps[3].title'),
    descriptionParts: () => [t('aboutStepper.steps[3].description'), ''],
    badge: () => t('aboutStepper.steps[3].badge'),
    image: "/ia-generated-04.png",
  },
];
const activeStep = ref(0);
const mobileActiveStep = ref(0);
const stepRefs = [];
const mobileStepRefs = [];
const isLargeScreen = computed(() => window.innerWidth >= 1280);

// Calcula el porcentaje de altura de la línea de progreso según el paso activo
const progressHeight = computed(() => {
  if (steps.length <= 1) return 0;
  return ((activeStep.value + 1) * (100 / steps.length));
});

// Responsive IMAGE_VISUAL_OFFSET
const IMAGE_VISUAL_OFFSET = computed(() =>
  window.innerWidth < 768 ? 120 : (activeStep.value === 3 ? 200 : 300)
);

// Posiciones de los iconos decorativos por step (puedes tunear y agregar más)
const stepIconPositions = [
  // Historia
  [
    { top: '10%', left: '-12%' },
    { top: '80%', left: '-8%' },
    { top: '15%', right: '-10%' }
  ],
  // Misión
  [
    { top: '12%', left: '-10%' },
    { top: '70%', right: '-12%' },
    { top: '60%', left: '-8%' },
    { top: '20%', right: '-8%' }
  ],
  // Visión
  [
    { top: '8%', left: '-10%' },
    { top: '60%', right: '-14%' }
  ],
  // Valores
  [
    { top: '18%', left: '-14%' },
    { top: '75%', right: '-10%' },
    { top: '40%', left: '-10%' },
    { top: '10%', right: '-12%' },
    { top: '60%', right: '-8%' }
  ]
];

// Iconos SVG para cada step (puedes tunear y agregar más)
const stepIcons = [
  // Historia
  [
    `<svg class='w-7 h-7 text-violet-500' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M2.5 19.5l19-7-7 7-2 4-2-4-7-7z'/></svg>`,
    `<svg class='w-7 h-7 text-blue-400' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10'/><path d='M8 12h8'/><path d='M12 8v8'/></svg>`,
    `<svg class='w-7 h-7 text-amber-400' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M12 8v4l3 3'/></svg>`
  ],
  // Misión
  [
    `<svg class='w-7 h-7 text-emerald-500' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10'/><path d='M12 8v4l3 3'/></svg>`,
    `<svg class='w-7 h-7 text-pink-500' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M12 2v20m10-10H2'/></svg>`,
    `<svg class='w-7 h-7 text-cyan-500' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2'/></svg>`,
    `<svg class='w-7 h-7 text-yellow-400' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M5 13l4 4L19 7'/></svg>`
  ],
  // Visión
  [
    `<svg class='w-7 h-7 text-indigo-500' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10'/><path d='M12 8v4l3 3'/></svg>`,
    `<svg class='w-7 h-7 text-yellow-400' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M12 2v20m10-10H2'/></svg>`
  ],
  // Valores
  [
    `<svg class='w-7 h-7 text-green-500' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10'/><path d='M12 8v4l3 3'/></svg>`,
    `<svg class='w-7 h-7 text-rose-400' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M12 2v20m10-10H2'/></svg>`,
    `<svg class='w-7 h-7 text-blue-400' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2'/></svg>`,
    `<svg class='w-7 h-7 text-orange-400' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10'/><path d='M8 12h8'/></svg>`,
    `<svg class='w-7 h-7 text-cyan-400' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M5 13l4 4L19 7'/></svg>`
  ]
];

function circleIconStyle(i) {
  // Usa las posiciones específicas del step activo, si existen
  const positions = stepIconPositions[activeStep.value] || [];
  return positions[i] ? { ...positions[i], animationDelay: `${i * 0.2}s` } : { top: '10%', left: '-12%' };
}

function handleDesktopScroll() {
  if (window.innerWidth < 768) return;
  // 1. Visibilidad de la imagen (ajustado para aparecer/desaparecer más tarde)
  const viewportCenter = window.scrollY + window.innerHeight / 2;
  if (aboutSection.value) {
    const sectionRect = aboutSection.value.getBoundingClientRect();
    const sectionTop = window.scrollY + sectionRect.top;
    const sectionBottom = sectionTop + sectionRect.height;
    const sectionHeight = sectionRect.height;
    const min = sectionTop + sectionHeight * 0.25;
    const max = sectionTop + sectionHeight * 0.98;
    showImage.value = viewportCenter > min && viewportCenter < max;
  }
  // 2. Step activo según scroll
  let minDist = Infinity;
  let closestIdx = 0;
  for (let i = 0; i < stepRefs.length; i++) {
    const el = stepRefs[i];
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    const elCenter = window.scrollY + rect.top + rect.height / 2;
    const dist = Math.abs(viewportCenter - elCenter);
    if (dist < minDist) {
      minDist = dist;
      closestIdx = i;
    }
  }
  activeStep.value = closestIdx;
  // 3. Imagen sticky sigue el step activo, pero nunca sube más allá del primer círculo, y suma offset visual explícito
  if (imageBlockRef.value && stepRefs[activeStep.value] && stepRefs[0]) {
    // Centro del círculo activo
    const stepEl = stepRefs[activeStep.value];
    const circle = stepEl.parentElement.querySelector('.stepper-circle.active');
    let circleCenter = stepEl.getBoundingClientRect().top + stepEl.getBoundingClientRect().height / 2;
    if (circle) {
      const circleRect = circle.getBoundingClientRect();
      circleCenter = circleRect.top + circleRect.height / 2;
    }
    // Centro del primer círculo (offset mínimo)
    const firstStepEl = stepRefs[0];
    const firstCircle = firstStepEl.parentElement.querySelector('.stepper-circle');
    let firstCircleCenter = firstStepEl.getBoundingClientRect().top + firstStepEl.getBoundingClientRect().height / 2;
    if (firstCircle) {
      const firstCircleRect = firstCircle.getBoundingClientRect();
      firstCircleCenter = firstCircleRect.top + firstCircleRect.height / 2;
    }
    const parentRect = imageBlockRef.value.parentElement.getBoundingClientRect();
    const imageHeight = imageBlockRef.value.offsetHeight || 520;
    // Sumo el offset visual explícito
    let offsetActual = circleCenter - parentRect.top - imageHeight / 2 + IMAGE_VISUAL_OFFSET.value;
    let offsetMinimo = firstCircleCenter - parentRect.top - imageHeight / 2 + IMAGE_VISUAL_OFFSET.value;
    // --- Limitar para que la imagen nunca se corte por abajo, pero nunca desaparezca ---
    const parentBottom = parentRect.top + parentRect.height;
    let maxOffset = parentBottom - parentRect.top - imageHeight;
    // Solo limitar si hay espacio suficiente
    if (maxOffset > offsetMinimo) {
      if (offsetActual > maxOffset) offsetActual = maxOffset;
      if (offsetMinimo > maxOffset) offsetMinimo = maxOffset;
    }
    const offset = Math.max(offsetActual, offsetMinimo);
    imageBlockRef.value.style.transform = `translateY(${offset}px)`;
  }
}

function scrollToStep(idx) {
  if (stepRefs[idx]) {
    stepRefs[idx].scrollIntoView({ behavior: "smooth", block: "center" });
    activeStep.value = idx;
    // Actualizo imagen sticky
    setTimeout(handleDesktopScroll, 400);
  }
}

function scrollToMobileStep(idx) {
  if (mobileStepRefs[idx] && mobileScrollContainer.value) {
    mobileStepRefs[idx].scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
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

watch(() => props.forceFirstStep && props.forceFirstStep.value, async (val) => {
  if (val) {
    activeStep.value = 0
    showImage.value = true
    imageLoaded.value = true
    await nextTick()
    handleDesktopScroll()
    if (props.forceFirstStep) props.forceFirstStep.value = false
  }
})

onMounted(() => {
  window.addEventListener('scroll', handleDesktopScroll, { passive: true });
  handleDesktopScroll();
});
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleDesktopScroll);
});

// Imagen sticky: aseguro que el offset y tamaño nunca la corten ni desaparezca, especialmente en el primer step y pantallas chicas.
// En el div de la imagen sticky:
// <div ref="imageBlockRef" class="image-block ..." :style="{width: isLargeScreen ? '600px' : '520px', height: isLargeScreen ? '600px' : '520px', maxHeight: 'calc(100vh - 120px)', opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.5s'}">
const imageLoaded = ref(false);
</script>

<style scoped>
.fade-slide-up-image-smooth-enter-active,
.fade-slide-up-image-smooth-leave-active {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-up-image-smooth-enter-from,
.fade-slide-up-image-smooth-leave-to {
  opacity: 0;
  transform: translateY(120px) scale(0.88);
}
.fade-slide-up-image-smooth-enter-to,
.fade-slide-up-image-smooth-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.fade-slide-scale-bg-enter-active,
.fade-slide-scale-bg-leave-active {
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-scale-bg-enter-from,
.fade-slide-scale-bg-leave-to {
  opacity: 0;
  transform: translateY(60px) scale(0.95);
}
.fade-slide-scale-bg-enter-to,
.fade-slide-scale-bg-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.grow-title {
  animation: growFontTitle 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 3rem !important;
  letter-spacing: -0.01em;
}
@keyframes growFontTitle {
  0% {
    font-size: 1.8rem;
  }
  100% {
    font-size: 3rem;
  }
}
.grow-desc {
  animation: growFontDesc 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1.5rem !important;
  opacity: 1;
  line-height: 1.7;
}
.shrink-desc {
  font-size: 1.2rem;
  opacity: 0.7;
  transition: font-size 0.5s, opacity 0.5s;
  line-height: 1.6;
}
@keyframes growFontDesc {
  0% {
    font-size: 1.2rem;
    opacity: 0.7;
  }
  100% {
    font-size: 1.5rem;
    opacity: 1;
  }
}

/* Línea gradiente simple del stepper */
.stepper-gradient-line {
  border-image: linear-gradient(180deg, #7c3aed 0%, #38bdf8 100%) 1;
}

/* Stepper línea base y progreso */
.stepper-line-base {
  position: absolute;
  left: 0;
  top: 0;
  width: 8px;
  height: 100%;
  background: #e5e7eb; /* gray-200 */
  z-index: 0;
}
.stepper-line-progress {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 8px;
  background: linear-gradient(180deg, #7c3aed 0%, #38bdf8 100%);
  z-index: 1;
  pointer-events: none;
  animation: pulseLine 1.5s infinite alternate;
}
.stepper-dot {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #fff;
  border: 4px solid #7c3aed;
  z-index: 2;
  box-shadow: 0 2px 8px 0 rgba(124, 58, 237, 0.1);
}
.stepper-dot.start {
  top: -11px;
  border-color: #7c3aed;
  background: linear-gradient(135deg, #7c3aed 60%, #38bdf8 100%);
}
.stepper-dot.end {
  bottom: -11px;
  border-color: #38bdf8;
  background: linear-gradient(135deg, #38bdf8 60%, #7c3aed 100%);
}
.stepper-circle {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  background: #fff;
  color: #7c3aed;
  font-size: 1.5rem;
  box-shadow: 0 2px 8px 0 rgba(124, 58, 237, 0.08);
  transition: border 0.3s, box-shadow 0.3s, background 0.3s, color 0.3s;
}
.stepper-circle.active {
  border: 4px solid #7c3aed;
  background: linear-gradient(135deg, #7c3aed 60%, #38bdf8 100%);
  color: #fff;
  box-shadow: 0 4px 16px 0 rgba(56, 189, 248, 0.18),
    0 0 0 6px rgba(124, 58, 237, 0.1);
  animation: glowStep 1s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes glowStep {
  0% {
    box-shadow: 0 0 0 0 rgba(56, 189, 248, 0.18);
  }
  100% {
    box-shadow: 0 4px 16px 0 rgba(56, 189, 248, 0.18),
      0 0 0 6px rgba(124, 58, 237, 0.1);
  }
}

/* Ocultar scrollbar en mobile */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.decorative-circles {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  pointer-events: none;
  z-index: 2;
}
.circle-icon {
  position: absolute;
  width: 54px;
  height: 54px;
  background: linear-gradient(135deg, #f3f4f6 60%, #e0e7ff 100%);
  border-radius: 50%;
  box-shadow: 0 2px 12px 0 rgba(56,189,248,0.10);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: floatCircle 3.5s ease-in-out infinite alternate;
  transition: box-shadow 0.3s;
}
.circle-icon svg {
  filter: drop-shadow(0 1px 2px rgba(124,58,237,0.10));
}
@keyframes floatCircle {
  0% { transform: scale(1) translateY(0); }
  100% { transform: scale(1.08) translateY(-12px); }
}
.image-block {
  position: absolute;
  left: 0; right: 0;
  margin: auto;
  transition: transform 0.6s cubic-bezier(.4,0,.2,1);
}

.fade-bounce-dot-enter-active {
  animation: bounceInDot 0.5s cubic-bezier(.4,0,.2,1);
}
@keyframes bounceInDot {
  0% { opacity: 0; transform: scale(0.7) translateY(40px); }
  60% { opacity: 1; transform: scale(1.1) translateY(-8px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

.fade-slide-up-image-fast-enter-active,
.fade-slide-up-image-fast-leave-active {
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-up-image-fast-enter-from,
.fade-slide-up-image-fast-leave-to {
  opacity: 0;
  transform: translateY(120px) scale(0.88);
}
.fade-slide-up-image-fast-enter-to,
.fade-slide-up-image-fast-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

@keyframes pulseLine {
  0% { filter: brightness(1); box-shadow: 0 0 0 0 #38bdf855; }
  100% { filter: brightness(1.25); box-shadow: 0 0 16px 2px #38bdf855; }
}
</style>
