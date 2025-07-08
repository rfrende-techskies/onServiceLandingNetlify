// Traducciones para la aplicación
export const translations = {
  es: {
    // Header
    'Quiénes somos': 'Quiénes somos',
    'Casos de uso': 'Casos de uso',
    'Equipo': 'Equipo',
    'Clientes': 'Clientes',
    'Contacto': 'Contacto',
    'Demo en vivo': 'Demo en vivo',
    
    // Hero Section
    'La nueva generación de IA para tu empresa': 'La nueva generación de IA para tu empresa',
    'Soluciones de inteligencia artificial para potenciar ventas, soporte y operaciones.': 'Soluciones de inteligencia artificial para potenciar ventas, soporte y operaciones.',
    'Automatizá la atención y hacé crecer tu negocio con OnService.': 'Automatizá la atención y hacé crecer tu negocio con OnService.',
    'Comenzar Demo': 'Comenzar Demo',
    'Ver Casos de Uso': 'Ver Casos de Uso',
    
    // About Section
    '¿Quiénes somos?': '¿Quiénes somos?',
    'Somos OnService, pioneros en la intersección de IA, aviación y atención al cliente. Nuestra misión: transformar la experiencia de pasajeros y empresas con tecnología de vanguardia.': 'Somos OnService, pioneros en la intersección de IA, aviación y atención al cliente. Nuestra misión: transformar la experiencia de pasajeros y empresas con tecnología de vanguardia.',
    'Misión': 'Misión',
    'Visión': 'Visión',
    'Valores': 'Valores',
    'Optimizar procesos críticos y potenciar la atención al cliente en la industria aérea global.': 'Optimizar procesos críticos y potenciar la atención al cliente en la industria aérea global.',
    'Hacer que la interacción entre aerolíneas y pasajeros sea más fluida, personalizada y eficaz que nunca.': 'Hacer que la interacción entre aerolíneas y pasajeros sea más fluida, personalizada y eficaz que nunca.',
    'Innovación, empatía, excelencia y compromiso con la transformación digital.': 'Innovación, empatía, excelencia y compromiso con la transformación digital.',
    
    // Tooltips
    'Cambiar a Inglés': 'Cambiar a Inglés',
    'Switch to English': 'Cambiar a Inglés'
  },
  en: {
    // Header
    'Quiénes somos': 'About Us',
    'Casos de uso': 'Use Cases',
    'Equipo': 'Team',
    'Clientes': 'Clients',
    'Contacto': 'Contact',
    'Demo en vivo': 'Live Demo',
    
    // Hero Section
    'La nueva generación de IA para tu empresa': 'The new generation of AI for your business',
    'Soluciones de inteligencia artificial para potenciar ventas, soporte y operaciones.': 'Artificial intelligence solutions to boost sales, support and operations.',
    'Automatizá la atención y hacé crecer tu negocio con OnService.': 'Automate customer service and grow your business with OnService.',
    'Comenzar Demo': 'Start Demo',
    'Ver Casos de Uso': 'View Use Cases',
    
    // About Section
    '¿Quiénes somos?': 'Who are we?',
    'Somos OnService, pioneros en la intersección de IA, aviación y atención al cliente. Nuestra misión: transformar la experiencia de pasajeros y empresas con tecnología de vanguardia.': 'We are OnService, pioneers at the intersection of AI, aviation and customer service. Our mission: transform the experience of passengers and companies with cutting-edge technology.',
    'Misión': 'Mission',
    'Visión': 'Vision',
    'Valores': 'Values',
    'Optimizar procesos críticos y potenciar la atención al cliente en la industria aérea global.': 'Optimize critical processes and enhance customer service in the global airline industry.',
    'Hacer que la interacción entre aerolíneas y pasajeros sea más fluida, personalizada y eficaz que nunca.': 'Make the interaction between airlines and passengers more fluid, personalized and effective than ever.',
    'Innovación, empatía, excelencia y compromiso con la transformación digital.': 'Innovation, empathy, excellence and commitment to digital transformation.',
    
    // Tooltips
    'Cambiar a Inglés': 'Switch to English',
    'Switch to English': 'Switch to English'
  }
}

// Función para obtener traducción
export function getTranslation(key, language = 'es') {
  return translations[language]?.[key] || key
}

// Función para cambiar idioma en toda la aplicación
export function changeLanguage(language) {
  // Cambiar el atributo lang del HTML
  document.documentElement.setAttribute('lang', language)
  
  // Guardar en localStorage
  localStorage.language = language
  
  // Emitir evento para que otros componentes sepan del cambio
  window.dispatchEvent(new CustomEvent('languageChanged', {
    detail: { language }
  }))
  
  // Traducir elementos con data-translate
  const elements = document.querySelectorAll('[data-translate]')
  elements.forEach(element => {
    const key = element.getAttribute('data-translate')
    const translation = getTranslation(key, language)
    if (translation !== key) {
      element.textContent = translation
    }
  })
} 