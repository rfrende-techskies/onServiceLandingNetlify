<template>
  <section class="py-20 bg-gray-800 dark:bg-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-white dark:text-gray-900 mb-4">
          Ver es creer
        </h2>
        <p class="text-lg text-gray-300 dark:text-gray-600 max-w-2xl mx-auto">
          Explora cómo KIUT transforma la atención al cliente con interfaces intuitivas y conversaciones naturales
        </p>
      </div>

      <!-- Main Image Display -->
      <div class="mb-8">
        <div class="relative rounded-2xl overflow-hidden shadow-2xl">
          <img :src="images[selectedImage].src" 
               :alt="images[selectedImage].alt"
               class="w-full h-96 md:h-[500px] object-cover">
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div class="absolute bottom-6 left-6 text-white">
            <h3 class="text-2xl font-bold mb-2">{{ images[selectedImage].title }}</h3>
            <p class="text-gray-200">{{ images[selectedImage].description }}</p>
          </div>
        </div>
      </div>

      <!-- Thumbnail Gallery -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="(image, index) in images" :key="index"
             @click="selectImage(index)"
             :class="[
               'relative cursor-pointer rounded-lg overflow-hidden transition-all duration-300 hover:scale-105',
               selectedImage === index 
                 ? 'ring-4 ring-blue-500' 
                 : 'ring-2 ring-gray-600 dark:ring-gray-400'
             ]">
          <img :src="image.src" 
               :alt="image.alt"
               class="w-full h-24 md:h-32 object-cover">
          <div class="absolute inset-0 bg-black/20 hover:bg-black/40 transition-colors duration-300"></div>
          <div class="absolute bottom-2 left-2 text-white text-xs font-medium">
            {{ image.title }}
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="text-center mt-12">
        <p class="text-gray-300 dark:text-gray-600 mb-6">
          ¿Te gusta lo que ves? Solicita una demo personalizada
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
            Solicitar Demo
          </button>
          <button class="px-8 py-4 border border-gray-300 dark:border-gray-600 text-gray-300 dark:text-gray-600 rounded-full font-semibold hover:bg-gray-700 dark:hover:bg-gray-300 hover:text-white dark:hover:text-gray-900 transition-all duration-300">
            Ver más casos de uso
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const images = [
  {
    src: '/background.png',
    alt: 'Dashboard de KIUT',
    title: 'Dashboard principal',
    description: 'Interfaz intuitiva para gestionar tus agentes virtuales'
  },
  {
    src: '/conversation.png',
    alt: 'Conversación con IA',
    title: 'Chat inteligente',
    description: 'Conversaciones naturales y contextuales'
  },
  {
    src: '/bot.png',
    alt: 'Agente virtual',
    title: 'Agente personalizado',
    description: 'Agentes configurados para tu negocio'
  },
  {
    src: '/customer-support.png',
    alt: 'Soporte al cliente',
    title: 'Atención 24/7',
    description: 'Soporte ininterrumpido para tus clientes'
  }
];

const selectedImage = ref(0);

function selectImage(index) {
  selectedImage.value = index;
}
</script> 