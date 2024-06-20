<script setup>
import { RouterView } from 'vue-router'
import { i18nFunctions } from '../i18n.js';
import { ref, onMounted, onUnmounted } from 'vue';

const waiting = ref(i18nFunctions.waiting);
let intervalId;

onMounted(() => {
    intervalId = setInterval(() => {
        waiting.value = i18nFunctions.waiting;
    }, 100);
    
    document.getElementById('loading').remove();
});

onUnmounted(() => {
    clearInterval(intervalId);
});

</script>

<template>
    <div class="loader-container" v-if="waiting">
        <div class="loader"></div>
    </div>
    <RouterView/>
</template>

<style scoped>
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.loader {
  width: 50px;
  aspect-ratio: 1;
  display: grid;
  border: 4px solid #0000;
  border-radius: 50%;
  border-right-color: #25b09b;
  animation: l15 1s infinite linear;
}
.loader::before,
.loader::after {    
  content: "";
  grid-area: 1/1;
  margin: 2px;
  border: inherit;
  border-radius: 50%;
  animation: l15 2s infinite;
}
.loader::after {
  margin: 8px;
  animation-duration: 3s;
}
@keyframes l15{ 
  100%{transform: rotate(1turn)}
}

</style>