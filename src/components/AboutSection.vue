<template>
  <section id="about" class="relative py-24 bg-white dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
    <!-- Particle background -->
    <div class="absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
      <ParticleBackground />
    </div>
    
    <div class="relative z-10 w-full max-w-[1440px] mx-auto px-2 md:px-10">
      <!-- Header con TypewriterTitle -->
      <div class="text-center mb-12">
        <TypewriterTitle 
          i18nKey="about.title" 
          subtitleI18nKey="about.subtitle"
          :badge="{ 
            icon: `<svg class='w-4 h-4' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'/></svg>`,
            text: 'Pioneros en IA y Aviación'
          }"
        />
      </div>

      <!-- Contenido principal -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <!-- Columna izquierda - Historia y misión -->
        <div class="space-y-8 animate-fade-in-left">
          <div class="bg-gradient-to-br from-violet-50 to-cyan-50 dark:from-violet-900/20 dark:to-cyan-900/20 rounded-3xl p-8 border border-violet-100 dark:border-violet-800/50 shadow-xl">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-12 h-12 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Nuestra Historia</h3>
            </div>
            <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ aboutDescParts[0] }}<OnServiceAI />{{ aboutDescParts[1] }}
            </p>
          </div>

          <div class="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-3xl p-8 border border-cyan-100 dark:border-cyan-800/50 shadow-xl">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Nuestra Misión</h3>
            </div>
            <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Transformar la atención al cliente y optimizar procesos críticos para aerolíneas, agencias y empresas de aviación a nivel global, desarrollando e implementando agentes de IA avanzados que operan a través de los canales de comunicación preferidos de los usuarios.
            </p>
          </div>
        </div>

        <!-- Columna derecha - Visión y valores -->
        <div class="space-y-8 animate-fade-in-right">
          <div class="bg-gradient-to-br from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 rounded-3xl p-8 border border-blue-100 dark:border-blue-800/50 shadow-xl">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Nuestra Visión</h3>
            </div>
            <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Hacer que la interacción entre las aerolíneas y sus pasajeros sea más fluida, personalizada y eficaz que nunca. Entendemos los desafíos únicos de la industria aérea y hemos diseñado nuestras soluciones para superar estas expectativas.
            </p>
          </div>

          <div class="bg-gradient-to-br from-violet-50 to-cyan-50 dark:from-violet-900/20 dark:to-cyan-900/20 rounded-3xl p-8 border border-violet-100 dark:border-violet-800/50 shadow-xl">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-12 h-12 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Nuestros Valores</h3>
            </div>
            <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              Estamos comprometidos con la <span class="font-bold text-violet-600 dark:text-violet-400">innovación continua</span>, la 
              <span class="font-bold text-cyan-600 dark:text-cyan-400">seguridad de los datos</span> y la entrega de un 
              <span class="font-bold text-blue-600 dark:text-blue-400">valor medible</span>. En OnService.AI, no solo desarrollamos tecnología; construimos el futuro de la atención al cliente en la aviación.
            </p>
          </div>
        </div>
      </div>

      <!-- Sección de características destacadas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div class="group bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in-up" style="animation-delay: 0.1s">
          <div class="w-16 h-16 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Canalización Inteligente</h4>
          <p class="text-gray-600 dark:text-gray-400">Operamos a través de WhatsApp, Instagram, Facebook Messenger y chat web, adaptándonos a las preferencias de comunicación de cada usuario.</p>
        </div>

        <div class="group bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in-up" style="animation-delay: 0.2s">
          <div class="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Respuestas Rápidas</h4>
          <p class="text-gray-600 dark:text-gray-400">Información precisa y escalabilidad global diseñada para superar las expectativas del sector aéreo más exigente.</p>
        </div>

        <div class="group bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in-up" style="animation-delay: 0.3s">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Seguridad Garantizada</h4>
          <p class="text-gray-600 dark:text-gray-400">Compromiso total con la seguridad de los datos y la privacidad de nuestros clientes y sus pasajeros.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import TypewriterTitle from './TypewriterTitle.vue';
import ParticleBackground from './ParticleBackground.vue';
import OnServiceAI from './OnServiceAI.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const aboutDescParts = t('about.description').split('{brand}')
</script>

<style scoped>
@keyframes fade-in-left {
  0% { opacity: 0; transform: translateX(-40px); }
  100% { opacity: 1; transform: translateX(0); }
}

@keyframes fade-in-right {
  0% { opacity: 0; transform: translateX(40px); }
  100% { opacity: 1; transform: translateX(0); }
}

@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-left {
  animation: fade-in-left 1s cubic-bezier(.4,0,.2,1) both;
}

.animate-fade-in-right {
  animation: fade-in-right 1s cubic-bezier(.4,0,.2,1) both;
}

.animate-fade-in-up {
  animation: fade-in-up 0.9s cubic-bezier(.4,0,.2,1) both;
}
</style> 