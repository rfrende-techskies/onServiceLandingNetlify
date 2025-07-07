<template>
  <div class="particle-background absolute inset-0 overflow-hidden pointer-events-none">
    <canvas ref="canvas" class="w-full h-full"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const canvas = ref(null);
let ctx = null;
let animationId = null;
let particles = [];

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 3 + 1;
    this.opacity = Math.random() * 0.5 + 0.2;
    this.color = Math.random() < 0.5 ? '#7C3AED' : '#38BDF8';
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    
    if (this.x < 0 || this.x > canvas.value.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.value.height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
  }
}

function initParticles() {
  const particleCount = 50;
  particles = [];
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(
      Math.random() * canvas.value.width,
      Math.random() * canvas.value.height
    ));
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
  
  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });
  
  // Conectar partículas cercanas
  particles.forEach((particle, i) => {
    particles.slice(i + 1).forEach(otherParticle => {
      const dx = particle.x - otherParticle.x;
      const dy = particle.y - otherParticle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(otherParticle.x, otherParticle.y);
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - distance / 100)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
  });
  
  animationId = requestAnimationFrame(animate);
}

function resizeCanvas() {
  if (canvas.value) {
    canvas.value.width = canvas.value.offsetWidth;
    canvas.value.height = canvas.value.offsetHeight;
  }
}

onMounted(() => {
  if (canvas.value) {
    ctx = canvas.value.getContext('2d');
    resizeCanvas();
    initParticles();
    animate();
    
    window.addEventListener('resize', resizeCanvas);
  }
});

onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  window.removeEventListener('resize', resizeCanvas);
});
</script>

<style scoped>
.particle-background {
  z-index: 0;
}
</style> 