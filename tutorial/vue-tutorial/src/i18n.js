// src/i18n.js

import { createI18n } from "vue-i18n";
import idioms from "./locales/idioms.json";

function loadLocaleMessages() {
  let locales = [];
  for (const idiom of idioms.Idioms) {
    locales.push({ [idiom.name]: idiom.vocabulary });
  }
  console.log(locales);
  const messages = {};
  locales.forEach((lang) => {
    const key = Object.keys(lang);
    messages[key] = lang[key];
  });
  return messages;
}
export default createI18n({
  locale: "en",
  fallbackLocale: "en",
  legacy: false,
  messages: loadLocaleMessages(),
});