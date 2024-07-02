<script setup lang="ts">

import i18n from '@/i18n.js';
import { i18nFunctions } from '@/i18n.js';
import utils from '@/utils.js';
import { ref } from 'vue';
import { watch } from 'vue';
import { onMounted } from 'vue';
import { reactive } from 'vue';
import { useI18n } from "vue-i18n";
import unused from '../assets/warnings/unused.png';
import missing from '../assets/warnings/missing.png';
import used from '../assets/warnings/used.png';
import new_img from '../assets/warnings/new.png';
import { computed } from 'vue';



let { locale } = useI18n()
let currentMessages = i18n.global.getLocaleMessage(locale.value);
let currentInput: any = reactive([]);
let idiomChoice = ref<string[]>([]);
let search_v = ref('');
let error_message = ref('');
let vocabulary_empty = 1;
let new_key = ref('');
let new_value = ref('');




if (i18nFunctions.idioms == null) {
  i18nFunctions.idioms = await i18nFunctions.fetchAllIdioms();
  for(let i = 0; i < i18nFunctions.idioms.length; i++){
    i18n.global.setLocaleMessage(i18nFunctions.idioms[i].name, {...i18nFunctions.idioms[i].vocabulary, ...i18nFunctions.idioms[i].News});
  }
}

let idioms = i18nFunctions.idioms;


const filteredIdioms = computed(() => getFilteredIdioms());


const vocabulary = computed(() => {
  const idiomNames = filteredIdioms.value.map((idiom: { name: any; }) => idiom.name);
  const result = idiomNames.map((name: string) => getVocabulary(name));
  return result;
});

populateCurrentInput();

watch(locale, (newLocale) => {
  for (let i = 0; i < idioms.length; i++) {
    if (idioms[i].name === newLocale) {
      currentMessages = i18n.global.getLocaleMessage(newLocale);
      Object.assign(currentMessages, idioms[i].vocabulary);
    }
  }
});





function populateCurrentInput() {
  for (let i = 0; i < idioms.length; i++) {
    let vocabulary = getVocabulary(idioms[i].name);
    let news = getAllNews(idioms[i]);
    for (let key in vocabulary) {
      let finalKey = idioms[i].name + "." + key;
      currentInput[finalKey] = vocabulary[key];
    }
    for (let key = 0; key < Object.keys(news).length; key++) {
      let object = Object.values(news)[key];
      let finalKey = idioms[i].name + "." + Object.keys(news)[key];
      for (let subKey in object) {
        currentInput[finalKey + "." + subKey] = object[subKey];
      }
    }
  }
}



function filterSearch(vocabulary: Object, search: string) {
  let filteredVocabulary = Object.assign({}, vocabulary);
  let search_lower = search.toLowerCase();
  let keys = Object.keys(vocabulary);
  for (let i = 0; i < Object.values(vocabulary).length; i++) {
    let key_lower = keys[i].toLowerCase();
    if (typeof Object.values(vocabulary)[i] != 'object') {
      let value_lower = Object.values(vocabulary)[i].toLowerCase();
      if (!key_lower.includes(search_lower) && !value_lower.includes(search_lower)) {
        delete filteredVocabulary[keys[i] as keyof typeof filteredVocabulary];
      }
    }
  }
  return filteredVocabulary;
}

function getVocabulary(idiom: string) {
  let valueLessVocabulary;
  for (let i = 0; i < idioms.length; i++) {
    if (idioms[i].name === i18nFunctions.main_language) {
      valueLessVocabulary = Object.assign({}, idioms[i].vocabulary);
      for (let key in valueLessVocabulary) {
        valueLessVocabulary[key] = "";
      }
    }
  }
  for(let i = 0; i < idioms.length; i++){
    if (idioms[i].name === idiom) {
      let vocabulary = Object.assign({}, idioms[i].vocabulary);
      if (!(search_v.value == '')) {
        vocabulary = Object.assign({}, filterSearch(vocabulary, search_v.value));
        for (let key in filterSearch(valueLessVocabulary, search_v.value)) {
          if (vocabulary[key] == undefined) {
            vocabulary[key] = "";
          }
        }
      } else {
        for (let key in valueLessVocabulary) {
          if (vocabulary[key] == undefined) {
            vocabulary[key] = "";
          }
        }
      }
      if (Object.keys(vocabulary).length != 0) {
        vocabulary_empty = 0;
      }

      for(let key in vocabulary){
        if(vocabulary[key] == '' && idiom == i18nFunctions.main_language){
          delete vocabulary[key];
        }
      }

      return vocabulary;
    }
  }
}


function getAllNews(currentMessages: any) {
  let news: Array<Object>;
  news = [];
  let newNews = {};
  for (let i = 0; i < Object.values(currentMessages).length; i++) {
    if (typeof Object.values(currentMessages)[i] === "object") {
      newNews = Object.assign({}, Object.values(currentMessages)[i]);
      news.push(newNews);
    }
  }
  return news[1];
}


