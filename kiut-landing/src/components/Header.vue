<template>
  <header class="fixed top-0 left-0 w-full z-50 flex justify-center mt-3 md:mt-4 px-4 md:px-8 pointer-events-none">
    <nav class="relative z-10 flex items-center py-1 md:py-1.5 rounded-2xl bg-black/60 backdrop-blur-xl shadow-md border border-white/10 pointer-events-auto floating-nav w-full max-w-5xl">
      <!-- Logo -->
      <a href="#hero" class="flex items-center h-8 md:h-10 pr-2 mr-2 md:mr-4 border-r border-white/10 focus:outline-none" aria-label="OnService Home">
        <img src="/logo.png" alt="OnService logo" class="h-7 md:h-8 w-auto transition-all duration-200" loading="eager" />
      </a>
      <!-- Desktop nav -->
      <div class="flex-1 flex justify-center">
        <ul class="hidden md:flex gap-2 lg:gap-4 text-white/90 text-base font-medium">
          <li v-for="item in navItems" :key="item.label" class="relative group">
            <a :href="item.href"
               :class="[
                 'px-2.5 py-1.5 rounded-lg transition font-semibold flex flex-col items-center',
                 isActive(item.href) ? 'active-link' : 'nav-hover'
               ]"
               @click.prevent="setActive(item.href)">
              <span class="relative z-10 flex items-center gap-1">
                <span v-if="isActive(item.href)" class="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400 mr-1"></span>
                <span class="relative inline-block">
                  {{ item.label }}
                  <span v-if="isActive(item.href)" class="active-underline absolute left-0 right-0 bottom-[-6px] mx-auto"></span>
                  <span v-else class="hover-underline group-hover:opacity-100"></span>
                </span>
              </span>
            </a>
          </li>
        </ul>
      </div>
      <!-- Desktop contacto -->
      <a href="#contact" class="hidden md:inline-block ml-2 px-4 py-1.5 rounded-lg font-semibold shadow-md border-0 btn-contacto-gradient text-sm mr-2 md:mr-4">Contacto</a>
      <!-- Mobile hamburger -->
      <button class="md:hidden ml-auto z-20 flex items-center justify-center w-12 h-12 rounded-full bg-black/60 shadow-lg hover:bg-black/80 transition-all focus:outline-none focus:ring-2 focus:ring-violet-400" @click="menuOpen = !menuOpen" aria-label="Abrir menú">
        <svg v-if="!menuOpen" xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 8h16M4 16h16" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <!-- Mobile menu -->
      <transition name="slide-down">
        <div v-if="menuOpen" class="fixed inset-0 z-40 flex flex-col items-center justify-start pt-24 bg-black/70 backdrop-blur-xl" @click.self="menuOpen = false">
          <nav class="w-full max-w-xs mx-auto bg-black/80 rounded-2xl shadow-2xl p-6 flex flex-col gap-4 animate-fade-in-menu">
            <a v-for="item in navItems" :key="item.label" :href="item.href" @click.prevent="handleMobileNav(item.href)" class="block text-lg font-semibold text-white py-3 px-4 rounded-xl text-center transition-all hover:bg-violet-700/30 focus:outline-none focus:ring-2 focus:ring-violet-400">
              {{ item.label }}
            </a>
            <a href="#contact" @click.prevent="handleMobileNav('#contact')" class="mt-2 px-6 py-3 rounded-xl font-semibold shadow-lg border-0 btn-contacto-gradient text-lg text-center">Contacto</a>
          </nav>
        </div>
      </transition>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';

const navItems = [
  { label: 'Clientes', href: '#clients', section: 'clients' },
  { label: 'IA Tech', href: '#ai-tech', section: 'ai-tech' },
  { label: 'Casos de uso', href: '#usecases', section: 'usecases' },
  { label: 'Métricas', href: '#metrics', section: 'metrics' },
  { label: 'Planes', href: '#pricing', section: 'pricing' },
  { label: 'Equipo', href: '#team', section: 'team' },
];

const activeSection = ref(null);
const atTop = ref(true);
const menuOpen = ref(false);

