<template>
  <section id="team" class="relative py-20 bg-white dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
    <!-- Particle background -->
    <div class="absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
      <ParticleBackground />
    </div>
    
    <div class="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-10">
      <!-- Header con Typewriter -->
      <div class="text-center mb-16">
        <TypewriterTitle
          :i18n-key="'sections.team.title'"
          :subtitle-i18n-key="'sections.team.subtitle'"
          :badge="{ 
            icon: `<svg class='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'/></svg>`, 
            i18nKey: 'sections.team.badge' 
          }"
        />
        
        <!-- Descripción adicional -->
        <p class="mt-8 text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
          {{ t('sections.team.description') }}
        </p>
      </div>

      <!-- Grid de miembros del equipo -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div 
          v-for="(member, index) in teamMembers" 
          :key="member.name"
          class="group relative"
        >
          <!-- Card del miembro -->
          <div class="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-xl border border-violet-100 dark:border-gray-800 overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl flex flex-col h-[520px]">
            <!-- Imagen con overlay gradiente -->
            <div class="relative h-2/3 min-h-[220px] max-h-[260px] overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-cyan-400/20 to-emerald-500/20 z-10"></div>
              <template v-if="member.image">
                <img
                  :src="member.image"
                  :alt="member.name"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  @error="(e) => handleImageError(e, index)"
                  @load="() => handleImageLoad(index)"
                  :class="{ 'opacity-0': !imageLoaded[index] }"
                />
                <!-- Skeleton loader -->
                <div v-if="!imageLoaded[index]" class="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse"></div>
              </template>
              <template v-else>
                <!-- Fallback avatar -->
                <div class="flex items-center justify-center w-full h-full bg-gradient-to-br from-violet-100 to-cyan-100 dark:from-gray-800 dark:to-gray-700">
                  <svg class="w-20 h-20 text-violet-400 dark:text-cyan-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
                  </svg>
                </div>
              </template>
              <!-- Badge de posición -->
              <div class="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-violet-500 to-cyan-400 text-white text-sm font-semibold rounded-full shadow-lg">
                {{ t(member.positionKey) }}
              </div>
            </div>
            <!-- Contenido -->
            <div class="flex flex-col flex-1 p-6 justify-between">
              <div>
                <h3 class="text-2xl font-bold mb-2 text-violet-500 dark:text-violet-400 transition-colors">
                  {{ member.name }}
                </h3>
                <p class="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-4">
                  {{ t(member.bioKey) }}
                </p>
                <!-- (tags removed from here) -->
              </div>
              <!-- Redes y expertise tags -->
              <div class="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 items-center">
                <!-- LinkedIn badge (solo uno, primero) -->
                <a :href="member.linkedin || '#'" target="_blank" rel="noopener" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#0077b5] text-white hover:bg-[#005983] transition-colors gap-1 shadow-sm">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span class="font-semibold">in</span>
                </a>
                <!-- Expertise/skills tags -->
                <template v-if="member.tags && member.tags.length > 0">
                  <span 
                    v-for="tagKey in member.tags" 
                    :key="tagKey"
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md cursor-default bg-cyan-800/80 text-cyan-100 border-cyan-700/30"
                  >
                    {{ t(tagKey) }}
                  </span>
                </template>
              </div>
            </div>
          </div>
          
          <!-- Efecto de brillo en hover -->
          <div class="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-500/0 via-cyan-400/0 to-emerald-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"></div>
        </div>
      </div>

      <!-- Footer con mensaje inspirador -->
      <div class="text-center">
        <div class="max-w-4xl mx-auto">
          <div class="relative flex flex-col items-center">
            <!-- Línea decorativa degradada -->
            <div class="w-[60%] md:w-[60%] w-[80%] h-0.5 mx-auto my-8 rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 to-emerald-400 opacity-80"></div>
          </div>
          <p class="mt-8 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            {{ t('sections.team.footer') }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ParticleBackground from './ParticleBackground.vue';
import TypewriterTitle from './TypewriterTitle.vue';
import teamData from '../data/team.js';

const { t, locale } = useI18n();

// Datos del equipo desde las traducciones, asegurando array y filtrando vacíos
const teamMembers = teamData;

// Estado de carga de imágenes por miembro
const imageLoaded = ref(Array(teamMembers.length).fill(false));

// Manejo de errores de imagen por índice
const handleImageError = (event, idx) => {
  event.target.src = `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face`;
  imageLoaded.value[idx] = true;
};

// Manejo de carga exitosa de imagen por índice
const handleImageLoad = (idx) => {
  imageLoaded.value[idx] = true;
};
</script>

<style scoped>
/* Animaciones adicionales */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.group:hover .group-hover\:scale-\[1\.02\] {
  animation: float 3s ease-in-out infinite;
}

/* Efecto de brillo en las cards */
.group:hover .bg-gradient-to-r {
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.2; }
}

/* Transiciones suaves para las imágenes */
img {
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease-in-out;
}

/* Animación de carga */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Efecto de hover en los iconos de redes sociales */
.w-8.h-8:hover {
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
}

/* Animación para los tags */
@keyframes tagPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Efecto de entrada para las cards */
@keyframes cardEntrance {
  0% { 
    opacity: 0; 
    transform: translateY(30px) scale(0.95); 
  }
  100% { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
}

.group {
  animation: cardEntrance 0.6s ease-out;
}

.group:nth-child(1) { animation-delay: 0.1s; }
.group:nth-child(2) { animation-delay: 0.2s; }
.group:nth-child(3) { animation-delay: 0.3s; }

/* Mejora en el hover de las cards */
.group:hover .relative {
  transform: translateY(-8px);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style> 