<template>
  <section class="relative w-full min-h-[calc(100vh-80px)] pt-6 md:pt-16 pb-12 md:pb-20 flex items-center justify-center bg-transparent overflow-hidden">
    <!-- Circuit background decorativo -->
    <div class="absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
      <CircuitBackground />
    </div>
    <div class="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-10 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-20 min-h-[60vh] md:min-h-[60vh] mt-12 md:mt-20">
      <!-- Columna izquierda: texto con fondo glass -->
      <div class="flex-1 flex flex-col items-center justify-center text-center md:pr-8 animate-fade-in-up order-1 md:order-none mt-4 md:mt-0">
        <div class="w-full bg-white/70 dark:bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/10 border border-white/30 dark:border-white/10 py-8 md:py-16 flex flex-col items-center min-h-[420px] md:min-h-[400px] lg:min-h-[480px]">
          <!-- Ajuste de min-height para evitar saltos de layout del typewriter -->
          <div class="w-full flex flex-col items-center justify-center mb-4 md:mb-6 px-2 md:px-12">
            <TypewriterTitle
              :i18n-key="'sections.hero.title'"
              :subtitle-i18n-key="'sections.hero.subtitle'"
              :badge="{ icon: `<svg class='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M13 10V3L4 14h7v7l9-11h-7z'/></svg>`, i18nKey: 'sections.hero.badge' }"
              class="hero-typewriter-minheight"
              fixedTitleHeight="min-h-[5.2rem] md:min-h-[7.2rem]"
            />
          </div>
          <p class="text-base md:text-lg text-gray-500 dark:text-gray-400 mb-6 md:mb-8 max-w-md mx-auto leading-relaxed px-2">
            {{ heroDescParts[0] }}<OnServiceAI />{{ heroDescParts[1] }}
          </p>
          <div class="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto justify-center px-4 md:px-2">
            <a href="#demo" class="group relative px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 overflow-hidden">
              <span class="relative z-10 text-sm md:text-base">{{ t('hero.cta_demo') }}</span>
              <div class="absolute inset-0 bg-gradient-to-r from-violet-700 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg class="w-4 h-4 md:w-5 md:h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </a>
            <a href="#usecases" class="group px-6 md:px-8 py-3 md:py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 md:gap-3">
              <span class="text-sm md:text-base">{{ t('hero.cta_usecases') }}</span>
              <svg class="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <!-- Columna derecha: imagen con glow -->
      <div class="flex-1 flex items-center justify-center w-full md:w-auto mb-4 md:mb-0 animate-fade-in-up delay-150 order-2 md:order-none mt-6 md:mt-0">
        <div class="relative flex items-center justify-center h-[420px] md:h-[400px] lg:h-[480px]">
          <!-- Glow/gradiente detrás del celular -->
          <div class="absolute -inset-6 md:-inset-8 rounded-full bg-gradient-to-br from-violet-400/30 via-cyan-300/20 to-white/0 blur-2xl z-0"></div>
          <img src="/hero-mano-cel.png" alt="Mockup celular IA" class="relative w-[320px] md:w-[400px] max-w-full h-auto object-contain rounded-3xl shadow-2xl shadow-black/20 z-10" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import CircuitBackground from './CircuitBackground.vue'
import TypewriterTitle from './TypewriterTitle.vue'
import OnServiceAI from './OnServiceAI.vue'
const { t } = useI18n()
const heroDescParts = computed(() => {
  const text = t('hero.description')
  console.log('Hero description:', text)
  return text.split('{brand}')
})
</script>

<style scoped>
@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.9s cubic-bezier(.4,0,.2,1) both;
}
.animate-fade-in-up.delay-150 {
  animation-delay: 0.15s;
}
@keyframes badge-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(139,92,246,0.18), 0 0 0 0 rgba(34,211,238,0.12); }
  50% { box-shadow: 0 0 16px 4px rgba(139,92,246,0.28), 0 0 8px 2px rgba(34,211,238,0.18); }
}
.animate-badge-glow {
  animation: badge-glow 2.2s infinite;
}

/* Ajuste para el min-height del typewriter para evitar saltos */
.hero-typewriter-minheight {
  min-height: 4.5rem;
}
@media (min-width: 768px) {
  .hero-typewriter-minheight {
    min-height: 7.5rem;
  }
}

/* Botones en mobile: margen horizontal y tamaño más armónico */
@media (max-width: 640px) {
  .group {
    width: 100%;
    margin-left: 0.25rem;
    margin-right: 0.25rem;
  }
  .flex-col.sm\:flex-row {
    gap: 0.75rem;
  }
}

/* Mejoras adicionales para mobile */
@media (max-width: 768px) {
  .animate-fade-in-up {
    animation-duration: 0.7s;
  }
  .animate-fade-in-up.delay-150 {
    animation-delay: 0.1s;
  }
}
</style> 