<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useI18n } from "vue-i18n";
import { ref, onMounted, onUpdated } from "vue";
import LocaleSwitcher from '@/components/LocaleSwitcher.vue'
import i18n from './i18n.js';
import { i18nFunctions } from './i18n.js';
import utils from './utils.ts';
import { useRoute } from 'vue-router';



let { locale } = useI18n()
let currentMessages = i18n.global.getLocaleMessage(locale.value);
let errorOnFetch = Object.keys(currentMessages).length === 0;

const route = useRoute();
const isAtTable = window.location.pathname === '/table';





let isLoading = ref(false);

function debug() {
  console.log(currentMessages);
}


onMounted(() => {
  if (!isAtTable) utils.populateEditableElements(locale.value, currentMessages);
});


onUpdated(() => {
  currentMessages = i18n.global.getLocaleMessage(locale.value);
  if (!isAtTable) utils.populateEditableElements(locale.value, currentMessages);
});






async function updateLocale(newLocale: string) {
  isLoading.value = true;
  locale.value = newLocale;
  isLoading.value = false;

  if (!i18n.global.availableLocales.includes(locale.value) && i18nFunctions.idioms == null) {
    let new_locale_messages = await i18nFunctions.getNewMessages(locale.value);
    i18n.global.setLocaleMessage(locale.value, new_locale_messages);
    currentMessages = i18n.global.getLocaleMessage(locale.value);

    if (!isAtTable) utils.populateEditableElements(locale.value, currentMessages);
  }
}



</script>

<template>
  <header>

    <RouterLink to="/" class="logo"><img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
    </RouterLink>

    <nav>

      <RouterLink to="/" class="Home" :class="locale">{{ $t("Home") }}</RouterLink>

      <RouterLink to="/about" class="About" :class="locale">{{ $t("About") }}</RouterLink>

      <RouterLink to="/table" class="Table" :class="locale">{{ $t("Table") }}</RouterLink>

      <RouterLink to="/idioms" class="Idioms" :class="locale">{{ $t("Idioms") }}</RouterLink>



      <Suspense>
        <LocaleSwitcher v-if="!errorOnFetch" @update:locale="updateLocale" />
      </Suspense>

    </nav>

  </header>


  <Suspense>
    <template #default>
      <RouterView />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>





</template>



<style scoped>
header {
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  line-height: 1.5;
  max-height: 100vh;
  margin-bottom: 60px;
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
  font-size: 1.2rem;
  padding: 1rem 0;
  align-items: center;
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
