<template>
  <section class="relative w-full min-h-[calc(100vh-80px)] pt-26 pb-20 flex items-center justify-center bg-transparent overflow-hidden">
    <!-- Circuit background decorativo -->
    <div class="absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
      <CircuitBackground />
    </div>
    <div class="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-10 flex flex-col-reverse md:flex-row items-center justify-center gap-8 md:gap-20 min-h-[60vh] md:min-h-[60vh] mt-20">
      <!-- Columna izquierda: texto con fondo glass -->
      <div class="flex-1 flex flex-col items-center justify-center text-center md:pr-8 animate-fade-in-up">
        <div class="w-full bg-white/70 dark:bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/10 border border-white/30 dark:border-white/10 py-8 md:py-10 flex flex-col items-center">
          <TypewriterTitle
            :i18n-key="'sections.hero.title'"
            :subtitle-i18n-key="'sections.hero.subtitle'"
            :badge="{ icon: `<svg class='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M13 10V3L4 14h7v7l9-11h-7z'/></svg>`, i18nKey: 'sections.hero.badge' }"
          />
          <p class="text-sm md:text-base text-gray-500 dark:text-gray-300 mb-10 max-w-md mx-auto">
            {{ heroDescParts[0] }}<OnServiceAI />{{ heroDescParts[1] }}
          </p>
          <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
            <a href="#demo" class="group px-7 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-violet-500 to-cyan-400 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2 text-base">{{ t('hero.cta_demo') }}</a>
            <a href="#usecases" class="group px-7 py-2.5 rounded-xl font-bold text-violet-700 dark:text-cyan-200 bg-white/80 dark:bg-gray-900 border border-violet-200 dark:border-cyan-700 shadow hover:bg-violet-50 dark:hover:bg-gray-800 hover:scale-105 hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2 text-base">{{ t('hero.cta_usecases') }}</a>
          </div>
        </div>
      </div>
      <!-- Columna derecha: imagen con glow -->
      <div class="flex-1 flex items-center justify-center w-full md:w-auto mb-8 md:mb-0 animate-fade-in-up delay-150">
        <div class="relative flex items-center justify-center">
          <!-- Glow/gradiente detrás del celular -->
          <div class="absolute -inset-6 md:-inset-8 rounded-full bg-gradient-to-br from-violet-400/30 via-cyan-300/20 to-white/0 blur-2xl z-0"></div>
          <img src="/kai-hero.png" alt="Mockup celular IA" class="relative w-[340px] md:w-[400px] max-w-full h-auto object-contain rounded-3xl shadow-2xl shadow-black/20 z-10" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import CircuitBackground from './CircuitBackground.vue'
import TypewriterTitle from './TypewriterTitle.vue'
import OnServiceAI from './OnServiceAI.vue'
const { t } = useI18n()
const heroDescParts = t('hero.description').split('{brand}')
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
</style> 