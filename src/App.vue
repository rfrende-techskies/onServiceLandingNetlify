<script setup>
import { ref } from 'vue';
import Header from './components/Header.vue';
import HeroSection from './components/HeroSection.vue';
import DemoSection from './components/DemoSection.vue';
import UseCasesSection from './components/UseCasesSection.vue';
import TeamSection from './components/TeamSection.vue';
import FooterSection from './components/FooterSection.vue';
import ClientsSection from './components/ClientsSection.vue';
import ParticleBackground from './components/ParticleBackground.vue';

const panels = [
  {
    key: 'mision',
    icon: `<svg class='w-7 h-7 text-violet-600 dark:text-white' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M12 8v4l3 3'/></svg>`,
    title: 'Misión',
    color: 'violet',
    gradient: 'bg-gradient-to-br from-violet-500 to-fuchsia-500',
    bg: 'bg-violet-100 dark:bg-violet-900',
    border: 'border-violet-400',
    iconBg: 'bg-violet-200 dark:bg-violet-700',
    titleColor: 'text-violet-700 dark:text-violet-200',
    text: 'Optimizar procesos críticos y potenciar la atención al cliente en la industria aérea global.'
  },
  {
    key: 'vision',
    icon: `<svg class='w-7 h-7 text-cyan-600 dark:text-white' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z'/></svg>`,
    title: 'Visión',
    color: 'cyan',
    gradient: 'bg-gradient-to-br from-cyan-500 to-blue-400',
    bg: 'bg-cyan-100 dark:bg-cyan-900',
    border: 'border-cyan-400',
    iconBg: 'bg-cyan-200 dark:bg-cyan-700',
    titleColor: 'text-cyan-700 dark:text-cyan-200',
    text: 'Hacer que la interacción entre aerolíneas y pasajeros sea más fluida, personalizada y eficaz que nunca.'
  },
  {
    key: 'valores',
    icon: `<svg class='w-7 h-7 text-blue-600 dark:text-white' fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24'><path stroke-linecap='round' stroke-linejoin='round' d='M5 13l4 4L19 7'/></svg>`,
    title: 'Valores',
    color: 'blue',
    gradient: 'bg-gradient-to-br from-blue-500 to-cyan-400',
    bg: 'bg-blue-100 dark:bg-blue-900',
    border: 'border-blue-400',
    iconBg: 'bg-blue-200 dark:bg-blue-700',
    titleColor: 'text-blue-700 dark:text-blue-200',
    text: 'Innovación, empatía, excelencia y compromiso con la transformación digital.'
  }
];

const selectedPanel = ref('mision');

function selectPanel(key) {
  selectedPanel.value = key;
}
</script>

