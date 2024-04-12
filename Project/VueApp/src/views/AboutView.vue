

<script setup>
import { onMounted,onUpdated } from 'vue';
import  utils  from '@/utils.ts';
import i18n from '@/i18n.js';
import { useI18n } from "vue-i18n";




let { locale } = useI18n();
let currentMessages = i18n.global.getLocaleMessage(locale.value);



onMounted(() => {
  if(window.location.pathname === '/table') {
    return;
  }
  utils.populateEditableElements(locale.value, currentMessages);
});

onUpdated(() => {
  if(window.location.pathname === '/table') {
    return;
  }
  currentMessages = i18n.global.getLocaleMessage(locale.value);
  utils.populateEditableElements(locale.value, currentMessages);
});

</script>
<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
