<template>
  <div
  class="relative drop-shadow-xl w-96 h-48 overflow-hidden rounded-xl bg-[#020817]"
>
  <div
    class="absolute flex items-center justify-center z-[1] opacity-90 rounded-xl inset-0.5 bg-[#020817] p-2"
  >
    <slot></slot>
  </div>
  <div class="absolute w-56 h-48 bg-[#020817] blur-[50px] -left-1/2 -top-1/2"></div>
</div>
</template>