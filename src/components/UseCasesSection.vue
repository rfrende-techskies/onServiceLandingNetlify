<template>
  <section id="usecases" class="relative py-20 bg-white dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
    <!-- Particle background -->
    <div class="absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
      <ParticleBackground />
    </div>
    <div class="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-10">
      <!-- Header mejorado -->
      <div class="text-center mb-20">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-semibold mb-6">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          Soluciones IA para tu producto
        </div>
        <h2 class="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
          Transformá tu atención al cliente
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Descubrí cómo las aerolíneas líderes están revolucionando su servicio al cliente con IA, 
          <span class="font-semibold text-violet-600 dark:text-violet-400">reduciendo costos hasta un 70%</span> 
          mientras mejoran la satisfacción del pasajero.
        </p>
      </div>

      <!-- Métricas impactantes - Simplificadas con violeta -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
        <div class="text-center p-8 rounded-3xl bg-white/80 dark:bg-white/10 backdrop-blur-lg border border-gray-200 dark:border-white/10 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div class="text-3xl md:text-4xl font-bold text-violet-600 dark:text-violet-400 mb-2">70%</div>
          <div class="text-sm text-gray-800 dark:text-gray-300">Reducción de costos</div>
        </div>
        <div class="text-center p-8 rounded-3xl bg-white/80 dark:bg-white/10 backdrop-blur-lg border border-gray-200 dark:border-white/10 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div class="text-3xl md:text-4xl font-bold text-violet-600 dark:text-violet-400 mb-2">24/7</div>
          <div class="text-sm text-gray-800 dark:text-gray-300">Disponibilidad</div>
        </div>
        <div class="text-center p-8 rounded-3xl bg-white/80 dark:bg-white/10 backdrop-blur-lg border border-gray-200 dark:border-white/10 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div class="text-3xl md:text-4xl font-bold text-violet-600 dark:text-violet-400 mb-2">95%</div>
          <div class="text-sm text-gray-800 dark:text-gray-300">Satisfacción</div>
        </div>
        <div class="text-center p-8 rounded-3xl bg-white/80 dark:bg-white/10 backdrop-blur-lg border border-gray-200 dark:border-white/10 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <div class="text-3xl md:text-4xl font-bold text-violet-600 dark:text-violet-400 mb-2">3s</div>
          <div class="text-sm text-gray-800 dark:text-gray-300">Tiempo respuesta</div>
        </div>
      </div>

      <!-- Canales de comunicación - Mantenemos los colores -->
      <div class="mb-20">
        <h3 class="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Integración con todos tus canales
        </h3>
        <div class="flex flex-wrap justify-center gap-4">
          <div class="flex items-center gap-3 px-6 py-3 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700/30">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            <span class="font-semibold">WhatsApp</span>
          </div>
          <div class="flex items-center gap-3 px-6 py-3 rounded-xl bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-700/30">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span class="font-semibold">Instagram</span>
          </div>
          <div class="flex items-center gap-3 px-6 py-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/30">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span class="font-semibold">Facebook</span>
          </div>
          <div class="flex items-center gap-3 px-6 py-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700/30">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span class="font-semibold">Webchat</span>
          </div>
          <div class="flex items-center gap-3 px-6 py-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/30">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
            </svg>
            <span class="font-semibold">Telegram</span>
          </div>
        </div>
      </div>

      <!-- Casos de uso mejorados - Fondos neutros -->
      <div class="grid lg:grid-cols-2 gap-8">
        <div class="group relative overflow-hidden rounded-3xl bg-white/80 dark:bg-white/10 backdrop-blur-lg border border-gray-200 dark:border-white/10 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-8 md:p-10">
          <div class="absolute top-4 right-4 w-12 h-12 bg-violet-500 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Atención 24/7 Inteligente</h3>
          <p class="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            Agentes de IA que manejan consultas complejas sobre vuelos, equipaje, reservas y check-in, 
            proporcionando respuestas instantáneas y precisas en cualquier momento del día.
          </p>
          <div class="space-y-3 mb-6">
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 bg-violet-500 rounded-full"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Reducción del 70% en costos operativos</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 bg-violet-500 rounded-full"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Mejora del 95% en satisfacción del cliente</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 bg-violet-500 rounded-full"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Tiempo de respuesta promedio: 3 segundos</span>
            </div>
          </div>
          <div class="inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 font-semibold">
            <span>Ver demo</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>

        <div class="group relative overflow-hidden rounded-3xl bg-white/80 dark:bg-white/10 backdrop-blur-lg border border-gray-200 dark:border-white/10 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-8 md:p-10">
          <div class="absolute top-4 right-4 w-12 h-12 bg-violet-500 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Gestión Automatizada de Incidencias</h3>
          <p class="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            Sistema inteligente que guía a los pasajeros en el reporte de incidencias y reclamaciones, 
            escalando automáticamente a agentes humanos solo cuando es necesario.
          </p>
          <div class="space-y-3 mb-6">
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 bg-violet-500 rounded-full"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Resolución 3x más rápida de problemas</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 bg-violet-500 rounded-full"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Optimización del 60% en recursos humanos</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 bg-violet-500 rounded-full"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Seguimiento automático de casos</span>
            </div>
          </div>
          <div class="inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 font-semibold">
            <span>Ver demo</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>

        <div class="group relative overflow-hidden rounded-3xl bg-white/80 dark:bg-white/10 backdrop-blur-lg border border-gray-200 dark:border-white/10 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-8 md:p-10">
          <div class="absolute top-4 right-4 w-12 h-12 bg-violet-500 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Soporte Operacional Interno</h3>
          <p class="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            Asistente virtual interno que proporciona acceso instantáneo a FAQs operacionales, 
            normativas y procedimientos para tripulaciones y personal de tierra.
          </p>
          <div class="space-y-3 mb-6">
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 bg-violet-500 rounded-full"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Mejora del 80% en comunicación interna</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 bg-violet-500 rounded-full"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Reducción del 50% en tiempo de capacitación</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 bg-violet-500 rounded-full"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Acceso 24/7 a información crítica</span>
            </div>
          </div>
          <div class="inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 font-semibold">
            <span>Ver demo</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>

        <div class="group relative overflow-hidden rounded-3xl bg-white/80 dark:bg-white/10 backdrop-blur-lg border border-gray-200 dark:border-white/10 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-8 md:p-10">
          <div class="absolute top-4 right-4 w-12 h-12 bg-violet-500 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Ventas Automatizadas Post-Reserva</h3>
          <p class="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            Agentes de IA que ofrecen upgrades, servicios adicionales y gestionan cambios post-reserva, 
            maximizando el ARPU y mejorando la experiencia del cliente.
          </p>
          <div class="space-y-3 mb-6">
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 bg-violet-500 rounded-full"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Incremento del 40% en ingresos auxiliares</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 bg-violet-500 rounded-full"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Reducción del 65% en carga de centros de contacto</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 bg-violet-500 rounded-full"></div>
              <span class="text-sm text-gray-600 dark:text-gray-400">Personalización automática de ofertas</span>
            </div>
          </div>
          <div class="inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 font-semibold">
            <span>Ver demo</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- CTA final -->
      <div class="text-center mt-16">
        <div class="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          Solicitar Demo Personalizada
        </div>
        <p class="text-gray-600 dark:text-gray-300 mt-4 text-sm">
          Descubrí cómo OnService puede transformar tu producto en 30 días
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import ParticleBackground from './ParticleBackground.vue'
</script> 