function getNews(idioms_vocab: any, idiom: string) {
  for (let i = 0; i < idioms.length; i++) {
    if (idioms[i].name === idiom) {
      let news = [];
      let newNews = {};
      for (let i = 0; i < Object.values(idioms[i]).length; i++) {
        if (typeof Object.values(idioms[i])[i] === "object") {
          newNews = Object.assign({}, Object.values(idioms[i])[i]);
          news.push(newNews);
        }
      }
      return news;
    }

  }

}

function getFilteredIdioms() {
  vocabulary_empty = 1;
  let main_idiom = null;
  let filteredIdioms: any = [];

  if (idiomChoice.value.length === 0) {
    for (let i = 0; i < idioms.length; i++) {
    if (idioms[i].name === i18nFunctions.main_language) {
      main_idiom = idioms[i];
    }
  }
  filteredIdioms.push(main_idiom);
  for(let i = 0; i < idioms.length; i++){
    if(idioms[i].name != i18nFunctions.main_language){
      filteredIdioms.push(idioms[i]);
    }
  }
  return filteredIdioms;
  }
  for (let i = 0; i < idioms.length; i++) {
    if (idiomChoice.value.includes(idioms[i].name)) {
      filteredIdioms.push(idioms[i]);
    }
  }
  return filteredIdioms;
}


function updateElement(key_to_change: string, word_to_change: string, locale_: string, currentMessages: any, is_News: boolean, currentMessages_locale?: string, idioms?: any, new_pair?: boolean) {
  if (locale_ == i18nFunctions.main_language && word_to_change == '') {

    error_message.value = "Use delete to delete the value";
    setTimeout(() => {
      error_message.value = '';
    }, 2000);
    return;
  }

  utils.updateElement(key_to_change, word_to_change, locale_, currentMessages, is_News, currentMessages_locale, idioms);

  for (let i = 0; i < idioms.length; i++) {
    if (idioms[i].name === locale_) {
      if (word_to_change == '') {
        delete idioms[i].vocabulary[key_to_change]
      } else {
        idioms[i].vocabulary[key_to_change] = word_to_change;
      }
    }
  }

  if (new_pair) {
    vocabulary.value[0][key_to_change] = word_to_change;
    currentInput[locale_ + '.' + key_to_change] = word_to_change;
    for (let i = 0; i < vocabulary.value.length; i++) {
      if (vocabulary.value[i][key_to_change] == undefined) {
        vocabulary.value[i][key_to_change] = '';
      }
    }
    new_key.value = '';
    new_value.value = '';
  }
}

function deleteElement(event: any, key_to_change: string, locale_: string, currentMessages: any, is_News: boolean, currentMessages_locale?: string, idioms?: any) {

  utils.deleteElement(key_to_change, locale_, currentMessages, is_News, currentMessages_locale, idioms);
  for (let i = 0; i < idioms.length; i++) {
    if (idioms[i].name === locale_) {
      delete currentMessages[key_to_change];
      delete idioms[i].vocabulary[key_to_change];

    }
  }
  event.target.closest('tr').remove();
}


function clearElement() {
  new_key.value = '';
  new_value.value = '';

}

function getUsage(key: string, idiom: string, currentInput: string) {
  let main_idiom = null
  for(let i = 0; i < idioms.length; i++){
    if(idioms[i].name == i18nFunctions.main_language){
      main_idiom = idioms[i].vocabulary;
    } 
  }

  if (key in main_idiom) {
    if (currentInput == undefined || currentInput == '') {
      return missing;
    }
    else {
      return used;
    }
  }
  else {
    if(idiom == i18nFunctions.main_language){
      return missing;
    }
    else{
      return unused;
    }
  }
}

function getTitle(usage: string) {
  if (usage == missing) {
    return "This value is missing";
  }
  else if (usage == used) {
    return "This value is used";
  }
  else if (usage == new_img) {
    return "This is a new value";
  }
  else {
    return "This value is not used";
  }
}




onMounted(() => {
  utils.removeEventListeners();
});


</script>

