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
      if(key === 'News') {
        continue;
      }
      else if (!currentInput[finalKey]) {
        currentInput[finalKey] = vocabulary[key];
      }

    }
  }
}

function debug() {
  console.log(currentMessages);
}

function getVocabulary(idiom: string) {
  for (let i = 0; i < idioms.length; i++) {
    if (idioms[i].name === idiom) {
      let vocabulary = Object.assign({}, idioms[i].vocabulary); //make a copy of the object
      delete vocabulary.News;
      return vocabulary;
    }
  }
}





//Fazer tabela para noticias


onMounted(() => {
  utils.removeEventListeners();
});

 
</script>

<template>
  
  <h1>Vocabulary</h1>
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
      <td class="idiom"> {{ item.name }} </td>
      <td class="identifier"> {{ key }}</td> 
      <td class="text"><input type="text" v-model="currentInput[item.name + '.' + key]" /></td>
      <td class="submit"><button @click="utils.updateElement(key.toString(), currentInput[item.name + '.' + key], item.name, currentMessages, locale, idioms)" >Submit</button></td>
    </tr>
  </tbody>
</table>


</template>



<style scoped>

h1 {
  text-align: center;
}

.table {
  width: 80%;
  border-collapse: collapse;
  margin: 2em auto;
}

.row, .table-header {
  display: flex;
}

.table-header {
  width: 80%;
}


.idiom, .text, .identifier, .submit{
  border: 1px solid;
  padding: 8px;
  text-align: center;
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


input {
  width: 100%;
  border: none;
  padding: 8px;
  text-align: left;
}

</style>