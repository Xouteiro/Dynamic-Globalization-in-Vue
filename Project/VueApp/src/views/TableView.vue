<script setup lang="ts">

import { idioms } from '@/i18n.js';
import i18n from '@/i18n.js';
import  utils  from '@/utils.js';
import { watch } from 'vue';
import { onMounted } from 'vue';
import { reactive } from 'vue';
import { useI18n } from "vue-i18n";



let { locale } = useI18n()
let currentMessages = i18n.global.getLocaleMessage(locale.value);
let currentInput: any = reactive([]);
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
  console.log(currentMessages);
}

function getVocabulary(idiom: string) {
  for (let i = 0; i < idioms.length; i++) {
    if (idioms[i].name === idiom) {
      let vocabulary = Object.assign({}, idioms[i].vocabulary); //make a copy of the object
      //delete vocabulary.News;
      return vocabulary;
    }
  }
}

function getNews(idiom: string) {
  let news = [];
  for (let i = 0; i < idioms.length; i++) {
    if (idioms[i].name === idiom) {
      news = Object.assign({}, idioms[i].vocabulary.News);
    }
  }
  return news;

}





//Fazer tabela para noticias


onMounted(() => {
  utils.removeEventListeners();
});

 
</script>

<template>
  
  <h2>Vocabulary</h2>
  <table class="table">
    <thead>
      <tr>
        <th class="idiom"> Idiom </th>
        <th class="identifier">Identifier</th>
        <th class="text"> Text </th>
        <th class="submit">Submit</th>
      </tr>
    </thead>
    <tbody v-for="(item, index) in idioms" :key="index">
      <tr v-for="(word, key) in getVocabulary(item.name)" :key="key">
        <td class="idiom" v-if="String(key) != 'News'"> {{ item.name + ' ' + utils.getFlag(item.name) }} </td>
        <td class="identifier" v-if="String(key) != 'News'"> {{ key }}</td> 
        <td class="text" v-if="String(key) != 'News'"><input type="text" class="input" v-model="currentInput[item.name + '.' + key]" /></td>
        <td class="submit" v-if="String(key) != 'News'"><button class="submit" @click="utils.updateElement(key.toString(), currentInput[item.name + '.' + key], item.name, currentMessages, locale, idioms)" >Submit</button></td>
      </tr>
    </tbody>
  </table>


  <h2>News</h2>
  <table class="table">
    <thead>
      <tr>
        <th class="idiom"> Idiom </th>
        <th class="identifier">Identifier</th>
        <th class="text"> Text </th>
        <th class="submit">Submit</th>
      </tr>
    </thead>
    <tbody v-for="(item, index) in idioms" :key="index">
      <template v-for="(word, key) in getNews(item.name)" :key="key">
        <tr v-for="(text, subKey) in word" :key="subKey" >
          <td class="idiom" v-if="String(subKey) != 'Identifier'"> {{ item.name + ' ' + utils.getFlag(item.name) }} </td>
          <td class="identifier" v-if="String(subKey) != 'Identifier'"> {{ key + '.' + subKey }}</td> 
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

.row, .table-header {
  display: flex;
}

.table-header {
  width: 80%;
}


.idiom, .text, .identifier, .submit{
  border: 1px solid black;
  padding: 8px;
  text-align: center;
  color: black;
  font-size: 17px;
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