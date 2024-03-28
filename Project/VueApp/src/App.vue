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


let isLoading = ref(false);

function debug() {
   console.log(currentMessages);
 }


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






async function updateLocale(newLocale: string) {
    isLoading.value = true;
    locale.value = newLocale;
    isLoading.value = false;
}



</script>

<template>
  <header>

    <RouterLink to="/" class="logo"><img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
    </RouterLink>

    <nav>

      <div>
      <RouterLink to="/" class="Home" :class="locale" >{{ $t("Home") }}</RouterLink>
      </div>
    
      <div>
      <RouterLink to="/about" class="About" :class="locale">{{ $t("About") }}</RouterLink>
      </div>
    
      <div>
      <RouterLink to="/table" class="Table" :class="locale">{{ $t("Table") }}</RouterLink>
      </div>
    
      <div>
      <RouterLink to="/login" class="Login" :class="locale">{{ $t("Login") }}</RouterLink>
      </div>
    
    
      <LocaleSwitcher v-if="!errorOnFetch" @update:locale="updateLocale" />
      
    




      
    </nav>

  </header>




    <RouterView />

</template>



<style scoped>

header {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
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

div {
  display: inline-block;
  height: fit-content;
  align-self: center;
}

div nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
  align-self: center;
  height: fit-content;
}

nav a:first-of-type {
  border: 0;
}

div.locale-switcher {
  display: inline-block;
  height: fit-content;
  align-self: center;
}


</style>
