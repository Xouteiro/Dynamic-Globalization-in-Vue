<script setup>

import { i18nFunctions } from '@/i18n.js';
import { onMounted } from 'vue';
import utils from '@/utils.ts';
import i18n from '@/i18n.js';
import { useI18n } from "vue-i18n";
import { watch } from 'vue';
import { onUpdated } from 'vue';




let { locale } = useI18n();
let currentMessages = i18n.global.getLocaleMessage(locale.value);
let idioms = i18nFunctions.idioms


watch(locale, (newLocale) => {
  currentMessages = i18n.global.getLocaleMessage(newLocale);
});


onMounted(() => {
  utils.populateEditableElements(locale.value, currentMessages);
});



</script>
<template>
  <div class="about">
    <h1 class="about-h1" :class="locale">{{ $t("about-h1") }}</h1>
    <button class="about-button" :class="locale" @click="debug">{{ $t("about-button") }}</button>
    <input class="test-placeholder" :placeholder="$t('test-placeholder')" :class="locale" />
    <input class="test-placeholder2" :placeholder="$t('test-placeholder2')" :class="locale" />

    <button @click="console.log(i18nFunctions.main_language)">debug</button>



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
