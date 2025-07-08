<template>
  <section id="demo" class="relative w-full min-h-[70vh] flex items-center justify-center px-1 md:px-0 bg-transparent overflow-hidden">
    <!-- Circuit background decorativo -->
    <div class="absolute inset-0 w-full h-full z-0 pointer-events-none select-none">
      <CircuitBackground />
    </div>
    <div class="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 min-h-[40vh] py-2 md:py-6 animate-fade-in-up">
      <!-- Bloque Prompt (66%) -->
      <div class="flex-[2_2_0%] w-full max-w-3xl bg-white/80 dark:bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/10 border border-white/30 dark:border-white/10 px-3 md:px-6 py-5 md:py-8 flex flex-col items-center animate-fade-in-up min-h-[220px] md:min-h-[320px] h-full">
        <CodePromptBlock 
          :prompts="prompts" 
          :tab="currentTab" 
          :exampleIdx="currentExampleIdx"
          @tab-change="handleTabChange"
          @typing="handleTyping"
        />
      </div>
      <!-- Bloque Agent Response (33%) -->
      <div class="flex-[1_1_0%] w-full max-w-xl bg-white/80 dark:bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/10 border border-white/30 dark:border-white/10 px-3 md:px-6 py-5 md:py-8 flex flex-col items-center animate-fade-in-up delay-150 min-h-[220px] md:min-h-[320px] h-full">
        <AgentResponseBlock 
          :responses="agentResponses" 
          :tab="currentTab" 
          :exampleIdx="currentExampleIdx"
          :typing="isTyping"
          :loading="isLoading"
          :promptTyping="isTyping"
          @example-change="handleExampleChange"
          @conversation-finished="handleConversationFinished"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import CircuitBackground from './CircuitBackground.vue'
import CodePromptBlock from './CodePromptBlock.vue'
import AgentResponseBlock from './AgentResponseBlock.vue'

// Estado del demo
const currentTab = ref('airline')
const currentExampleIdx = ref(0)
const isTyping = ref(false)
const isLoading = ref(false)
const dotIdx = ref(1)
let autoNextTimeout = null
let dotInterval = null

// Datos de ejemplo para los prompts - conversaciones más largas y realistas
const prompts = {
  airline: {
    label: 'Aerolínea',
    examples: [
      [
        '✈️ # System Prompt',
        'Eres KAI, tu asistente virtual de aerolíneas.',
        'Tono cordial y profesional.',
        'Responde en español claro.',
        'Ayuda con reservas, check-in y vuelos.',
        '# Ejemplo',
        '$ User: "¿Puedo cambiar mi vuelo?"'
      ],
      [
        '🛫 # System Prompt',
        'Hola, soy KAI, asistente digital de la aerolínea.',
        'Responde con amabilidad y precisión.',
        'Brinda información sobre equipaje y reservas.',
        '# Ejemplo',
        '$ User: "¿Cuánto equipaje puedo llevar en cabina?"'
      ],
      [
        '✈️ # System Prompt',
        'KAI, asistente de vuelos.',
        'Tono profesional y empático.',
        'Responde dudas sobre horarios y servicios.',
        '# Ejemplo',
        '$ User: "¿El vuelo AM123 está demorado?"'
      ],
      [
        '🛬 # System Prompt',
        'Eres KAI, experto en atención al pasajero.',
        'Responde en español neutro.',
        'Ayuda con selección de asientos y embarque.',
        '# Ejemplo',
        '$ User: "¿Puedo seleccionar mi asiento online?"'
      ],
      [
        '✈️ # System Prompt',
        'KAI, asistente de aerolínea.',
        'Tono cercano y resolutivo.',
        'Brinda soporte para servicios especiales.',
        '# Ejemplo',
        '$ User: "¿Cómo solicito asistencia especial para mi vuelo?"'
      ]
    ]
  },
  travel: {
    label: 'Viajes',
    examples: [
      [
        '🌍 # System Prompt',
        'Eres KAI, experto en viajes internacionales.',
        'Tono amigable y claro.',
        'Recomienda destinos y tips de viaje.',
        '# Ejemplo',
        '$ User: "¿Necesito visa para viajar a Brasil?"'
      ],
      [
        '🧳 # System Prompt',
        'KAI, tu asesor de vacaciones.',
        'Tono cercano y entusiasta.',
        'Sugiere destinos y actividades.',
        '# Ejemplo',
        '$ User: "¿Qué destino recomendás para vacaciones en invierno?"'
      ],
      [
        '🌏 # System Prompt',
        'Eres KAI, guía de viajes.',
        'Tono informativo y cordial.',
        'Ayuda a reservar tours y excursiones.',
        '# Ejemplo',
        '$ User: "¿Cómo reservo un tour en París?"'
      ],
      [
        '🗾 # System Prompt',
        'KAI, experto en cultura y turismo.',
        'Tono claro y detallista.',
        'Responde sobre mejores épocas para viajar.',
        '# Ejemplo',
        '$ User: "¿Cuál es la mejor época para visitar Japón?"'
      ],
      [
        '🚗 # System Prompt',
        'Eres KAI, asistente de viajes.',
        'Tono práctico y directo.',
        'Brinda información sobre alquiler de autos.',
        '# Ejemplo',
        '$ User: "¿Qué documentos necesito para alquilar un auto en Europa?"'
      ]
    ]
  },
  it: {
    label: 'Soporte IT',
    examples: [
      [
        '💻 # System Prompt',
        'Eres KAI, soporte técnico de la empresa.',
        'Tono técnico y resolutivo.',
        'Ayuda con acceso a sistemas y correo.',
        '# Ejemplo',
        '$ User: "No puedo acceder a mi correo corporativo."'
      ],
      [
        '🔒 # System Prompt',
        'KAI, tu asistente de tecnología.',
        'Tono profesional y paciente.',
        'Guía para configurar VPN y acceso remoto.',
        '# Ejemplo',
        '$ User: "¿Cómo configuro la VPN en mi laptop?"'
      ],
      [
        '🖥️ # System Prompt',
        'Eres KAI, experto en soporte digital.',
        'Tono claro y directo.',
        'Responde sobre sistemas y tickets.',
        '# Ejemplo',
        '$ User: "¿El sistema de tickets está caído?"'
      ],
      [
        '🔑 # System Prompt',
        'KAI, asistente de soporte.',
        'Tono resolutivo y cordial.',
        'Ayuda a restablecer contraseñas.',
        '# Ejemplo',
        '$ User: "¿Cómo restablezco mi contraseña?"'
      ],
      [
        '💾 # System Prompt',
        'Eres KAI, soporte informático.',
        'Tono técnico y claro.',
        'Brinda ayuda sobre instalaciones de software.',
        '# Ejemplo',
        '$ User: "¿Puedo instalar software en mi equipo?"'
      ]
    ]
  }
};

