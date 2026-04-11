<template>
  <div class="bg-wrap" aria-hidden="true">
    <div class="bg-solid bg-solid-dark"></div>
    <div class="bg-solid bg-solid-light"></div>
    <div class="bg-img bg-dark"></div>
    <div class="bg-img bg-light"></div>
  </div>
</template>

<style scoped>
.bg-wrap {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

/* Matte Hintergrundfarben */
.bg-solid {
  position: absolute;
  inset: 0;
  transition: opacity 0.7s ease;
}
.bg-solid-dark {
  background: #292828;
  opacity: 1;
}
.bg-solid-light {
  background: #d6c9c9;
  opacity: 0;
}

.bg-img {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: opacity 0.7s ease;
}

/* Dark-Mode: nahezu transparent */
.bg-dark {
  background-image: url("/background-dark.webp");
  opacity: 0.09;
}
</style>
