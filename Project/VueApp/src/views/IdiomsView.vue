<script setup>

import { onMounted } from 'vue';
import { i18nFunctions } from '@/i18n.js';
import utils from '@/utils.ts';
import i18n from '@/i18n.js';
import { useI18n } from "vue-i18n";
import { watch, ref } from 'vue';
import { computed } from 'vue';

if (i18nFunctions.idioms == null) {
  i18nFunctions.idioms = await i18nFunctions.fetchAllIdioms();
  for (let i = 0; i < i18nFunctions.idioms.length; i++) {
    i18n.global.setLocaleMessage(i18nFunctions.idioms[i].name, { ...i18nFunctions.idioms[i].vocabulary, ...i18nFunctions.idioms[i].News });
  }
}

let idioms = i18nFunctions.idioms;

let name = ref('');

let { locale } = useI18n();
let currentMessages = i18n.global.getLocaleMessage(locale.value);



watch(locale, (newLocale) => {
  for (let i = 0; i < idioms.length; i++) {
    if (idioms[i].name === newLocale) {
      currentMessages = i18n.global.getLocaleMessage(newLocale);
      Object.assign(currentMessages, idioms[i].vocabulary);
    }
  }
});

let main_language = ref(i18nFunctions.main_language);


watch(main_language, (newMainLanguage) => {
  i18nFunctions.main_language = newMainLanguage;
  i18nFunctions.updateMainLanguage(newMainLanguage);
});


let idioms_not_main = computed(() => {
  let result = [];
  for (let i = 0; i < idioms.length; i++) {
    if (idioms[i].name != main_language.value) {
      result.push(idioms[i]);
    }
  }
  return result;
});








onMounted(() => {
  utils.populateEditableElements(locale.value, currentMessages);
});





function addPair() {
  const vocabulary = document.querySelector('.vocabulary');
  const full_pair = document.createElement('div');
  full_pair.classList.add('full-pair');
  const pair = document.createElement('div');
  pair.classList.add('pair');
  const label = document.createElement('label');
  label.textContent = 'Pair';
  const key = document.createElement('input');
  key.classList.add('key');
  key.type = 'text';
  key.placeholder = 'Key';
  key.required = true;
  pair.appendChild(label);
  pair.appendChild(key);

  const value = document.createElement('input');
  value.classList.add('value');
  value.type = 'text';
  value.placeholder = 'Value';
  value.required = true;
  pair.appendChild(value);


  full_pair.append(pair);

  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove Pair';
  removeButton.addEventListener('click', (event) => {
    event.preventDefault();
    vocabulary.removeChild(full_pair);
  });

  full_pair.appendChild(removeButton);

  vocabulary.appendChild(full_pair);


}


function addIdiom() {
  const newIdiom = {};
  const name = document.querySelector('#name').value;
  const vocabulary = {};
  const pairs = document.querySelectorAll('.pair');

  if (idioms.some((idiom) => idiom.name === name)) {
    alert('Idiom already exists');
    return;
  }

  if (name.length !== 2) {
    alert('Idiom name must be 2 characters long');
    return;
  }

  if (pairs[0].querySelector('.key').value === '' || pairs[0].querySelector('.value').value === '') {
    alert('Please fill in all fields');
    return;
  }


  pairs.forEach((pair) => {
    const key = pair.querySelector('.key').value;
    const value = pair.querySelector('.value').value;
    vocabulary[key] = value;
  });


  newIdiom.name = name;
  newIdiom.vocabulary = vocabulary;

  newIdiom.News = {};

  let url = 'http://localhost:5037/Idioms/'

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newIdiom),
  })
    .then((response) => response)
    .then((data) => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });






  pairs.forEach((pair) => {
    pair.querySelector('.key').value = '';
    pair.querySelector('.value').value = '';
  });
  document.querySelector('#name').value = '';

  idioms.push(newIdiom);

  const idiomsDiv = document.querySelector('.full-form.idioms');
  const manageDiv = document.createElement('div');
  manageDiv.classList.add('manage');
  const h3 = document.createElement('label');
  h3.textContent = newIdiom.name + ' ' + utils.getFlag(newIdiom.name);
  manageDiv.appendChild(h3);
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete Idiom';
  deleteButton.addEventListener('click', (event) => {
    event.preventDefault();
    deleteIdiom(newIdiom, event);
  });

  const exportButton = document.createElement('button');
  exportButton.classList.add('export');
  exportButton.textContent = 'Export Json';
  exportButton.addEventListener('click', (event) => {
    event.preventDefault();
    exportJson(newIdiom);
  });
  manageDiv.appendChild(deleteButton);
  manageDiv.appendChild(exportButton);

  idiomsDiv.appendChild(manageDiv);

  i18nFunctions.idiom_names.push(newIdiom.name);


}


