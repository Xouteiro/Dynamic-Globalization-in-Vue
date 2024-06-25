<script setup lang="ts">

import { useI18n } from "vue-i18n";
import i18n from '@/i18n.js';
import { ref, onMounted } from "vue";
import ArticleDisplay from '@/components/ArticleDisplay.vue'
import utils from '@/utils.ts';

let { locale } = useI18n()
let currentMessages = i18n.global.getLocaleMessage(locale.value);
let isLoading = ref(false);



function getNews(currentMessages: any) {
  let news = [];
  let newNews = {};
  for (let i = 0; i < Object.values(currentMessages).length; i++) {
    if (typeof Object.values(currentMessages)[i] === "object") {
      newNews = Object.assign({}, Object.values(currentMessages)[i]);
      news.push(newNews);
    }
  }
  return news;
}




onMounted(() => {
  utils.populateEditableElements(locale.value, currentMessages);
});




</script>

<template>

  <h1 class="Main_News" :class="locale">{{ $t("Main_News") }} </h1>


  <div v-if="isLoading">Loading...</div>
  <ArticleDisplay v-else v-for="(item, index) in getNews(currentMessages)" :key="index" :newsContent="item">
  </ArticleDisplay>

</template>

<style scoped>

h1 {
  display: block; 
  text-align: center;
  font-size: 50px;
  margin: 0 auto; 
  margin-bottom: 40px;
  width: 100%
}

</style>