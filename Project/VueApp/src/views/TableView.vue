<script setup lang="ts">

import { idioms } from '@/i18n.js';
import i18n from '@/i18n.js';
import  utils  from '@/utils.js';
import { ref } from 'vue';
import { watch } from 'vue';
import { onMounted } from 'vue';
import { reactive } from 'vue';
import { useI18n } from "vue-i18n";



let { locale } = useI18n()
let currentMessages = i18n.global.getLocaleMessage(locale.value);
let currentInput: any = reactive([]);
let orderFilter = ref('asc');
let idiomChoice = ref<string[]>([]);
let search_v = ref('');
let search_n = ref('');
populateCurrentInput();





watch(locale, (newLocale) => {
  for(let i = 0; i < idioms.length; i++) {
    if(idioms[i].name === newLocale) {
      currentMessages = i18n.global.getLocaleMessage(newLocale);
      Object.assign(currentMessages, idioms[i].vocabulary);
    }
  }

});

function populateCurrentInput() {
  for (let i = 0; i < idioms.length; i++) {
    let vocabulary = getVocabulary(idioms[i].name);
    for (let key in vocabulary) {
      let finalKey = idioms[i].name + "." + key;
        if (typeof vocabulary[key] === 'object') {
          for (let subKey in vocabulary[key]) {
            let fullKey = finalKey + "." + subKey;
            currentInput[fullKey + '.Title'] = vocabulary[key][subKey].Title;
            currentInput[fullKey + '.Subtitle'] = vocabulary[key][subKey].Subtitle;
            currentInput[fullKey + '.Body'] = vocabulary[key][subKey].Body;
          }
        }
       else if (!currentInput[finalKey]) {
        currentInput[finalKey] = vocabulary[key];
      }

    }
  }
  console.log(currentInput);
}

function debug() {
  console.log(idiomChoice.value);
}


function filterSearch(vocabulary: Object, search: string) {
  let filteredVocabulary = Object.assign({}, vocabulary);
  let search_lower = search.toLowerCase();
  for(let key in vocabulary) {
    let key_lower = key.toLowerCase();
    if(!key_lower.includes(search_lower)) {
      delete filteredVocabulary[key as keyof typeof filteredVocabulary];
    }
  }
  return filteredVocabulary;
}

function getVocabulary(idiom: string) {
  for (let i = 0; i < idioms.length; i++) {
    if (idioms[i].name === idiom ) {
        let vocabulary = Object.assign({}, idioms[i].vocabulary); //make a copy of the object
        if(!(search_v.value == '')){
          vocabulary = Object.assign({},filterSearch(vocabulary, search_v.value));
        }
        return vocabulary;
    }
    }
}

function getNews(idiom: string) {
  for (let i = 0; i < idioms.length; i++) {
    if (idioms[i].name === idiom) {
      let news = Object.assign({}, idioms[i].vocabulary.News);
      if(!(search_n.value == '')){
          news = Object.assign({},filterSearch(news, search_n.value));
        }
        return news;
    }
    
  }
  
}

function getFilteredIdioms() {
  let filteredIdioms = [];

  if(idiomChoice.value.length === 0) {
    return idioms;
  }
  for (let i = 0; i < idioms.length; i++) {
    if (idiomChoice.value.includes(idioms[i].name) ) {
      filteredIdioms.push(idioms[i]);
    }
  }
  return filteredIdioms;
}







//Fazer tabela para noticias


onMounted(() => {
  utils.removeEventListeners();
});

 
</script>

<template>

  <!-- <select class="order" v-model="orderFilter">
    <option value="asc">&#8593; Alphabetical </option>
    <option value="desc">&#8595; Alphabetical</option>
  </select> -->

  

  <div class="filters">
    <div v-for="idiom in idioms" :key="idiom.name">
      <input type="checkbox" :id="idiom.name" :value="idiom.name" v-model="idiomChoice">
      <label :for="idiom.name">{{ idiom.name + ' ' + utils.getFlag(idiom.name) }}</label>
    </div>
  </div>


