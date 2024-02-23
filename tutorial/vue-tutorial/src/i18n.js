// src/i18n.js

import { createI18n } from "vue-i18n";

async function fetchIdioms() {
  const response = await fetch('http://localhost:3000/Idioms');
  const data = await response.json();
  return data;
}

const idioms = await fetchIdioms();

function loadLocaleMessages() {
  let locales = [];
  for (const idiom of idioms) {
    locales.push({ [idiom.name]: idiom.vocabulary });
  }
  const messages = {};
  locales.forEach((lang) => {
    const key = Object.keys(lang);
    messages[key] = lang[key];
  });
  return messages;
}
export default createI18n({
  locale: "en",   // set initial locale
  fallbackLocale: "en",
  legacy: false, // false for Composition API
  messages: loadLocaleMessages(), 
});