<template>
  <div class="floating-social-balls">
    <!-- WhatsApp Ball -->
    <div class="social-ball whatsapp-ball" :style="{ 
      animationDelay: '0s',
      top: whatsappPosition.top + '%',
      left: whatsappPosition.left + '%'
    }">
      <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24">
        <path fill="#25D366" d="M12 2C6.477 2 2 6.477 2 12c0 1.993.583 3.85 1.59 5.41L2 22l4.707-1.553A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Z"/>
        <path fill="#fff" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.669-1.612-.916-2.21-.242-.58-.487-.5-.67-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.1 3.21 5.077 4.374.71.306 1.263.489 1.695.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347Z"/>
      </svg>
    </div>

    <!-- Instagram Ball -->
    <div class="social-ball instagram-ball" :style="{ 
      animationDelay: '1s',
      top: instagramPosition.top + '%',
      right: instagramPosition.right + '%'
    }">
      <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24">
        <rect width="20" height="20" x="2" y="2" rx="5" fill="url(#ig-gradient)"/>
        <defs>
          <linearGradient id="ig-gradient" x1="2" x2="22" y1="2" y2="22" gradientUnits="userSpaceOnUse">
            <stop stop-color="#F58529"/>
            <stop offset="0.5" stop-color="#DD2A7B"/>
            <stop offset="1" stop-color="#515BD4"/>
          </linearGradient>
        </defs>
        <circle cx="12" cy="12" r="5" fill="#fff"/>
        <circle cx="17.5" cy="6.5" r="1.5" fill="#fff"/>
      </svg>
    </div>

    <!-- Facebook Ball -->
    <div class="social-ball facebook-ball" :style="{ 
      animationDelay: '2s',
      bottom: facebookPosition.bottom + '%',
      left: facebookPosition.left + '%'
    }">
      <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24">
        <rect width="20" height="20" x="2" y="2" rx="5" fill="#1877F3"/>
        <path fill="#fff" d="M15.5 12H13v8h-3v-8H8v-3h2V7.5A3.5 3.5 0 0 1 13.5 4h2.5v3h-2.5A.5.5 0 0 0 13 7.5V9h3l-.5 3Z"/>
      </svg>
    </div>

    <!-- Telegram Ball -->
    <div class="social-ball telegram-ball" :style="{ 
      animationDelay: '3s',
      bottom: telegramPosition.bottom + '%',
      right: telegramPosition.right + '%'
    }">
      <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8">
        <circle cx="120" cy="120" r="120" fill="#229ED9"/>
        <path d="M180.5 72.5L157.5 180.5C155.5 188.5 150.5 190.5 143.5 186.5L110.5 162.5L94.5 177.5C92.5 179.5 91 181 87.5 181L90.5 146.5L157.5 85.5C160.5 82.5 157 81 153.5 84L77.5 143.5L43.5 132.5C36 130.5 36 125.5 44.5 122.5L170.5 74.5C176.5 72.5 181.5 76.5 180.5 72.5Z" fill="white"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Posiciones aleatorias para cada pelota
const whatsappPosition = ref({ top: 15, left: -2 })
const instagramPosition = ref({ top: 25, right: -2 })
const facebookPosition = ref({ bottom: 30, left: -5 })
const telegramPosition = ref({ bottom: 20, right: -3 })

// Función para generar posiciones aleatorias
const generateRandomPositions = () => {
  // WhatsApp - zona superior izquierda
  whatsappPosition.value = {
    top: Math.random() * 20 + 10, // 10-30%
    left: -(Math.random() * 3 + 1) // -1 a -4%
  }
  
  // Instagram - zona superior derecha
  instagramPosition.value = {
    top: Math.random() * 20 + 15, // 15-35%
    right: -(Math.random() * 3 + 1) // -1 a -4%
  }
  
  // Facebook - zona inferior izquierda
  facebookPosition.value = {
    bottom: Math.random() * 20 + 25, // 25-45%
    left: -(Math.random() * 5 + 2) // -2 a -7%
  }
  
  // Telegram - zona inferior derecha
  telegramPosition.value = {
    bottom: Math.random() * 20 + 15, // 15-35%
    right: -(Math.random() * 4 + 2) // -2 a -6%
  }
}

onMounted(() => {
  generateRandomPositions()
})
</script>

<style scoped>
.floating-social-balls {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 15;
}

.social-ball {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 4px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: float 6s ease-in-out infinite;
  transition: all 0.3s ease;
}

.social-ball:hover {
  transform: scale(1.1);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.15),
    0 6px 20px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  25% {
    transform: translateY(-15px) rotate(2deg);
  }
  50% {
    transform: translateY(-25px) rotate(0deg);
  }
  75% {
    transform: translateY(-15px) rotate(-2deg);
  }
}

/* Dark mode adjustments */
.dark .social-ball {
  background: rgba(30, 30, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 4px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.dark .social-ball:hover {
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.4),
    0 6px 20px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .social-ball {
    width: 50px;
    height: 50px;
  }
  
  .social-ball svg {
    width: 24px;
    height: 24px;
  }
}

/* Add some glow effects */
.social-ball::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.social-ball:hover::before {
  opacity: 1;
}
</style> 