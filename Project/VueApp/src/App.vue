<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useI18n } from "vue-i18n";
import { ref, toRaw } from "vue";
import LocaleSwitcher from '@/components/LocaleSwitcher.vue'
import i18n from './i18n.js';





let { locale } = useI18n()
let id = 1 // implement idiom id
let currentMessages = i18n.global.getLocaleMessage(locale.value); //não era preciso o resto
let word = ref<string>('');
let key = ref<string>('');






function changeWord (key: string, word: string){
    const url = 'http://localhost:5037/Idioms/' + locale.value + '/vocabulary'; //change to + locale.value when api is ready

    currentMessages[key] =  word;  //visto nao pode ficar assim, só muda o frontend, escolher uma das opções das notas

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



function updateElement (key_to_change: string, word_to_change: string){
    changeWord(key_to_change, word_to_change);
    word.value = '';
    key.value = '';
}

async function updateLocale (newLocale: string){
    locale.value = newLocale;
    currentMessages = i18n.global.getLocaleMessage(newLocale);
    console.log("\n with the " + newLocale);
}




</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">

      <nav>
        <LocaleSwitcher @update:locale="updateLocale"/>
        <RouterLink to="/" class="Home" :class="locale">{{ $t("Home") }}</RouterLink>
        <RouterLink to="/about" class="About" :class="locale">{{ $t("About") }}</RouterLink>
        <RouterLink to="/idiom" class="Idiom" :class="locale">{{ $t("Idiom") }}</RouterLink>
      </nav>

      <div class="idioms">
        <input type="text" v-model="key" placeholder="Key to change">
        <input type="text" v-model="word" placeholder="New String">
        <button @click="updateElement(key,word)" class="Change" :class="locale">{{ $t("Change") }}</button>

    </div>
    </div>
    
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
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
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

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
