<template>
  <section id="team" class="relative py-20 bg-white dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
    <!-- Particle background -->
    <div class="absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
      <ParticleBackground />
    </div>
    <div class="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-10">
      <TypewriterTitle
        :i18n-key="'sections.team.title'"
        :subtitle-i18n-key="'sections.team.subtitle'"
        :badge="{ icon: `<svg class='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M13 10V3L4 14h7v7l9-11h-7z'/></svg>`, i18nKey: 'sections.team.badge' }"
      />
      <div class="flex flex-wrap justify-center gap-8">
        <div class="w-48 h-48 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
          Próximamente: información del equipo
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import ParticleBackground from './ParticleBackground.vue'
import TypewriterTitle from './TypewriterTitle.vue';
// No props por ahora
</script> 