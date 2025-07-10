<template>
  <div ref="container" class="circuit-container"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as THREE from 'three';

function getColorScheme() {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return isDark
    ? [0xa78bfa, 0x38bdf8, 0x7c3aed, 0xffffff] // colores claros para dark
    : [0x3b2170, 0x7c3aed, 0x23272e, 0x38bdf8]; // colores oscuros para light
}

function getColorSchemeAndOpacity() {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return isDark
    ? { scheme: [0x7c3aed, 0x38bdf8, 0x23272e, 0xffffff], opacity: 0.18 } // dark: violeta paleta
    : { scheme: [0xaeb4bb, 0x38bdf8, 0x23272e, 0x7c3aed], opacity: 1.0 }; // gris frío y puro para light
}

const colorScheme = ref(getColorSchemeAndOpacity().scheme);
const dynamicOpacity = ref(getColorSchemeAndOpacity().opacity);

const props = defineProps({
  width: { type: Number, default: null },
  height: { type: Number, default: null },
  nodeCount: { type: Number, default: 48 },
  chipCount: { type: Number, default: 12 },
  rayCount: { type: Number, default: 7 },
  // opacity eliminado, ahora es dinámico
  fps: { type: Number, default: 60 },
  blur: { type: Boolean, default: false },
  // colorScheme eliminado, ahora es dinámico
});

const container = ref(null);
let scene, renderer, camera;
let circuitLines = [];
let circuitNodes = [];
let chips = [];
let pulseObjs = [];
let rays = [];
let animationId;
let observer;
let resizeObs;
let isVisible = true;
let lastFrameTime = 0;
let targetFPS = props.fps;
let frameInterval = 1000 / targetFPS;
let currentWidth = props.width;
let currentHeight = props.height;
let scrollTimeout = null;

function updateSize() {
  if (!container.value) return;
  const rect = container.value.getBoundingClientRect();
  currentWidth = props.width || Math.round(rect.width);
  currentHeight = props.height || Math.round(rect.height);
  if (renderer && camera) {
    camera.left = -currentWidth / 2;
    camera.right = currentWidth / 2;
    camera.top = currentHeight / 2;
    camera.bottom = -currentHeight / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(currentWidth, currentHeight);
  }
}

watch(() => [props.width, props.height], updateSize);

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function isInExclusionZone(x, y) {
  // Zona izquierda (hero card)
  const left = -currentWidth / 2 + 40;
  const top = currentHeight / 2 - 220;
  const right = -currentWidth / 8 + 120;
  const bottom = -currentHeight / 2 + 120;
  if (x > left && x < right && y < top && y > bottom) return true;
  // Zona derecha (celular)
  const rightLeft = currentWidth / 6;
  const rightRight = currentWidth / 2 - 40;
  const rightTop = currentHeight / 2 - 120;
  const rightBottom = -currentHeight / 2 + 120;
  if (x > rightLeft && x < rightRight && y < rightTop && y > rightBottom) return true;
  return false;
}