<template>

  <div class="filters">
    <div v-for="idiom in idioms" :key="idiom.name">
      <input type="checkbox" :id="idiom.name" :value="idiom.name" v-model="idiomChoice">
      <label :for="idiom.name">{{ idiom.name + ' ' + utils.getFlag(idiom.name) }}</label>
    </div>
  </div>



  <template v-if="error_message != undefined">
    <div class="error">
      <p>{{ error_message }}</p>
    </div>
  </template>

  <h2>Vocabulary</h2>
  <div class="search">
    <input type="text" class="search" placeholder="Search for an Identifier or a Word" v-model="search_v" />
  </div>

  <table class="table">
    <thead>
      <tr>
        <th class="idiom"> Idiom </th>
        <th class="identifier">Identifier</th>
        <th class="text"> Text </th>
        <th class="submit" colspan="2">Action</th>
        <th class="submit">Warning</th>
      </tr>
    </thead>
    <tbody v-for="(item, index) in filteredIdioms" :key="index">
      <template v-if="item.name == i18nFunctions.main_language">
        <tr class="new-word">
          <td class="idiom"> {{ item.name + ' ' + utils.getFlag(item.name) }} </td>
          <td class="identifier"> <input type="text" class="input" v-model="new_key"
              :placeholder="new_key == '' ? ' Add a new key' : new_key" />
          </td>
          <td class="text"><input type="text" class="input" v-model="new_value"
              :placeholder="new_value == '' ? ' Add a new word to the main idiom' : new_value" />
          </td>
          <td class="submit"><button class="submit"
              @click="updateElement(new_key, new_value, item.name, currentMessages, false, locale, idioms, true)">Create</button>
          </td>
          <td class="submit"><button class="submit" @click="clearElement()">Clear</button>
          </td>
          <td class="warning"> <img class="warning" :src="new_img" :title="getTitle('new_image')" />
          </td>
        </tr>
      </template>
      <tr v-for="(word, key) in vocabulary[index]" :key="key" :class="key + ' ' + item.name">
        <td class="idiom"> {{ item.name + ' ' + utils.getFlag(item.name) }} </td>
        <td class="identifier"> {{ key }}</td>
        <td class="text"><input type="text" class="input" v-model="currentInput[item.name + '.' + key]"
            :placeholder="(currentInput[item.name + '.' + key] == '' || currentInput[item.name + '.' + key] == undefined) ? ' ⚠ Complete this missing value' : currentInput[item.name + '.' + key]" />
        </td>
        <td class="submit"><button class="submit"
            @click="updateElement(key.toString(), currentInput[item.name + '.' + key], item.name, currentMessages, false, locale, idioms)">Submit</button>
        </td>
        <td class="submit"><button class="submit"
            @click="deleteElement($event, key.toString(), item.name, currentMessages, false, locale, idioms)">Delete</button>
        </td>
        <td class="warning"> <img class="warning"
            :src="getUsage(key.toString(), item.name, currentInput[item.name + '.' + key])"
            :title="getTitle(getUsage(key.toString(), item.name, currentInput[item.name + '.' + key]))" /></td>
      </tr>
    </tbody>
    <template v-if="vocabulary_empty == 1 && (!idiomChoice.includes(i18nFunctions.main_language) && idiomChoice.length != 0)">
      <p class="error">No results found</p>
    </template>
  </table>




  <h2>News</h2>

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
      <template v-for="(word, key) in getAllNews(item)" :key="key">
        <tr v-for="(text, subKey) in word" :key="subKey">
          <td class="idiom" v-if="String(subKey) != 'Identifier'"> {{ item.name + ' ' + utils.getFlag(item.name) }}
          </td>
          <td class="identifier" v-if="String(subKey) != 'Identifier'"> {{ key }}</td>
          <td class="identifier" v-if="String(subKey) != 'Identifier'"> {{ subKey }}</td>
          <td class="text" v-if="String(subKey) != 'Identifier'"><textarea type="text" class="input area"
              v-model="currentInput[item.name + '.' + key + '.' + subKey]" /></td>
          <td class="submit" v-if="String(subKey) != 'Identifier'"><button class="submit"
              @click="utils.updateElement(key + '.' + subKey, currentInput[item.name + '.' + key + '.' + subKey], item.name, currentMessages, true, locale, idioms)">Submit</button>
          </td>
        </tr>
      </template>
    </tbody>
  </table>


</template>



<style scoped>
h2 {
  text-align: center;
  font-size: 45px;
  margin-top: 30px;
}

.table {
  width: 80%;
  border-collapse: collapse;
  margin: 2em auto;
  background-color: rgba(194, 227, 196, 0.802);
}


.table,
.table tr,
.table td,
.table th {
  border: 1px solid black;
}

.table-header {
  width: 80%;
  border: 1px solid black;
}


.idiom,
.text,
.identifier,
.submit {
  border: 1px solid black;
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

img.warning {
  width: 40px;
  height: 40px;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 5px;
}

.filters div input[type="checkbox"] {
  margin-right: 10px;
  appearance: none;
  background-color: #d7eed8;
  padding: 9px;
  border-radius: 3px;
  display: inline-block;
  position: relative;
  width: 25px;
  height: 25px;
}

.filters div input[type="checkbox"]:checked::before {
  content: "\2713";
  position: absolute;
  font-size: 20px;
  line-height: 15px;
  top: 4px;
  left: 5px;
  color: #032516;
}

.filters div input[type="checkbox"]:checked {
  background-color: #d7eed8;
  border-color: #000000;
  color: #127b37;
}

.filters div label {
  font-size: 20px;
  margin: 0;
}

.filters div {
  display: flex;
  align-items: center;
  margin-top: 10px;

}
</style>