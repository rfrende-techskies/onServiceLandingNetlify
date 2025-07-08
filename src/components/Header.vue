<template>
  <header
    class="fixed top-0 left-0 w-full z-50 flex justify-center mt-3 md:mt-4 px-4 md:px-8 pointer-events-none animate-header-fade-in"
  >
    <nav
      class="relative z-10 flex items-center py-2 md:py-3 px-6 md:px-10 rounded-2xl bg-white/90 dark:bg-[rgba(41,47,61,0.55)] shadow-2xl border border-white/10 pointer-events-auto w-full max-w-5xl transition-all duration-300 backdrop-blur-xl"
    >
      <!-- Logo -->
      <a
        href="#hero"
        class="flex items-center h-12 pr-4 mr-4 border-r border-gray-200 dark:border-white/10 focus:outline-none"
        aria-label="OnService Home"
      >
        <img
          src="/logo-black.png"
          alt="OnService logo black"
          class="h-10 md:h-12 w-auto transition-all duration-200 block dark:hidden"
          loading="eager"
        />
        <img
          src="/logo.png"
          alt="OnService logo"
          class="h-10 md:h-12 w-auto transition-all duration-200 hidden dark:block"
          loading="eager"
        />
      </a>

      <!-- Desktop nav -->
      <div class="flex-1 flex justify-center">
        <ul class="hidden md:flex gap-2 lg:gap-4 !text-neutral-800 dark:!text-white text-base font-medium">
          <li v-for="item in navItems" :key="item.label" class="relative group">
            <a
              :href="item.href"
              :class="[
                '!text-neutral-800 dark:!text-white',
                'px-2.5 py-1.5 rounded-lg transition font-semibold flex flex-col items-center',
                isActive(item.href) ? 'active-link' : 'nav-hover',
                'transition-all duration-200 ease-in-out'
              ]"
              @click.prevent="setActive(item.href)"
            >
              <span class="relative z-10 flex items-center gap-1">
                <span v-if="isActive(item.href)" class="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400 mr-1"></span>
                <span class="relative inline-block">
                  {{ $t('header.' + item.label) }}
                  <span v-if="isActive(item.href)" class="active-underline absolute left-0 right-0 bottom-[-6px] mx-auto"></span>
                  <span v-else class="hover-underline group-hover:opacity-100 transition-all duration-200 scale-x-0 group-hover:scale-x-100 origin-left"></span>
                </span>
              </span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Desktop contacto -->
      <a
        href="#contact"
        class="hidden md:inline-block ml-2 px-4 py-1.5 rounded-lg font-semibold shadow-md border-0 bg-gradient-to-r from-violet-500 to-cyan-400 text-white text-sm mr-2 md:mr-4"
      >
        {{ $t('header.contact') }}
      </a>

      <!-- Toggle dark/light mode -->
      <DarkToggle class="ml-2 bg-gray-100 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white transition" />

      <!-- Language toggle -->
      <LanguageToggle class="ml-2 md:ml-2 ml-4 bg-gray-100 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white transition" />

      <!-- Mobile hamburger -->
      <button
        class="md:hidden ml-4 md:ml-2 z-20 flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-violet-400"
        @click="menuOpen = !menuOpen"
        aria-label="Abrir menú"
      >
        <svg
          v-if="!menuOpen"
          xmlns="http://www.w3.org/2000/svg"
          class="w-7 h-7 text-gray-900 dark:text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 8h16M4 16h16" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          class="w-7 h-7 text-gray-900 dark:text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Mobile menu -->
      <transition name="slide-down">
        <div
          v-if="menuOpen"
          :class="[
            'fixed inset-0 z-50 flex flex-col items-center justify-start backdrop-blur-lg',
            'dark:bg-black/20',
            'bg-white/30 rounded-3xl shadow-2xl'
          ]"
          @click.self="menuOpen = false"
        >
          <nav
            class="w-full max-w-xs mx-auto bg-white/70 dark:bg-gray-900/90 rounded-3xl shadow-2xl p-8 flex flex-col gap-6 animate-fade-in-menu z-50 mt-6"
            style="box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.18), 0 1.5px 8px 0 rgba(56, 189, 248, 0.08);"
          >
            <a
              v-for="item in navItems"
              :key="item.label"
              :href="item.href"
              @click.prevent="handleMobileNav(item.href)"
              :class="[
                'block text-lg font-semibold py-3 px-4 rounded-xl text-center transition-all focus:outline-none focus:ring-2 focus:ring-violet-400 relative',
                isActive(item.href)
                  ? 'text-violet-600 dark:text-cyan-400 font-bold after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-2 after:w-8 after:h-1 after:rounded after:bg-gradient-to-r after:from-violet-500 after:to-cyan-400 after:content-[\'\']'
                  : 'text-gray-900 dark:text-white hover:bg-violet-100 dark:hover:bg-gray-800'
              ]"
            >
              {{ $t('header.' + item.label) }}
            </a>
            <a
              href="#contact"
              @click.prevent="handleMobileNav('#contact')"
              class="mt-2 px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-violet-500 to-cyan-400 text-white text-base text-center shadow-md border border-violet-200 dark:border-cyan-900 transition"
            >
              {{ $t('header.contact') }}
            </a>
          </nav>
        </div>
      </transition>
    </nav>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import DarkToggle from './DarkToggle.vue'
