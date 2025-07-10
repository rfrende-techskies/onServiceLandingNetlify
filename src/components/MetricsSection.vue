<template>
  <section id="metrics" class="py-16">
    <div class="w-full max-w-[1440px] mx-auto px-6 md:px-10">
      <TypewriterTitle
        :i18n-key="'sections.metrics.title'"
        :subtitle-i18n-key="'sections.metrics.subtitle'"
        :badge="{ icon: `<svg class='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M13 10V3L4 14h7v7l9-11h-7z'/></svg>`, i18nKey: 'sections.metrics.badge' }"
      />
      <div class="flex flex-wrap justify-center gap-8">
        <div class="w-48 h-24 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
          Próximamente: métricas destacadas
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// No props por ahora
</script> 