function createPcbCircuit() {
  circuitLines = [];
  circuitNodes = [];
  chips = [];
  pulseObjs = [];

  // 1. Distribuir nodos de forma orgánica (no grilla), favoreciendo los márgenes
  const nodeCount = props.nodeCount || 48;
  const minDist = 60;
  const maxDist = 220;
  const marginFavor = 0.45; // 45% de los nodos en los márgenes
  const marginWidth = Math.max(120, currentWidth * 0.18);
  for (let i = 0; i < nodeCount; i++) {
    let tries = 0;
    let x, y, valid;
    do {
      // Favorecer márgenes
      if (i < nodeCount * marginFavor) {
        // Izquierda o derecha
        if (Math.random() < 0.5) {
          x = randomBetween(-currentWidth / 2 + 60, -currentWidth / 2 + marginWidth);
        } else {
          x = randomBetween(currentWidth / 2 - marginWidth, currentWidth / 2 - 60);
        }
      } else {
        x = randomBetween(-currentWidth / 2 + 60, currentWidth / 2 - 60);
      }
      y = randomBetween(-currentHeight / 2 + 60, currentHeight / 2 - 60);
      valid = true;
      for (const n of circuitNodes) {
        if (Math.hypot(n.x - x, n.y - y) < minDist) {
          valid = false;
          break;
        }
      }
      if (isInExclusionZone(x, y)) valid = false;
      tries++;
    } while (!valid && tries < 30);
    if (!isInExclusionZone(x, y)) {
      circuitNodes.push({
        x,
        y,
        z: 0,
        padType: Math.random() > 0.5 ? 'circle' : 'square',
        pulse: Math.random() > 0.92
      });
    }
  }

  // 2. Conexiones ortogonales, con cruces y ramificaciones
  const maxConnections = 3;
  const connectionMap = new Map();
  for (let i = 0; i < circuitNodes.length; i++) {
    let connections = 0;
    // Buscar nodos cercanos
    let candidates = circuitNodes
      .map((n, j) => ({ n, j, dist: Math.hypot(n.x - circuitNodes[i].x, n.y - circuitNodes[i].y) }))
      .filter(e => e.j !== i && e.dist > minDist && e.dist < maxDist)
      .sort((a, b) => a.dist - b.dist);
    for (const { n, j } of candidates) {
      if (connections >= maxConnections) break;
      const key = `${Math.min(i, j)}-${Math.max(i, j)}`;
      if (connectionMap.has(key)) continue;
      connectionMap.set(key, true);
      connections++;
      // Trayectoria ortogonal (L o Z)
      const midX = Math.random() > 0.5 ? n.x : circuitNodes[i].x;
      const midY = Math.random() > 0.5 ? n.y : circuitNodes[i].y;
      let path = [
        { x: circuitNodes[i].x, y: circuitNodes[i].y, z: 0 },
        { x: midX, y: midY, z: 0 },
        { x: n.x, y: n.y, z: 0 }
      ];
      // 20% de las conexiones tienen un quiebre extra (Z)
      if (Math.random() > 0.8) {
        const mid2X = randomBetween(Math.min(circuitNodes[i].x, n.x), Math.max(circuitNodes[i].x, n.x));
        const mid2Y = randomBetween(Math.min(circuitNodes[i].y, n.y), Math.max(circuitNodes[i].y, n.y));
        path = [
          { x: circuitNodes[i].x, y: circuitNodes[i].y, z: 0 },
          { x: mid2X, y: circuitNodes[i].y, z: 0 },
          { x: mid2X, y: n.y, z: 0 },
          { x: n.x, y: n.y, z: 0 }
        ];
      }
      circuitLines.push(path);
    }
  }

  // 3. Chips: algunos pads cuadrados más grandes
  for (let i = 0; i < Math.min(props.chipCount || 8, circuitNodes.length); i++) {
    if (circuitNodes[i].padType === 'square') {
      chips.push({
        x: circuitNodes[i].x,
        y: circuitNodes[i].y,
        w: randomBetween(18, 28),
        h: randomBetween(10, 18),
        pulse: Math.random() > 0.7
      });
    }
  }
}

