<script setup lang="ts">

import { useI18n } from "vue-i18n";
import i18n from '@/i18n.js';
import { ref, onMounted, onUpdated } from "vue";
import ArticleDisplay from '@/components/ArticleDisplay.vue'
import utils from '@/utils.js';

let { locale } = useI18n()
let currentMessages = i18n.global.getLocaleMessage(locale.value); 
let isLoading = ref(false);
let errorOnFetch = Object.keys(currentMessages).length === 0;




onMounted(() => {
  utils.populateEditableElements(locale.value, currentMessages);
});




</script>

<template>
  <div v-if="errorOnFetch" class="Fetch Error">Error fetching data</div>
  
  <div v-if="isLoading ">Loading...</div>
    <ArticleDisplay 
      v-else
      v-for="(item, index) in currentMessages.News"
      :key="index"
      :newsContent="item">
    </ArticleDisplay>

</template>
