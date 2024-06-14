import { createI18n } from "vue-i18n";

let fetchError = false;

async function fetchMainLanguage() {
  try {
    const response = await fetch('http://localhost:5037/mainLanguage');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.main_language;
  }
  catch (error) {
    console.error('There was a problem with the fetch operation: ', error);
    return 'en';  // return a default value
  }
}

let main_language = await fetchMainLanguage();


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
  return { [idiom.name]: { ...idiom.vocabulary, ...idiom.News } };
}

function changeMainLanguage(language) {
  try {
    fetch('http://localhost:5037/mainLanguage', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ main_language: language })
    });
  }
  catch (error) {
    console.error('There was a problem with the fetch operation: ', error);
  }
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
  main_language: main_language,
  waiting: false,

  async fetchAllIdioms() {
    try {
      this.waiting = true;
      const response = await fetch('http://localhost:5037/Idioms');
      this.waiting = false;

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
      this.waiting = true;
      const response = await fetch('http://localhost:5037/Idioms/get/names');
      this.waiting = false;

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
    this.waiting = true;
    let idiom = await fetchIdiom(name);
    this.waiting = false;

    return { ...idiom.vocabulary, ...idiom.News };
  },

  updateMainLanguage(language) {
    try{
      changeMainLanguage(language);
      main_language = language;
      i18n.fallbackLocale = language;
    }
    catch (error) {
      console.error('There was a problem changing the main language: ', error);
      main_language = 'en'; 
      i18n.fallbackLocale = 'en';
    }
  }
}



export default i18n;
export { i18nFunctions }; 