function setActive(href) {
  activeSection.value = href;
  const el = document.querySelector(href);
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top: y, behavior: 'smooth' });
  } else {
    window.location.hash = href;
  }
}

function handleMobileNav(href) {
  setActive(href);
  menuOpen.value = false;
}

function isActive(href) {
  return activeSection.value === href;
}

function onScroll() {
  const scrollY = window.scrollY;
  atTop.value = scrollY < 80;
  let found = false;
  for (let i = navItems.length - 1; i >= 0; i--) {
    const section = document.querySelector(navItems[i].href);
    if (section) {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 80) {
        activeSection.value = navItems[i].href;
        found = true;
        break;
      }
    }
  }
  if (!found && scrollY < 120) {
    activeSection.value = null;
  }
}

onMounted(() => {
  window.addEventListener('hashchange', () => { menuOpen.value = false; });
  window.addEventListener('scroll', onScroll, { passive: true });
  nextTick(onScroll);
});
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<style scoped>
.floating-nav {
  box-shadow: 0 2px 12px 0 rgba(30, 41, 59, 0.10);
  border-radius: 1.2rem;
  background: rgba(17, 24, 39, 0.45);
  backdrop-filter: blur(14px);
  border: 1.2px solid rgba(139, 92, 246, 0.10);
  margin-top: 0;
  padding-left: 0;
  padding-right: 0;
}
@media (min-width: 768px) {
  .floating-nav {
    padding-left: 0;
    padding-right: 0;
  }
}
.slide-down-enter-active, .slide-down-leave-active {
  transition: opacity 0.3s, transform 0.4s cubic-bezier(.4,0,.2,1);
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  transform: translateY(-32px);
}
.slide-down-enter-to, .slide-down-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.animate-fade-in-menu {
  animation: fadeInMenu 0.5s cubic-bezier(.4,0,.2,1);
}
@keyframes fadeInMenu {
  from { opacity: 0; transform: scale(0.98) translateY(-16px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.active-link {
  background: transparent !important;
  color: #fff !important;
  font-weight: 700;
  position: relative;
  z-index: 1;
}
.active-underline {
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2px;
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(90deg, #7c3aed 0%, #38bdf8 100%);
  opacity: 1;
  transform: scaleX(0.7);
  animation: underlineFadeIn 0.25s cubic-bezier(.68,-0.55,.27,1.55);
  transition: opacity 0.2s, transform 0.2s;
  margin: 0 auto;
  width: 100%;
  pointer-events: none;
}
@keyframes underlineFadeIn {
  from { opacity: 0; transform: scaleX(0.3); }
  to { opacity: 1; transform: scaleX(0.7); }
}
.hover-underline {
  display: block;
  position: absolute;
  left: 25%;
  right: 25%;
  bottom: 4px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, #a78bfa88 0%, #38bdf888 100%);
  opacity: 0;
  transition: opacity 0.18s;
  pointer-events: none;
}
.nav-hover {
  background: transparent;
  color: #fff;
  transition: background 0.2s, color 0.2s;
  position: relative;
}
.nav-hover:hover, .nav-hover:focus {
  background: transparent;
  color: #c7bfff;
}
.group:hover .hover-underline {
  opacity: 1 !important;
}
.btn-contacto-gradient {
  background: linear-gradient(90deg, #7c3aed 0%, #38bdf8 100%);
  color: #fff;
  font-weight: 700;
  box-shadow: 0 1px 8px 0 rgba(139, 92, 246, 0.10);
  border: none;
  transition: box-shadow 0.18s, filter 0.18s;
  filter: brightness(1);
}
.btn-contacto-gradient:hover, .btn-contacto-gradient:focus {
  filter: brightness(1.08) saturate(1.2);
  box-shadow: 0 2px 16px 0 rgba(56, 189, 248, 0.13);
}
img[alt="OnService logo"] {
  border-radius: 0.6rem;
  box-shadow: none;
  padding: 0;
  margin-left: 0;
}
@media (min-width: 768px) {
  .nav-hover:focus, .active-link:focus, .btn-contacto-gradient:focus {
    outline: none !important;
    box-shadow: none !important;
  }
}
</style> 