<!-- <button @click="debug">Debug</button> -->

<h2>Vocabulary</h2>
  <div class="search">
    <input type="text" class="search" placeholder="Search for an Identifier" v-model="search_v"/>
  </div>
  <table class="table">
    <thead>
      <tr>
        <th class="idiom"> Idiom </th>
        <th class="identifier">Identifier</th>
        <th class="text"> Text </th>
        <th class="submit">Submit</th>
      </tr>
    </thead>
    <tbody v-for="(item, index) in getFilteredIdioms()" :key="index">
      <tr v-for="(word, key) in getVocabulary(item.name)" :key="key">
        <td class="idiom" v-if="String(key) != 'News'"> {{ item.name + ' ' + utils.getFlag(item.name) }} </td>
        <td class="identifier" v-if="String(key) != 'News'"> {{ key }}</td> 
        <td class="text" v-if="String(key) != 'News'"><input type="text" class="input" v-model="currentInput[item.name + '.' + key]" /></td>
        <td class="submit" v-if="String(key) != 'News'"><button class="submit" @click="utils.updateElement(key.toString(), currentInput[item.name + '.' + key], item.name, currentMessages, locale, idioms)" >Submit</button></td>
      </tr>
    </tbody>
  </table>


  

  <h2>News</h2>
  <div class="search">
    <input type="text" class="search" placeholder="Search for an Article" v-model="search_n"/>
  </div>
  <table class="table">
    <thead>
      <tr>
        <th class="idiom"> Idiom </th>
        <th class="identifier">Article</th>
        <th class="identifier">Identifier</th>
        <th class="text"> Text </th>
        <th class="submit">Submit</th>
      </tr>
    </thead>
    <tbody v-for="(item, index) in getFilteredIdioms()" :key="index">
      <template  v-for="(word, key) in getNews(item.name)" :key="key">
        <tr v-for="(text, subKey) in word" :key="subKey" >
          <td class="idiom" v-if="String(subKey) != 'Identifier'"> {{ item.name + ' ' + utils.getFlag(item.name) }} </td>
          <td class="identifier" v-if="String(subKey) != 'Identifier'"> {{ key }}</td> 
          <td class="identifier" v-if="String(subKey) != 'Identifier'"> {{ subKey }}</td>
          <td class="text" v-if="String(subKey) != 'Identifier'"><textarea type="text" class="input area" v-model="currentInput[item.name + '.News.' + key + '.' + subKey]" /></td>
          <td class="submit" v-if="String(subKey) != 'Identifier'"><button class="submit" @click="utils.updateElement('News.' + key + '.' + subKey, currentInput[item.name + '.News.' + key + '.' + subKey], item.name, currentMessages, locale, idioms)" >Submit</button></td>
        </tr>
      </template>
    </tbody>
  </table>


</template>



<style scoped>

h2 {
  text-align: center;
  font-size: 45px;
}

.table {
  width: 80%;
  border-collapse: collapse;
  margin: 2em auto;
  background-color: rgba(194, 227, 196, 0.802);
}


.table, .table tr, .table td, .table th {
  border: 1px solid black;
}

.table-header {
  width: 80%;
  border: 1px solid black;
}


.idiom, .text, .identifier, .submit{
  border: 1px solid black ;
  padding: 8px;
  text-align: center;
  color: black;
  font-size: 17px;
}

.search {
  width: 50%;
  margin: 0 auto;
  text-align: center;
}

.filters {
  width: 50%;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}


button.submit {
  background-color: #1818183f;
  border: none;
  color: white;
  padding: 8px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}

button.submit:hover {
  background-color: #181818;
}

.identifier {
  width: 20%;
}
.text {
  width: 70%;
}

.idiom {
  width: 10%;
}


.input {
  width: 100%;
  border: none;
  padding: 8px;
  text-align: left;
  background-color: rgb(215, 238, 216);
  font-size: 15px;
}

.input.area {
  height: 100px;
  max-width: 100%;
  max-height: 200px;
}

input:focus {
  outline: 3px solid rgb(15, 40, 4);
}

</style>