function deleteIdiom(idiom, event) {

  let url = 'http://localhost:5037/Idioms/' + idiom.name;
  fetch(url, {
    method: 'DELETE',
  })
    .then((response) => response)
    .then((data) => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  idioms.splice(idioms.indexOf(idiom), 1);

  event.target.parentElement.remove();

  i18n.global.setLocaleMessage(idiom.name, {});

  i18nFunctions.idiom_names = i18nFunctions.idiom_names.filter((idiom) => idiom !== idiom.name);

}


function importJson() {
  const file = document.querySelector('#file').files[0];
  const reader = new FileReader();
  if (!file) {
    alert('Please select a file');
    return;
  }
  reader.onload = function (e) {
    const json = JSON.parse(e.target.result);
    const newIdiom = {};
    newIdiom.name = json.name;
    newIdiom.vocabulary = json.vocabulary || {};
    newIdiom.News = json.News || {};

    if (idioms.some((idiom) => idiom.name === newIdiom.name)) {
      alert('Idiom already exists');
      return;
    }


    let url = 'http://localhost:5037/Idioms/'

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newIdiom),
    })
      .then((response) => response)
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    idioms.push(newIdiom);

    const idiomsDiv = document.querySelector('.full-form.idioms');
    const manageDiv = document.createElement('div');
    manageDiv.classList.add('manage');
    const h3 = document.createElement('label');
    h3.textContent = newIdiom.name + utils.getFlag(newIdiom.name);
    manageDiv.appendChild(h3);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Idiom';
    deleteButton.addEventListener('click', (event) => {
      event.preventDefault();
      deleteIdiom(newIdiom, event);
    });

    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export Json';
    exportButton.addEventListener('click', (event) => {
      event.preventDefault();
      exportJson(newIdiom);
    });
    manageDiv.appendChild(deleteButton);
    manageDiv.appendChild(exportButton);

    idiomsDiv.appendChild(manageDiv);

  };
  reader.readAsText(file);
}

function exportJson(idiom, is_main_language = false) {
  let main_idiom = idioms.find((idiom) => idiom.name === main_language.value);
  if(is_main_language){
    idiom = main_idiom;
  }
  const json = JSON.stringify(idiom);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = idiom.name + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

</script>

<template>

  <h1>Manage idioms</h1>
  <h2>Add a new Idiom</h2>
  <div class="full-form">


    <h4>Fill in the form below to add a new idiom</h4>

    <form>
      <div class="name">
        <label for="name">Name</label>
        <input type="text" id="name" v-model="name" placeholder="2 letter code">
      </div>
      <div class="vocabulary">
        <div class="full-pair">
          <div class="pair">
            <label> Pair</label>
            <input type="text" class="key" placeholder="Key">
            <input type="text" class="value" placeholder="Value">
          </div>
        </div>
      </div>
      <button @click.prevent="addPair">Add Pair</button>
      <button class="right-corner" type="submit" @click.prevent="addIdiom">Add Idiom</button>
    </form>
    <div class="idioms-tip">
      <p class="idioms-tip" :class="locale">{{ $t("idioms-tip") }}
        <RouterLink to="/table" class="Table" :class="locale">{{ $t("Table") }}</RouterLink>
        .
      </p>
    </div>
  </div>
  <h2> Import a Json File </h2>

  <div class="full-form input">
    <h4> Choose a file</h4>
    <form>
      <div class="buttons">
        <input type="file" id="file" name="file" accept=".json">
        <div class="buttons-file">
          <input type="reset" id="remove">
          <button class="import" @click.prevent="importJson">Import</button>
        </div>
      </div>
    </form>
  </div>





  <h2>Delete/Export Idioms</h2>
  <div class="full-form idioms">
    <h4>Delete or export an idiom</h4>
    <div class="main_language">
      <label>Main Idiom </label>
      <select v-model="main_language">
        <option v-for="locale in i18nFunctions.idiom_names" :key="`locale-${locale}`" :value="locale">
          {{ utils.getFlag(locale) + ' ' + locale }}
        </option>
      </select>
    </div>

    <div>
      <label class="main">{{ main_language + ' ' + utils.getFlag(main_language) }}</label>
      <button class="export" @click.prevent="exportJson(idiom, true)">Export Json</button>
      <div v-for="(idiom, index) in idioms_not_main" :key="index">
        <div class="manage">
          <label>{{ idiom.name + ' ' + utils.getFlag(idiom.name) }}</label>
          <button v-if="idiom.name != main_language" @click.prevent="deleteIdiom(idiom, $event)">Delete
            Idiom</button>
          <button class="export" @click.prevent="exportJson(idiom)">Export Json</button>
        </div>
      </div>
    </div>
  </div>




</template>

<style scoped>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}