import LanguageToggle from './LanguageToggle.vue'

const navItems = [
  { label: 'about', href: '#about', section: 'about' },
  { label: 'usecases', href: '#usecases', section: 'usecases' },
  { label: 'team', href: '#team', section: 'team' },
  { label: 'clients', href: '#clients', section: 'clients' },
]

const activeSection = ref(null)
const atTop = ref(true)
const menuOpen = ref(false)
const isDark = ref(false)

function setActive(href) {
  activeSection.value = href
  const el = document.querySelector(href)
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 64
    window.scrollTo({ top: y, behavior: 'smooth' })
  } else {
    window.location.hash = href
  }
}

function handleMobileNav(href) {
  setActive(href)
  menuOpen.value = false
}

function isActive(href) {
  return activeSection.value === href
}

function onScroll() {
  const scrollY = window.scrollY
  atTop.value = scrollY < 80
  let found = false
  for (let i = navItems.length - 1; i >= 0; i--) {
    const section = document.querySelector(navItems[i].href)
    if (section) {
      const rect = section.getBoundingClientRect()
      if (rect.top <= 80) {
        activeSection.value = navItems[i].href
        found = true
        break
      }
    }
  }
  if (!found && scrollY < 120) {
    activeSection.value = null
  }
}

// Dark mode toggle
function toggleDarkMode() {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

onMounted(() => {
  window.addEventListener('hashchange', () => {
    menuOpen.value = false
  })
  window.addEventListener('scroll', onScroll, { passive: true })
  nextTick(onScroll)
  // Init dark mode from localStorage or system
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  } else {
    isDark.value = false
    document.documentElement.classList.remove('dark')
  }
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
@keyframes header-fade-in {
  0% { opacity: 0; transform: translateY(-32px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-header-fade-in {
  animation: header-fade-in 0.8s cubic-bezier(.4,0,.2,1) both;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity 0.3s, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-32px);
}
.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.animate-fade-in-menu {
  animation: fadeInMenu 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes fadeInMenu {
  from {
    opacity: 0;
    transform: scale(0.98) translateY(-16px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.active-link {
  color: #fff !important;
  font-weight: 700;
}

.nav-hover {
  color: #fff;
  transition: color 0.2s;
}
.nav-hover:hover,
.nav-hover:focus {
  color: #c7bfff;
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
  transition: opacity 0.18s, transform 0.2s;
  pointer-events: none;
}
.group:hover .hover-underline {
  opacity: 1;
  transform: scaleX(1);
}
</style>