function addCircuitToScene() {
  scene.children = scene.children.filter(child => child.type === 'Camera');
  
  // Agregar líneas de circuito
  for (let i = 0; i < circuitLines.length; i++) {
    const points = circuitLines[i].map(p => {
      // Profundidad: alejar más los puntos de los bordes
      const depth = Math.abs(p.x) / (currentWidth / 2);
      const px = p.x + parallax.x * depth;
      const py = p.y + parallax.y * depth;
      return new THREE.Vector3(px, py, p.z);
    });
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    // Blur y opacidad variable según profundidad
    const depth = Math.abs(points[0].x) / (currentWidth / 2);
    const lineOpacity = dynamicOpacity.value * (0.7 + 0.3 * (1 - depth));
    const randomWidth = Math.random() < 0.7 ? 0.7 : (Math.random() < 0.5 ? 1.2 : 2);
    // Glow gris claro en light mode
    if (dynamicOpacity.value > 0.3) {
      // Glow gris frío, ultra sutil
      const glowMaterial = new THREE.LineBasicMaterial({
        color: 0xe5e7eb, // gris frío claro
        transparent: true,
        opacity: 0.04 + 0.01 * (1 - depth), // ultra sutil
        linewidth: 4,
        blending: THREE.AdditiveBlending
      });
      const glowLine = new THREE.Line(geometry, glowMaterial);
      scene.add(glowLine);
    }
    const material = new THREE.LineBasicMaterial({
      color: colorScheme.value[0],
      transparent: true,
      opacity: Math.max(lineOpacity, 0.18), // ultra sutil
      linewidth: Math.max(randomWidth, 1.1),
      blending: THREE.AdditiveBlending
    });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
  }
  
  // Agregar nodos
  for (let i = 0; i < circuitNodes.length; i++) {
    const { x, y, z, pulse, padType } = circuitNodes[i];
    // Si hay un chip en la misma posición, no dibujar el nodo
    const isChip = chips.some(chip => chip.x === x && chip.y === y);
    if (isChip) continue;
    const depth = Math.abs(x) / (currentWidth / 2);
    const px = x + parallax.x * depth;
    const py = y + parallax.y * depth;
    const geometry = new THREE.CircleGeometry(4, 16);
    const material = new THREE.MeshBasicMaterial({
      color: colorScheme.value[0],
      transparent: true,
      opacity: 0.5 + 0.3 * (1 - depth)
    });
    const circle = new THREE.Mesh(geometry, material);
    circle.position.set(px, py, z + 1);
    scene.add(circle);
    if (pulse) pulseObjs.push(circle);
  }
  
  // Agregar chips
  for (let i = 0; i < chips.length; i++) {
    const { x, y, w, h, pulse } = chips[i];
    const depth = Math.abs(x) / (currentWidth / 2);
    const px = x + parallax.x * depth;
    const py = y + parallax.y * depth;
    const geometry = new THREE.BoxGeometry(w, h, 3);
    const material = new THREE.MeshBasicMaterial({
      color: colorScheme.value[1],
      transparent: true,
      opacity: 0.3 + 0.2 * (1 - depth)
    });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(px, py, 2);
    scene.add(box);
    if (pulse) pulseObjs.push(box);
  }
}

function addRays() {
  rays = [];
  // Solo crear rayos si hay suficientes líneas de circuito
  const availablePaths = circuitLines.filter(path => path.length >= 2);
  
  for (let i = 0; i < props.rayCount; i++) {
    if (availablePaths.length === 0) break;
    
    const path = availablePaths[Math.floor(Math.random() * availablePaths.length)];
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(path[0].x, path[0].y, 3),
      new THREE.Vector3(path[0].x, path[0].y, 3)
    ]);
    const color = colorScheme.value[i % colorScheme.value.length];
    const material = new THREE.LineBasicMaterial({
      color,
      linewidth: 5,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const ray = new THREE.Line(geometry, material);
    ray.userData.path = path;
    ray.userData.color = color;
    ray.userData.offset = Math.random() * 1000;
    ray.userData.speed = 0.8 + Math.random() * 0.4; // Velocidad variable
    scene.add(ray);
    rays.push(ray);
  }
}

function animate() {
  if (!isVisible) return;
  
  const currentTime = performance.now();
  if (currentTime - lastFrameTime < frameInterval) {
    animationId = requestAnimationFrame(animate);
    return;
  }
  lastFrameTime = currentTime;
  
  const t = Date.now() * 0.002;
  
  // Solo actualizar pulsos si hay objetos pulsantes
  if (pulseObjs.length > 0) {
    for (let i = 0; i < pulseObjs.length; i++) {
      const obj = pulseObjs[i];
      obj.material.opacity = 0.5 + 0.35 * Math.abs(Math.sin(t + i));
      obj.material.needsUpdate = true;
    }
  }
  
  // Solo actualizar rayos si hay rayos
  if (rays.length > 0) {
    for (let i = 0; i < rays.length; i++) {
      const ray = rays[i];
      const path = ray.userData.path;
      if (!path || path.length < 2) continue;
      
      const segs = path.length - 1;
      const speed = ray.userData.speed || 1;
      const total = segs * 100 / speed;
      const frame = Math.floor(((Date.now() + ray.userData.offset * 1000) / 15) % total);
      const seg = Math.floor(frame / (100 / speed));
      const tSeg = (frame % (100 / speed)) / (100 / speed);
      
      if (seg < segs) {
        const a = path[seg], b = path[seg + 1];
        const x = a.x + (b.x - a.x) * tSeg;
        const y = a.y + (b.y - a.y) * tSeg;
        
        // Crear un efecto de "cola" para el rayo
        const tailLength = 0.3;
        const tailStart = Math.max(0, tSeg - tailLength);
        const tailX = a.x + (b.x - a.x) * tailStart;
        const tailY = a.y + (b.y - a.y) * tailStart;
        
        ray.geometry.setFromPoints([
          new THREE.Vector3(tailX, tailY, 3),
          new THREE.Vector3(x, y, 3)
        ]);
        ray.visible = true;
        
        // Variar la opacidad para efecto de pulso
        ray.material.opacity = 0.6 + 0.2 * Math.sin(t * 3 + i);
      } else {
        // Buscar una nueva ruta cuando termine
        const availablePaths = circuitLines.filter(p => p.length >= 2);
        if (availablePaths.length > 0) {
          const newPath = availablePaths[Math.floor(Math.random() * availablePaths.length)];
          ray.userData.path = newPath;
          ray.userData.offset = Math.random() * 1000;
        }
        ray.visible = false;
      }
    }
  }
  
  renderer.render(scene, camera);
  animationId = requestAnimationFrame(animate);
}

