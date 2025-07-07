<template>
  <section class="relative w-full min-h-[calc(100vh-80px)] pt-26 pb-20 flex items-center justify-center px-4 md:px-0 bg-transparent overflow-hidden">
    <!-- Circuit background decorativo -->
    <div class="absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
      <CircuitBackground />
    </div>
    <div class="relative z-10 max-w-6xl 2xl:max-w-5xl mx-auto flex flex-col-reverse md:flex-row items-center justify-center gap-8 md:gap-14 min-h-[60vh] md:min-h-[60vh]">
      <!-- Columna izquierda: texto con fondo glass -->
      <div class="flex-1 flex flex-col items-center justify-center text-center max-w-lg md:pr-8 animate-fade-in-up">
        <div class="w-full bg-white/70 dark:bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl shadow-black/10 border border-white/30 dark:border-white/10 px-4 md:px-8 py-8 md:py-10 flex flex-col items-center">
          <h1 class="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight mb-7 text-gray-900 dark:text-white">
            La nueva generación de <span class="text-violet-500">IA</span> para tu empresa
          </h1>
          <p class="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-6 font-medium">
            Soluciones de inteligencia artificial para potenciar ventas, soporte y operaciones.
          </p>
          <p class="text-sm md:text-base text-gray-500 dark:text-gray-300 mb-10 max-w-md mx-auto">
            Automatizá la atención y hacé crecer tu negocio con OnService.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
            <a href="#demo" class="group px-7 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-violet-500 to-cyan-400 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2 text-base">
              <svg class="w-5 h-5 text-white opacity-80 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Comenzar Demo
            </a>
            <a href="#usecases" class="group px-7 py-2.5 rounded-xl font-bold text-violet-700 dark:text-cyan-200 bg-white/80 dark:bg-gray-900 border border-violet-200 dark:border-cyan-700 shadow hover:bg-violet-50 dark:hover:bg-gray-800 hover:scale-105 hover:shadow-2xl transition-all duration-200 flex items-center justify-center gap-2 text-base">
              <svg class="w-5 h-5 text-violet-500 dark:text-cyan-300 opacity-80 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 19V5a2 2 0 012-2h8a2 2 0 012 2v14M9 7h6M9 11h6M9 15h2"/></svg>
              Ver Casos de Uso
            </a>
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
import CircuitBackground from './CircuitBackground.vue'
// No props por ahora
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