h1 {
  text-align: center;
  font-size: 50px;
  margin-bottom: 40px;
}



body h2 {
  text-align: center;
  font-size: 35px;
  margin-bottom: 30px;
  padding-left: 0;
}

h3 {
  text-align: center;
  font-size: 20px;
  margin-bottom: 20px;
  margin-right: 10px;

}

h4 {
  text-align: center;
  font-size: 23px;
  margin-top: 35px;
  margin-bottom: 25px;

}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.idioms-tip {
  display: flex;
  text-align: center;
  font-size: 14px;
}

.idioms-tip p {
  width: 100%;
}

a.Table {
  color: #148617;
}



input[type="file"] {
  font-size: 16px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #41b883;
  color: #000;
}

button,
input[type="reset"] {
  font-size: 16px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #41b883;
}

input[type="text"] {
  width: 50%;
  font-size: 16px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #41b883;
  margin-bottom: 10px;
  text-align: center;
}


</style>

<style>

.buttons-file {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 12px;
}



button.right-corner {
  position: absolute;
  right: 100px;
  bottom: 30px;
}



.vocabulary {
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
}

.name {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 40px;
}



.full-form.input {
  width: 30%;
  height: 200px;
}

.pair {
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
  align-content: center;
  align-items: center;
}

.full-pair {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.full-pair input[type="text"] {
  width: 50%;
  font-size: 16px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #41b883;
  margin-bottom: 10px;
  text-align: center;
}

.full-pair button {
  font-size: 16px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #41b883;
  margin-bottom: 10px;
}

.full-form label {
  color: #000;
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 10px;
  margin-right: 15px;
}

.full-form.idioms label {
  margin-bottom: 0;
  margin-top: 6px;
  margin-right: 10px;
}

input.key {
  margin-right: 3px;
}



.full-form.idioms {
  width: 30%;
  padding-bottom: 20px;
}

.full-form {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 35px;
  border: 3px solid #41b883;
  background-color: #a1bba2;
}

.full-form h2,
.full-form h4,
.full-form h3 {
  margin-top: 20px;
  margin-bottom: 20px;
  color: #000;
}


.full-form label {
  color: #000;
}

.full-form p {
  color: #000;
  margin-bottom: 5px;
}

button.import,
button.export {
  margin-left: 3px;
}

.buttons {
  display: flex;
  flex-direction: column;
}


.manage {
  display: flex;
  width: 100%;
  justify-content: center;
  margin-bottom: 10px;
  margin-top: 10px;
}

.main_language {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.main_language select {
  font-size: 16px;
  padding: 8px;
  border-radius: 10px;
  border: 1px solid #41b883;
  margin-left: 10px;
}

/* label.main{
} ajustar no centro a main language export json*/


.full-form button {
  font-size: 16px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #41b883;
}
</style>
