<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import LocaleSwitcher from '@/components/LocaleSwitcher.vue'

const { locale } = useI18n() 
let idiom = ref('en');
let vocabulary = ref();
let idiom_data: any;
let word = ref<string>('');


async function fetchIdioms() {
    const response = await fetch('http://localhost:3000/Idioms');
    const data = await response.json();
    return data;
}

async function getLang(name: String) {
  const data = await fetchIdioms();
  for (const lang of  data) {
    if (lang.name == name) {
      return lang;
    }
  }
  return null;
}


function changeWord (key: string, word: string){
    const url = 'http://localhost:3000/Idioms/' + idiom_data.id;
    idiom_data.vocabulary[key] =  word; 
    const newData = idiom_data; 
    fetch(url, {
    method: 'PUT', 
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
    })
    .then(response => response.json())
    .catch((error) => {
    console.error('Error:', error);
    });
    
}

function updateString (key:string, word:string, locale: string){
    const wordValue = idiom_data.vocabulary[key];
    const toReplace = document.getElementsByClassName(key);
    for(const element in toReplace){
        if(toReplace[element].textContent != undefined && toReplace[element].classList.contains(locale)){
            console.log("entered")
            toReplace[element].textContent = wordValue;
        }
    }
}


function updateElement (word_to_change: string){
    changeWord("numbers", word_to_change);
    updateString("numbers",word_to_change, idiom.value);
    word.value = '';
}

async function updateLocale (newLocale: string){
    idiom.value = newLocale
    try{
        const promise = await getLang(idiom.value);
        vocabulary = promise.vocabulary;
        idiom_data = promise;
        for (const key in idiom_data.vocabulary) {
            updateString(key, idiom_data.vocabulary[key], newLocale);
        }
    } catch (error){
        console.log(error)
    }
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
        <input type="text" v-model="word">
        <button @click="updateElement(word)" class="Change" :class="locale">{{ $t("Change") }}</button>

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
