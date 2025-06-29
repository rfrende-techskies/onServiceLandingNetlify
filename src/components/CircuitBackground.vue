<template>
  <div ref="container" class="circuit-container"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as THREE from 'three';

const props = defineProps({
  width: { type: Number, default: null },
  height: { type: Number, default: null },
  nodeCount: { type: Number, default: 32 },
  chipCount: { type: Number, default: 8 },
  rayCount: { type: Number, default: 4 },
  opacity: { type: Number, default: 0.18 },
  fps: { type: Number, default: 60 },
  blur: { type: Boolean, default: false },
  colorScheme: { type: Array, default: () => [0x7c3aed, 0x38bdf8, 0x06b6d4, 0xa78bfa] },
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

function createOrganicCircuit() {
  circuitLines = [];
  circuitNodes = [];
  chips = [];
  pulseObjs = [];
  for (let i = 0; i < props.nodeCount; i++) {
    circuitNodes.push({
      x: randomBetween(-currentWidth/2 + 60, currentWidth/2 - 60),
      y: randomBetween(-currentHeight/2 + 60, currentHeight/2 - 60),
      z: 0,
      pulse: Math.random() > 0.7
    });
  }
  for (let i = 0; i < props.chipCount; i++) {
    chips.push({
      x: randomBetween(-currentWidth/2 + 100, currentWidth/2 - 100),
      y: randomBetween(-currentHeight/2 + 100, currentHeight/2 - 100),
      w: randomBetween(24, 38),
      h: randomBetween(12, 20),
      pulse: Math.random() > 0.5
    });
  }
  for (let i = 0; i < circuitNodes.length; i++) {
    for (let j = i + 1; j < circuitNodes.length; j++) {
      const a = circuitNodes[i], b = circuitNodes[j];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 260 && Math.random() > 0.25) {
        let path = [{ x: a.x, y: a.y, z: 0 }];
        if (Math.random() > 0.5) {
          path.push({ x: b.x, y: a.y, z: 0 });
        } else {
          path.push({ x: a.x, y: b.y, z: 0 });
        }
        if (Math.random() > 0.7) {
          path.push({ x: randomBetween(-currentWidth/2 + 60, currentWidth/2 - 60), y: randomBetween(-currentHeight/2 + 60, currentHeight/2 - 60), z: 0 });
        }
        path.push({ x: b.x, y: b.y, z: 0 });
        circuitLines.push(path);
      }
    }
    for (let c = 0; c < chips.length; c++) {
      const chip = chips[c];
      const dist = Math.hypot(circuitNodes[i].x - chip.x, circuitNodes[i].y - chip.y);
      if (dist < 180 && Math.random() > 0.5) {
        let path = [
          { x: circuitNodes[i].x, y: circuitNodes[i].y, z: 0 },
          { x: chip.x, y: circuitNodes[i].y, z: 0 },
          { x: chip.x, y: chip.y, z: 0 }
        ];
        circuitLines.push(path);
      }
    }
  }
}

function addCircuitToScene() {
  for (let i = 0; i < circuitLines.length; i++) {
    const points = circuitLines[i].map(p => new THREE.Vector3(p.x, p.y, p.z));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: props.colorScheme[0],
      transparent: true,
      opacity: props.opacity,
      blending: THREE.AdditiveBlending
    });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
  }
  for (let i = 0; i < circuitNodes.length; i++) {
    const { x, y, z, pulse } = circuitNodes[i];
    const geometry = new THREE.CircleGeometry(5, 18);
    const material = new THREE.MeshBasicMaterial({
      color: props.colorScheme[0],
      transparent: true,
      opacity: 0.5
    });
    const circle = new THREE.Mesh(geometry, material);
    circle.position.set(x, y, z + 1);
    scene.add(circle);
    if (pulse) pulseObjs.push(circle);
  }
  for (let i = 0; i < chips.length; i++) {
    const { x, y, w, h, pulse } = chips[i];
    const geometry = new THREE.BoxGeometry(w, h, 4);
    const material = new THREE.MeshBasicMaterial({
      color: props.colorScheme[1],
      transparent: true,
      opacity: 0.32
    });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(x, y, 2);
    scene.add(box);
    if (pulse) pulseObjs.push(box);
  }
}

function addRays() {
  rays = [];
  for (let i = 0; i < props.rayCount; i++) {
    const path = circuitLines[Math.floor(Math.random() * circuitLines.length)];
    if (!path) continue;
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(path[0].x, path[0].y, 3),
      new THREE.Vector3(path[0].x, path[0].y, 3)
    ]);
    const color = props.colorScheme[i % props.colorScheme.length];
    const material = new THREE.LineBasicMaterial({
      color,
      linewidth: 7,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const ray = new THREE.Line(geometry, material);
    ray.userData.path = path;
    ray.userData.color = color;
    ray.userData.offset = Math.random() * 1000;
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
  for (let i = 0; i < pulseObjs.length; i++) {
    const obj = pulseObjs[i];
    obj.material.opacity = 0.5 + 0.35 * Math.abs(Math.sin(t + i));
    obj.material.needsUpdate = true;
  }
  for (let i = 0; i < rays.length; i++) {
    const ray = rays[i];
    const path = ray.userData.path;
    if (!path) continue;
    const segs = path.length - 1;
    const total = segs * 70;
    const frame = Math.floor(((Date.now() + ray.userData.offset * 1000) / 10) % total);
    const seg = Math.floor(frame / 70);
    const tSeg = (frame % 70) / 70;
    if (seg < segs) {
      const a = path[seg], b = path[seg + 1];
      const x = a.x + (b.x - a.x) * tSeg;
      const y = a.y + (b.y - a.y) * tSeg;
      ray.geometry.setFromPoints([
        new THREE.Vector3(a.x, a.y, 3),
        new THREE.Vector3(x, y, 3)
      ]);
      ray.visible = true;
    } else {
      const newPath = circuitLines[Math.floor(Math.random() * circuitLines.length)];
      ray.userData.path = newPath;
      ray.visible = false;
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
  }, 250);
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
  createOrganicCircuit();
  addCircuitToScene();
  addRays();
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
    scene.clear();
    createOrganicCircuit();
    addCircuitToScene();
    addRays();
  });
  resizeObs.observe(container.value);
  
  startAnimation();
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('scroll', onScroll, { passive: true });
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