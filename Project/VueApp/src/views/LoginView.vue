
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
    

    <div class="text">
        
        <div class="nav__end">
        <p class="numbers" :class="locale">{{ $t("Login") }}</p>
        </div>

    </div>
</template>

<style>
</style>
