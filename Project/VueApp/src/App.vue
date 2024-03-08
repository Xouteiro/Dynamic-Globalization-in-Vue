<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useI18n } from "vue-i18n";
import { ref, onMounted} from "vue";
import LocaleSwitcher from '@/components/LocaleSwitcher.vue'
import i18n from './i18n.js';
import ArticleDisplay from '@/components/ArticleDisplay.vue'
import { on } from 'events';





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

onMounted(() => {
  populateEditableElements();
});



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

function populateEditableElements(){
  const editableElements = document.querySelectorAll('.' + locale.value);
  editableElements.forEach((element) => {
    const newDiv = document.createElement('div');
    element.parentNode!.replaceChild(newDiv, element);
    newDiv.appendChild(element);

    element.addEventListener('mouseover', (e) => {
      if (!newDiv.querySelector('.edit-button')) {
        addEditButton(newDiv, element.classList);
      }
    });
    newDiv.addEventListener('mouseleave', (e) => {
      removeEditButton(newDiv);
    });
  });
}

function addEditButton(element: HTMLElement, classes: DOMTokenList){
  const editButton = document.createElement('button');
  editButton.innerHTML = 'Edit';
  editButton.classList.add('edit-button');
  editButton.addEventListener('click', () => {
    openPopUp(element, classes);
  });
  element.insertBefore(editButton,element.firstChild);
}

function removeEditButton(element: HTMLElement){
  const editButton = element.querySelector('.edit-button');
  if (editButton) {
    element.removeChild(editButton);
  }
}

//REDO this to be a great pop up

function openPopUp(element: HTMLElement, classes: DOMTokenList){
  const popUp = document.createElement('div');
  popUp.classList.add('pop-up');
  const input = document.createElement('input');
  input.value = element.textContent!;
  popUp.appendChild(input);
  const saveButton = document.createElement('button');
  saveButton.innerHTML = 'Save';
  saveButton.addEventListener('click', () => {
    changeWord(classes[0], input.value);
    element.textContent = input.value;
    element.appendChild(document.createElement('br'));
    element.appendChild(document.createElement('br'));
    removePopUp(popUp);
  });
  popUp.appendChild(saveButton);
  const closeButton = document.createElement('button');
  closeButton.innerHTML = 'Close';
  closeButton.addEventListener('click', () => {
    removePopUp(popUp);
  });
  popUp.appendChild(closeButton);
  element.appendChild(popUp);
}

function removePopUp(popUp: HTMLElement){
  popUp.parentNode!.removeChild(popUp);
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
