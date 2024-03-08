<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useI18n } from "vue-i18n";
import {  ref } from "vue";
import { toRaw } from 'vue';
import LocaleSwitcher from '@/components/LocaleSwitcher.vue'
import i18n from './i18n.js';
import ArticleDisplay from '@/components/ArticleDisplay.vue'





let { locale } = useI18n()
let currentMessages = i18n.global.getLocaleMessage(locale.value); 
let errorOnFetch = Object.keys(currentMessages).length === 0;
let word = ref<string>('');
let key = ref<string>('');

let isLoading = ref(false);

// function debug() {
//   console.log(currentMessages);
//   console.log(errorOnFetch);
// }




function updateCurrentMessages(key: string, word: string) {
  currentMessages[key] = word;
}


function changeWord(key: string, word: string) {
  const url = 'http://localhost:5037/Idioms/' + locale.value + '/vocabulary'; //change to + locale.value when api is ready

  updateCurrentMessages(key, word);

  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      key: key,
      value: word

    }),
  })
    .then(response => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });

}




function updateElement(key_to_change: string, word_to_change: string) {
  changeWord(key_to_change, word_to_change);
  word.value = '';
  key.value = '';
}

async function updateLocale(newLocale: string) {
  isLoading.value = true;
  locale.value = newLocale;
  currentMessages = i18n.global.getLocaleMessage(newLocale);
  isLoading.value = false;
}




</script>

<template>
  <header>

    <RouterLink to="/" class="logo" ><img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /></RouterLink>

    <nav>
      
      <RouterLink to="/" class="Home" :class="locale">{{ $t("Home") }}</RouterLink>
      <RouterLink to="/about" class="About" :class="locale">{{ $t("About") }}</RouterLink>
      <RouterLink to="/idiom" class="Login" :class="locale">{{ $t("Login") }}</RouterLink>
      <LocaleSwitcher v-if="!errorOnFetch" @update:locale="updateLocale" />
      <!-- <button @click="debug" class="Change" :class="locale">{{ $t("Debug") }}</button> -->

      <!-- <div class="idioms">
          <input type="text" v-model="key" placeholder="Key to change">
          <input type="text" v-model="word" placeholder="New String">
          <button @click="updateElement(key, word)" class="Change" :class="locale">{{ $t("Change") }}</button>
        </div> -->
    </nav>

  </header>

  <div v-if="errorOnFetch" class="Fetch Error">Error fetching data</div>

  <div v-if="isLoading ">Loading...</div>
    <ArticleDisplay 
      v-else
      v-for="(item, index) in currentMessages.News"
      :key="index"
      :newsContent="item">
    </ArticleDisplay>


  <RouterView />

</template>



<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 1rem 2rem 0 2rem;
}


nav {
  width: 100%;
  margin-top: 2rem;
  display: flex;
  justify-content: right;
  font-size: 1rem;
  padding: 1rem 0;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  align-self: center;
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

}
</style>@/components/ArticleDisplay.vue
