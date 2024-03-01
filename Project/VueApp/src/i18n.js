// src/i18n.js

import { createI18n } from "vue-i18n";

async function fetchIdioms() {
  const response = await fetch('http://localhost:5037/Idioms/en'); 
  const data = await response.json();
  return data;
}

function getAllIdioms(){
  const url = 'http://localhost:5037/Idioms/get/names' ; //change to + locale.value when api is ready
  fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    return data;
  })
  .catch((error) => {
    console.error('Error:', error);
  });
  
}

//Tenho duas opções, ou dou refresh para atualizar a cada vez que uma palavra é mudada
// ou faço um fetch para cada lingua e faço-o sempre que troco uma palavra

const idioms = await fetchIdioms();
console.log(idioms);

function loadLocaleMessages() {
  let locales = [];
  //for (const idiom of idioms) {
  locales.push({ [idioms.name]: idioms.vocabulary });
  //}
  const messages = {};
  locales.forEach((lang) => {
    const key = Object.keys(lang);
    messages[key] = lang[key];
  });
  return messages;
}
const i18n = createI18n({
  locale: "en",   // set initial locale
  fallbackLocale: "en",
  legacy: false, // false for Composition API
  messages:  loadLocaleMessages(),
  availableLocales:  getAllIdioms() //preenche $i18.availableLocales com as linguagens disponíveis
});
export default i18n;