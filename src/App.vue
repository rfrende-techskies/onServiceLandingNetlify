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
import AboutSection from './components/AboutSection.vue';
import AboutStepper from './components/AboutStepper.vue';


</script>

<template>
  <div class="min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
    <Header />
    <main>
      <HeroSection />
      <section class="relative z-10 bg-white dark:bg-gray-950 transition-colors duration-300 overflow-hidden rounded-t-[32px] md:rounded-t-[64px]">
        <DemoSection />
      </section>
      <AboutStepper />
      <UseCasesSection />
      <TeamSection />
      <ClientsSection v-if="false" />
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
