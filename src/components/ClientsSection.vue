<template>
  <section id="clients" class="relative py-20 bg-white dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
    <!-- Particle background -->
    <div class="absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
      <ParticleBackground />
    </div>
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-20">
        <TypewriterTitle
          :i18n-key="'sections.clients.title'"
          :subtitle-i18n-key="'sections.clients.subtitle'"
          :badge="{ icon: `<svg class='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M13 10V3L4 14h7v7l9-11h-7z'/></svg>`, i18nKey: 'sections.clients.badge' }"
        />
      </div>

      <!-- Client Logos Carousel -->
      <div class="relative overflow-hidden">
        <div class="flex transition-transform duration-500 ease-in-out" 
             :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
          <div v-for="(logo, index) in clientLogos" :key="index" 
               class="flex-shrink-0 w-full flex items-center justify-center">
            <div class="max-w-xs mx-4">
              <div class="relative group">
                <img :src="logo.src" :alt="logo.alt" 
                     class="h-16 md:h-20 object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100">
                <div v-if="logo.badge" 
                     class="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {{ logo.label }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Arrows -->
        <button @click="prevSlide" 
                class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-900/10 dark:bg-white/10 hover:bg-gray-900/20 dark:hover:bg-white/20 text-gray-900 dark:text-white p-2 rounded-full transition-all duration-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <button @click="nextSlide" 
                class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-900/10 dark:bg-white/10 hover:bg-gray-900/20 dark:hover:bg-white/20 text-gray-900 dark:text-white p-2 rounded-full transition-all duration-300">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>

        <!-- Dots Indicator -->
        <div class="flex justify-center mt-8 space-x-2">
          <button v-for="(_, index) in clientLogos" :key="index"
                  @click="currentSlide = index"
                  :class="[
                    'w-3 h-3 rounded-full transition-all duration-300',
                    index === currentSlide 
                      ? 'bg-violet-500' 
                      : 'bg-gray-400 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'
                  ]">
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import ParticleBackground from './ParticleBackground.vue';

const clientLogos = [
  { src: '/aeromexico.png', alt: 'Aeromexico' },
  { src: '/avianca.png', alt: 'Avianca' },
  { src: '/clic.png', alt: 'Clic' },
  { src: '/vite.svg', alt: 'Vite' },
          { src: '/logo.png', alt: 'OnService.AI' },
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
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval);
  }
});
</script> 