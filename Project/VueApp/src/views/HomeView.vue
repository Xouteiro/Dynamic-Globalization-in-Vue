<script setup lang="ts">

import { useI18n } from "vue-i18n";
import i18n from '@/i18n.js';
import { ref, onMounted, onUpdated } from "vue";
import ArticleDisplay from '@/components/ArticleDisplay.vue'
import utils from '@/utils.ts';

let { locale } = useI18n()
let currentMessages = i18n.global.getLocaleMessage(locale.value);
let isLoading = ref(false);
let errorOnFetch = Object.keys(currentMessages).length === 0;



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
  <div v-if="errorOnFetch" class="Fetch Error">Error fetching data</div>

  <div v-if="isLoading">Loading...</div>
  <ArticleDisplay v-else v-for="(item, index) in getNews(currentMessages)" :key="index" :newsContent="item">
  </ArticleDisplay>

</template>
