

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref } from "vue";


const { locale } = useI18n() 
let idiom = ref('en');
let vocabulary = ref();
let idiom_data: any;
let word = ref<string>('');
let key = ref<string>('');




function updateElement (key_to_change: string, word_to_change: string){
    changeWord(key_to_change, word_to_change);
    updateString(key_to_change, word_to_change, idiom.value);
    word.value = '';
    key.value = '';
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
            toReplace[element].textContent = wordValue;
        }
    }
}
</script>

<template>
    

    <div class="idioms">
    <input type="text" v-model="key" placeholder="Key to change">
    <input type="text" v-model="word" placeholder="New String">
    <button @click="updateElement(key,word)" class="Change" :class="locale">{{ $t("Change") }}</button>

  </div>


</template>
<style>
</style>
