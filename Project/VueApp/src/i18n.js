import { createI18n } from "vue-i18n";

let fetchError = false;
let main_language = 'en';

async function fetchIdiom(name) {
  try {
    const response = await fetch('http://localhost:5037/Idioms/' + name);

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


const idiom = await fetchIdiom(main_language);

function loadLocaleMessages() {
  let locales = [];
  locales.push({ [idiom.name]: { ...idiom.vocabulary, ...idiom.News } });
  const messages = {};
  locales.forEach((lang) => {
    const key = Object.keys(lang);
    messages[key] = lang[key];
  });
  return messages;
}






const i18n = createI18n({
  locale: main_language,   // set initial locale
  fallbackLocale: main_language, // set fallback locale
  legacy: false, // false for Composition API
  messages: loadLocaleMessages(),  //preenche $i18.availableLocales com as linguagens disponíveis
});



var i18nFunctions = {
  idioms: null,
  idiom_names: null,
  main_language: 'en',
  

  async fetchAllIdioms() {
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
  },

  async fetchIdiomNames() {
    try {
      const response = await fetch('http://localhost:5037/Idioms/get/names');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.map(idiom => idiom.name);
    } catch (error) {
      console.error('There was a problem with the fetch operation: ', error);
      fetchError = true;
      return [];  // return a default value
    }
  },

  async getNewMessages(name) {
    let idiom = await fetchIdiom(name);
    return { ...idiom.vocabulary, ...idiom.News };
  },
}



export default i18n;
export { i18nFunctions }; 