<template>
  <div class="min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
    <Header />
    <main>
      <HeroSection />
      <DemoSection />
      <section id="about" class="relative py-24 bg-white dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
        <!-- Particle background -->
        <div class="absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
          <ParticleBackground />
        </div>
        <div class="relative z-10 max-w-5xl mx-auto px-4 flex flex-col items-center gap-12">
          <div class="w-full bg-white/70 dark:bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 px-8 py-12 animate-fade-in-right">
            <div class="flex items-center gap-3 mb-8">
              <span class="inline-flex items-center justify-center w-12 h-12 rounded-full shadow-md border-2 border-violet-200 dark:border-violet-700 bg-gray-100 dark:bg-gray-800">
                <svg class="w-7 h-7 text-violet-500 dark:text-cyan-300" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="currentColor" fill-opacity="0.08" />
                  <text x="12" y="16" text-anchor="middle" font-size="13" font-family="Inter, Arial, sans-serif" fill="currentColor" font-weight="bold">i</text>
                </svg>
              </span>
              <h1 class="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-cyan-400 to-blue-400 drop-shadow-lg">
                ¿Quiénes somos?
              </h1>
            </div>
            <p class="text-lg md:text-xl text-gray-800 dark:text-gray-200 mb-8 font-medium animate-fade-in">
              Somos <span class="font-bold text-violet-500 dark:text-violet-400">OnService</span>, pioneros en la intersección de <span class="text-cyan-500 dark:text-cyan-400 font-bold">IA</span>, aviación y atención al cliente. Nuestra misión: transformar la experiencia de pasajeros y empresas con tecnología de vanguardia.
            </p>
            <div class="flex flex-col md:flex-row gap-3 md:gap-6 mt-6 w-full min-h-[220px] md:min-h-[300px]">
              <div v-for="(panel, idx) in panels" :key="panel.key" @click="selectPanel(panel.key)"
                :class="[
                  'group cursor-pointer flex flex-col items-center justify-center transition-all duration-700 shadow-xl rounded-2xl border-2 overflow-hidden h-[120px] md:h-[300px] min-h-[120px] md:min-h-[300px] p-3 md:p-6',
                  selectedPanel === panel.key
                    ? panel.gradient + ' border-none text-white flex-[3_1_0%] scale-105 z-10'
                    : 'bg-gray-900/40 dark:bg-gray-800/60 border border-white/10 text-white flex-1 scale-95 opacity-80',
                  idx === 0 ? 'animate-fade-in-up delay-100' : idx === 1 ? 'animate-fade-in-up delay-200' : 'animate-fade-in-up delay-300'
                ]"
                style="transition: flex-grow 0.7s cubic-bezier(.4,0,.2,1); min-width:0; min-height:0;">
                <div :class="['w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full shadow-lg mb-2 transition-all duration-300', selectedPanel === panel.key ? 'bg-white/20' : panel.iconBg]" v-html="panel.icon"></div>
                <h3 :class="['font-extrabold mb-1 transition-colors duration-300 text-center tracking-tight', selectedPanel === panel.key ? 'text-lg md:text-2xl md:text-3xl' : 'text-xs md:text-base font-semibold opacity-80']">{{ panel.title }}</h3>
                <div class="w-full flex-1 flex flex-col justify-center items-center transition-all duration-700 overflow-hidden">
                  <transition name="fade-slide-panel-text">
                    <div v-if="selectedPanel === panel.key" class="w-full flex flex-col items-center">
                      <p class="text-sm md:text-base lg:text-lg font-medium text-center mb-2 leading-snug tracking-tight" style="word-break:break-word;">{{ panel.text }}</p>
                      <p v-if="panel.key === 'mision'" class="text-xs md:text-sm lg:text-base text-white/80 text-center leading-snug tracking-tight">Nos enfocamos en la eficiencia operativa, la reducción de tiempos de respuesta y la personalización de la atención, utilizando IA de última generación para resolver los desafíos más complejos del sector aéreo.</p>
                      <p v-else-if="panel.key === 'vision'" class="text-xs md:text-sm lg:text-base text-white/80 text-center leading-snug tracking-tight">Aspiramos a liderar la transformación digital en la industria, integrando soluciones inteligentes que anticipen las necesidades de los pasajeros y mejoren la experiencia de viaje de principio a fin.</p>
                      <p v-else-if="panel.key === 'valores'" class="text-xs md:text-sm lg:text-base text-white/80 text-center leading-snug tracking-tight">Creemos en la colaboración, la transparencia y la mejora continua, impulsando la innovación con un fuerte compromiso ético y humano.</p>
                    </div>
                  </transition>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <UseCasesSection />
      <TeamSection />
      <ClientsSection />
    </main>
    <FooterSection />
  </div>
</template>

<style>
@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.9s cubic-bezier(.4,0,.2,1) both;
}
@keyframes fade-in-right {
  0% { opacity: 0; transform: translateX(40px); }
  100% { opacity: 1; transform: translateX(0); }
}
.animate-fade-in-right {
  animation: fade-in-right 1s cubic-bezier(.4,0,.2,1) both;
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-16px); }
}
.animate-float {
  animation: float 3s ease-in-out infinite;
}
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.4s, max-height 0.7s cubic-bezier(.4,0,.2,1);
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  max-height: 0;
}
.fade-slide-enter-to, .fade-slide-leave-from {
  opacity: 1;
  max-height: 400px;
}
.fade-slide-horizontal-enter-active, .fade-slide-horizontal-leave-active {
  transition: opacity 0.4s, width 0.7s cubic-bezier(.4,0,.2,1);
}
.fade-slide-horizontal-enter-from, .fade-slide-horizontal-leave-to {
  opacity: 0;
  width: 0;
}
.fade-slide-horizontal-enter-to, .fade-slide-horizontal-leave-from {
  opacity: 1;
  width: 100%;
}
.fade-slide-panel-enter-active, .fade-slide-panel-leave-active {
  transition: opacity 0.5s, max-width 0.7s cubic-bezier(.4,0,.2,1);
}
.fade-slide-panel-enter-from, .fade-slide-panel-leave-to {
  opacity: 0;
  max-width: 0;
}
.fade-slide-panel-enter-to, .fade-slide-panel-leave-from {
  opacity: 1;
  max-width: 420px;
}

.fade-slide-panel-text-enter-active {
  transition: opacity 0.5s 0.35s, transform 0.5s 0.35s;
}
.fade-slide-panel-text-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-slide-panel-text-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-panel-text-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-panel-text-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.fade-slide-panel-text-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
