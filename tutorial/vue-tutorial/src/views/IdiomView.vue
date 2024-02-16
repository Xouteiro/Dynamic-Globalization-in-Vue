<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref } from "vue";
import LocaleSwitcher from '@/components/LocaleSwitcher.vue'

let idiom = ref('en');
let vocabulary = ref();
let idiom_data: any;
let word = ref('');



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

async function updateLocale (newLocale: string){
    idiom.value = newLocale
    try{
        const promise = await getLang(idiom.value);
        vocabulary = promise.vocabulary;
        idiom_data = promise;
    } catch (error){
        console.log(error)
    }
}

function changeWord (word: string){
    const url = 'http://localhost:3000/Idioms/' + idiom_data.id;
    idiom_data.vocabulary.About =  word; 
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

function updateString (word: string){
    const toReplace = document.getElementsByClassName("About");
    for(const element in toReplace){
        if(toReplace[element].textContent != undefined){
            toReplace[element].textContent = word;
        }
    }
}

function updateElement (word: string){
    changeWord(word);
    updateString(word);
}



</script>

<template>
    <div class="idioms">
        <LocaleSwitcher @update:locale="updateLocale"/>
        <input type="text" v-model="word">
        <button @click="updateElement(word)" class="Change">{{ $t("Change") }}</button>

    </div>

    <div class="text">
        
        <div class="nav__end">
        <p class="user-greeting About">{{ $t("About") }}</p>
        </div>

    </div>
</template>
<style>
</style>