function startAnimation() {
  if (!animationId) animate();
}
function stopAnimation() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

function onVisibilityChange() {
  if (document.hidden) {
    isVisible = false;
    stopAnimation();
  } else {
    isVisible = true;
    startAnimation();
  }
}

function onWindowResize() {
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  
  const isMobile = w < 768;
  targetFPS = isMobile ? 30 : 60;
  frameInterval = 1000 / targetFPS;
}

function onScroll() {
  isVisible = false;
  stopAnimation();
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    isVisible = true;
    startAnimation();
  }, 100);
}

function regenerateCircuit() {
  // Limpiar arrays existentes
  circuitLines = [];
  circuitNodes = [];
  chips = [];
  pulseObjs = [];
  
  // Regenerar circuito
  createPcbCircuit();
  addCircuitToScene();
  addRays();
}

function handleColorSchemeChange() {
  const { scheme, opacity } = getColorSchemeAndOpacity();
  colorScheme.value = scheme;
  dynamicOpacity.value = opacity;
  regenerateCircuit();
}

// Parallax global
let parallax = { x: 0, y: 0 };
function handleParallax(e) {
  const w = window.innerWidth, h = window.innerHeight;
  parallax.x = ((e.clientX / w) - 0.5) * 40; // rango -20 a 20px
  parallax.y = ((e.clientY / h) - 0.5) * 40;
}

onMounted(() => {
  const isMobile = window.innerWidth < 768;
  targetFPS = isMobile ? 30 : 60;
  frameInterval = 1000 / targetFPS;
  
  scene = new THREE.Scene();
  updateSize();
  camera = new THREE.OrthographicCamera(-currentWidth/2, currentWidth/2, currentHeight/2, -currentHeight/2, 1, 1000);
  camera.position.z = 100;
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(currentWidth, currentHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.value.appendChild(renderer.domElement);
  
  // Generar circuito inicial
  regenerateCircuit();
  
  observer = new window.IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      isVisible = true;
      startAnimation();
    } else {
      isVisible = false;
      stopAnimation();
    }
  }, { threshold: 0.01 });
  observer.observe(container.value);
  
  document.addEventListener('visibilitychange', onVisibilityChange);
  
  resizeObs = new window.ResizeObserver(() => {
    updateSize();
    // Regenerar circuito cuando cambie el tamaño para adaptarse
    if (isVisible) {
      regenerateCircuit();
    }
  });
  resizeObs.observe(container.value);
  
  startAnimation();
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('mousemove', handleParallax);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleColorSchemeChange);
});

onBeforeUnmount(() => {
  stopAnimation();
  if (observer && container.value) observer.unobserve(container.value);
  document.removeEventListener('visibilitychange', onVisibilityChange);
  window.removeEventListener('resize', onWindowResize);
  if (resizeObs && container.value) resizeObs.unobserve(container.value);
  if (renderer) {
    renderer.dispose();
  }
  window.removeEventListener('scroll', onScroll);
  clearTimeout(scrollTimeout);
  window.removeEventListener('mousemove', handleParallax);
  window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handleColorSchemeChange);
});
</script>

<style scoped>
.circuit-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}
.circuit-container canvas {
  display: block;
}
</style> 