// Datos de ejemplo para las respuestas - conversaciones más largas y realistas
const agentResponses = {
  airline: [
    [
      'User: "¿Puedo cambiar mi vuelo?"',
      'Agent: "¡Por supuesto! ¿Podrías indicarme tu número de reserva?"',
      'User: "Es 123456."',
      'Agent: "Gracias. Verificando... Tu tarifa permite un cambio con costo adicional. ¿Deseas continuar?"'
    ],
    [
      'User: "¿Cuánto equipaje puedo llevar en cabina?"',
      'Agent: "Puedes llevar una pieza de hasta 10kg en cabina. ¿Te gustaría saber sobre equipaje en bodega?"',
      'User: "¿Y en bodega?"',
      'Agent: "En bodega puedes llevar hasta 23kg por pieza, según tu tarifa. ¿Necesitás ayuda con algo más?"'
    ],
    [
      'User: "¿El vuelo AM123 está demorado?"',
      'Agent: "Déjame verificar... El vuelo AM123 está programado para salir a horario. ¿Te gustaría recibir notificaciones de cambios?"',
      'User: "Sí, por favor."',
      'Agent: "Listo, te avisaré ante cualquier novedad. ¿Algo más en lo que pueda ayudarte?"'
    ],
    [
      'User: "¿Puedo seleccionar mi asiento online?"',
      'Agent: "Sí, puedes seleccionar tu asiento desde la web o la app. ¿Te gustaría que te envíe el enlace?"',
      'User: "Sí, envíamelo."',
      'Agent: "Aquí tienes: www.aerolinea.com/seleccionar-asiento. ¿Algo más?"'
    ],
    [
      'User: "¿Cómo solicito asistencia especial para mi vuelo?"',
      'Agent: "Puedes solicitar asistencia especial durante la reserva o llamando a nuestro call center. ¿Te gustaría que te ayude a gestionarlo?"',
      'User: "Sí, por favor."',
      'Agent: "Perfecto, ¿me indicas tu número de reserva?"'
    ]
  ],
  travel: [
    [
      'User: "¿Necesito visa para viajar a Brasil?"',
      'Agent: "Si eres ciudadano argentino, no necesitas visa para turismo en Brasil. ¿Te gustaría saber sobre otros países?"',
      'User: "¿Y para Estados Unidos?"',
      'Agent: "Para Estados Unidos sí necesitas visa. ¿Te ayudo con el proceso?"'
    ],
    [
      'User: "¿Qué destino recomendás para vacaciones en invierno?"',
      'Agent: "Bariloche y Ushuaia son excelentes opciones en Argentina. ¿Prefieres playa o nieve?"',
      'User: "Nieve."',
      'Agent: "Entonces Ushuaia es ideal. ¿Te gustaría ver paquetes?"'
    ],
    [
      'User: "¿Cómo reservo un tour en París?"',
      'Agent: "Puedes reservar tours en París desde nuestra web o app. ¿Te envío el enlace?"',
      'User: "Sí, por favor."',
      'Agent: "Aquí tienes: www.tours.com/paris. ¿Algo más?"'
    ],
    [
      'User: "¿Cuál es la mejor época para visitar Japón?"',
      'Agent: "La primavera (marzo-abril) es ideal por los cerezos en flor. ¿Te gustaría recomendaciones de itinerario?"',
      'User: "Sí, por favor."',
      'Agent: "Te armo un itinerario personalizado. ¿Cuántos días planeas viajar?"'
    ],
    [
      'User: "¿Qué documentos necesito para alquilar un auto en Europa?"',
      'Agent: "Necesitás licencia internacional y pasaporte vigente. ¿Te ayudo a gestionar la licencia?"',
      'User: "Sí, por favor."',
      'Agent: "Perfecto, te envío los requisitos por email. ¿Algo más?"'
    ]
  ],
  it: [
    [
      'User: "No puedo acceder a mi correo corporativo."',
      'Agent: "¿Recibiste algún mensaje de error?"',
      'User: "Sí, dice contraseña incorrecta."',
      'Agent: "Te ayudo a restablecerla. ¿Quieres hacerlo ahora?"'
    ],
    [
      'User: "¿Cómo configuro la VPN en mi laptop?"',
      'Agent: "Debes descargar el software desde la intranet. ¿Te envío el enlace?"',
      'User: "Sí, por favor."',
      'Agent: "Aquí tienes: www.empresa.com/vpn. ¿Algo más?"'
    ],
    [
      'User: "¿El sistema de tickets está caído?"',
      'Agent: "Actualmente el sistema funciona con normalidad. ¿Quieres abrir un ticket nuevo?"',
      'User: "Sí, necesito soporte."',
      'Agent: "Por favor, describe el problema y lo derivaré al área correspondiente."'
    ],
    [
      'User: "¿Cómo restablezco mi contraseña?"',
      'Agent: "Puedes restablecerla desde la web o la app. ¿Te envío el enlace?"',
      'User: "Sí, envíamelo."',
      'Agent: "Aquí tienes: www.empresa.com/restablecer. ¿Algo más?"'
    ],
    [
      'User: "¿Puedo instalar software en mi equipo?"',
      'Agent: "Depende del tipo de software. ¿Cuál necesitas instalar?"',
      'User: "Adobe Reader."',
      'Agent: "Puedes instalarlo desde la intranet. ¿Te envío el enlace?"'
    ]
  ]
};

