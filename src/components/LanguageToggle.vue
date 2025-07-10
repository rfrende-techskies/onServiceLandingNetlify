<template>
  <button 
    @click="toggleLanguage" 
    class="relative flex items-center justify-center p-2 rounded-lg transition-all duration-300 focus:outline-none border shadow-sm"
    :class="[
      'bg-white/80 dark:bg-gray-900/80',
      'border-gray-300 dark:border-gray-700',
      'hover:shadow-md',
      'backdrop-blur-md',
      'text-gray-700 dark:text-white'
    ]"
    aria-label="Toggle language"
  >
    <!-- Language icon -->
    <svg 
      class="w-5 h-5 transition-transform duration-300" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="1.5" 
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/>
      <path d="M3 12h18M12 3a15.3 15.3 0 010 18M12 3a15.3 15.3 0 000 18" stroke="currentColor" stroke-width="1.5"/>
    </svg>
    <span class="text-xs font-bold ml-1 select-none" style="letter-spacing:0.5px;min-width:18px;">{{ currentLanguage.toUpperCase() }}</span>
    <!-- Tooltip -->
    <span 
      class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50"
    >
      {{ currentLanguage === 'es' ? 'Switch to English' : 'Cambiar a Español' }}
    </span>
  </button>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const currentLanguage = ref('es')
const isMounted = ref(false)

const isDark = ref(false)

function updateIsDark() {
  isDark.value = document.documentElement.classList.contains('dark')
}

function getInitialLanguage() {
  if (localStorage.language === 'en' || localStorage.language === 'es') {
    return localStorage.language
  }
  return 'es'
}

function toggleLanguage() {
  currentLanguage.value = currentLanguage.value === 'es' ? 'en' : 'es'
  locale.value = currentLanguage.value
  localStorage.language = currentLanguage.value
}

onMounted(() => {
  isMounted.value = true
  currentLanguage.value = getInitialLanguage()
  locale.value = currentLanguage.value
  updateIsDark()
  // Escuchar cambios en la clase dark
  const observer = new MutationObserver(updateIsDark)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

watch(currentLanguage, (lang) => {
  locale.value = lang
  localStorage.language = lang
})
</script> 