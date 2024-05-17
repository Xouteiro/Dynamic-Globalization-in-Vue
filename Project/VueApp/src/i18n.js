// src/i18n.js

import { createI18n } from "vue-i18n";

let fetchError = false;

async function fetchIdioms() {
  try {
    const response = await fetch('http://localhost:5037/Idioms');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation: ', error);
    fetchError = true;
    return [];  // return a default value
  }
}

const idioms = await fetchIdioms();

function loadLocaleMessages() {
  let locales = [];
  for (const idiom of idioms) {
    locales.push({ [idiom.name]: {...idiom.vocabulary, ...idiom.News} });
  }
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
  messages:  loadLocaleMessages(),  //preenche $i18.availableLocales com as linguagens disponíveis
});

export default i18n;
export {idioms};
 