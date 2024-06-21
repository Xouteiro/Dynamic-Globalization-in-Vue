import { createI18n } from "vue-i18n";

let fetchError = false;

async function fetchPreferedLanguage() {
  try {
    const storedPreferedLanguage = localStorage.getItem('prefered_language');
    if (storedPreferedLanguage) {
      return storedPreferedLanguage; 
    }

    const response = await fetch('http://localhost:5037/mainLanguage');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const mainLanguage = data.main_language;

    localStorage.setItem('prefered_language', mainLanguage);

    return mainLanguage;
  }
  catch (error) {
    console.error('There was a problem with the fetch operation: ', error);
    return 'en'; 
  }
}

let prefered_language = await fetchPreferedLanguage();

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


// let main_language = await fetchMainLanguage();



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

const idiom = await fetchIdiom(prefered_language);

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
  locale: prefered_language,   // set initial locale
  fallbackLocale: prefered_language, // set fallback locale
  legacy: false, // false for Composition API
  messages: loadLocaleMessages(),  //preenche $i18.availableLocales com as linguagens disponíveis
});



var i18nFunctions = {
  idioms: null,
  idiom_names: null,
  main_language: null,
  waiting: false,

  async fetchAllIdioms() {
    try {
      this.waiting = true;
      this.main_language = await fetchMainLanguage();
      this.waiting = false;

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
      this.main_language = language;
      i18n.fallbackLocale = language;
    }
    catch (error) {
      console.error('There was a problem changing the main language: ', error);
      this.main_language = 'en'; 
      i18n.fallbackLocale = 'en';
    }
  }
}



export default i18n;
export { i18nFunctions }; 
