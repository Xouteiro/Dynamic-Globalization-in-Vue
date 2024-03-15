<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useI18n } from "vue-i18n";
import { ref, onMounted, onUpdated } from "vue";
import LocaleSwitcher from '@/components/LocaleSwitcher.vue'
import i18n from './i18n.js';
import utils from './utils.js';


let { locale } = useI18n()
let currentMessages = i18n.global.getLocaleMessage(locale.value);
let errorOnFetch = Object.keys(currentMessages).length === 0;
let word = ref<string>('');
let key = ref<string>('');


let isLoading = ref(false);

// function debug() {
//    console.log(typeof currentMessages);
//    console.log(errorOnFetch);
//  }


onUpdated(() => {
  utils.populateEditableElements(locale.value, currentMessages);
  
});





async function updateLocale(newLocale: string) {
    isLoading.value = true;
    locale.value = newLocale;
    currentMessages = i18n.global.getLocaleMessage(newLocale);
    isLoading.value = false;
}



</script>

<template>
  <header>

    <RouterLink to="/" class="logo"><img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
    </RouterLink>

    <nav>

      <RouterLink to="/" class="Home" :class="locale" >{{ $t("Home") }}</RouterLink>
      <RouterLink to="/about" class="About" :class="locale">{{ $t("About") }}</RouterLink>
      <RouterLink to="/idiom" class="Login" :class="locale">{{ $t("Login") }}</RouterLink>
      <LocaleSwitcher v-if="!errorOnFetch" @update:locale="updateLocale" />



      <!-- <button @click="debug" class="Change" :class="locale">{{ $t("Debug") }}</button> -->

      
    </nav>

  </header>





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
