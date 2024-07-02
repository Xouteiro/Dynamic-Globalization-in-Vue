<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useI18n } from "vue-i18n";
import { ref, onMounted, onUpdated } from "vue";
import LocaleSwitcher from '@/components/LocaleSwitcher.vue'
import i18n from './i18n.js';
import { i18nFunctions } from './i18n.js';
import utils from './utils.ts';
import RouterMiddleware from '@/components/RouterMiddleware.vue';


let { locale } = useI18n()
let currentMessages = i18n.global.getLocaleMessage(locale.value);
let errorOnFetch = Object.keys(currentMessages).length === 0;
let isLoading = ref(false);


onMounted(() => {
  if (window.location.pathname !== '/table') utils.populateEditableElements(locale.value, currentMessages);
});



onUpdated(() => {
  currentMessages = i18n.global.getLocaleMessage(locale.value);
  if (window.location.pathname !== '/table') utils.populateEditableElements(locale.value, currentMessages);
});






async function updateLocale(newLocale: string) {
  isLoading.value = true;
  locale.value = newLocale;
  isLoading.value = false;

  localStorage.setItem('prefered_language', newLocale);

  if (!i18n.global.availableLocales.includes(locale.value) && i18nFunctions.idioms == null) {
    let new_locale_messages = await i18nFunctions.getNewMessages(locale.value);
    i18n.global.setLocaleMessage(locale.value, new_locale_messages);
    currentMessages = i18n.global.getLocaleMessage(locale.value);
    if (window.location.pathname !== '/table') utils.populateEditableElements(locale.value, currentMessages);
  }
}



</script>

<template>
  <header>

    <RouterLink to="/" class="logo"><img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
    </RouterLink>

    <nav>

      <RouterLink to="/" class="Home" :class="locale">{{ $t("Home") }}</RouterLink>

      <RouterLink to="/about" class="Text-Elements" :class="locale">{{ $t("Text-Elements") }}</RouterLink>

      <RouterLink to="/table" class="Table" :class="locale">{{ $t("Table") }}</RouterLink>

      <RouterLink to="/idioms" class="Idioms" :class="locale">{{ $t("Idioms") }}</RouterLink>



      <Suspense>
        <LocaleSwitcher v-if="!errorOnFetch" @update:locale="updateLocale" />
      </Suspense>

    </nav>

  </header>

  <div class="error-container" v-if="errorOnFetch">
    <div v-if="errorOnFetch" class="error-warning">Error fetching your news. Refresh the page!</div>
  </div>

  <Suspense>
    <RouterMiddleware />
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

.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40vh;

}

.error-warning {
      display: inline-block;
      background: linear-gradient(90deg, #34495e,#41b883);
      color: white;
      padding: 20px  30px 20px 60px;
      border-radius: 10px;
      font-family: 'Arial', sans-serif;
      font-size: 18px;
      font-weight: bold;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      position: relative;
      overflow: hidden;
      animation: fadeIn 0.5s ease-in-out, pulse 2s infinite;
    }

    .error-warning::before {
      content: '!';
      position: absolute;
      top: 50%;
      left: 15px;
      transform: translateY(-50%);
      font-size: 24px;
      background: white;
      color: #41b883;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: scale(0.9);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes pulse {
      0%, 100% {
        box-shadow: 0 0 20px #307154;
      }
      50% {
        box-shadow: 0 0 20px #34495e;
      }
    }

</style>