// Handlers para la comunicación entre componentes
function handleTabChange(tab) {
  currentTab.value = tab
  currentExampleIdx.value = 0
  clearTimeout(autoNextTimeout)
  startNewConversation()
}

function handleTyping(typing) {
  isTyping.value = typing
}

function handleExampleChange(exampleIdx) {
  currentExampleIdx.value = exampleIdx
  clearTimeout(autoNextTimeout)
}

function handleConversationFinished() {
  clearTimeout(autoNextTimeout)
  autoNextTimeout = setTimeout(() => {
    const examples = prompts[currentTab.value].examples
    const nextIdx = (currentExampleIdx.value + 1) % examples.length
    currentExampleIdx.value = nextIdx
    startNewConversation()
  }, 7000)
}

function startNewConversation() {
  isLoading.value = true
  clearTimeout(autoNextTimeout)
  setTimeout(() => {
    isLoading.value = false
  }, 1200)
}

function startDotAnimation() {
  clearInterval(dotInterval)
  dotInterval = setInterval(() => {
    dotIdx.value = dotIdx.value === 3 ? 1 : dotIdx.value + 1
  }, 400)
}

watch(isTyping, (val) => {
  if (val) startDotAnimation()
  else clearInterval(dotInterval)
})

onMounted(() => {
  startNewConversation()
})

onBeforeUnmount(() => {
  clearTimeout(autoNextTimeout)
})
</script>

<style scoped>
@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.9s cubic-bezier(.4,0,.2,1) both;
}
.animate-fade-in-up.delay-150 {
  animation-delay: 0.15s;
}
.prompt-thinking-block {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 1.2rem;
}
.prompt-thinking-bubble {
  background: linear-gradient(90deg, #23272e 0%, #444950 100%);
  color: #e5e7eb;
  border-radius: 1.1rem;
  padding: 0.6rem 1.5rem;
  font-size: 1.1rem;
  font-family: 'Fira Mono', 'Menlo', 'Consolas', monospace;
  box-shadow: 0 0 16px 2px #a78bfa44, 0 2px 16px 0 #7c3aed33;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  animation: promptGlow 2.2s infinite alternate;
}
@keyframes promptGlow {
  0% { box-shadow: 0 0 16px 2px #a78bfa44, 0 2px 16px 0 #7c3aed33; }
  100% { box-shadow: 0 0 32px 6px #7c3aed66, 0 2px 24px 0 #38bdf866; }
}
.thinking-dots {
  display: inline-block;
  margin-left: 0.2em;
}
.dot {
  opacity: 0.2;
  font-size: 1.2em;
  transition: opacity 0.18s, color 0.18s;
  color: #a78bfa;
}
.dot.active {
  opacity: 1;
  color: #7c3aed;
}
.fadeInMsgSeq-enter-active {
  transition: opacity 0.45s cubic-bezier(.4,1.6,.6,1), transform 0.45s cubic-bezier(.4,1.6,.6,1);
}
.fadeInMsgSeq-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.fadeInMsgSeq-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style> 