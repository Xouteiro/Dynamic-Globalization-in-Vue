<script setup>

import { idioms } from '@/i18n.js';
import { onMounted, onUpdated } from 'vue';
import utils from '@/utils.ts';
import i18n from '@/i18n.js';
import { useI18n } from "vue-i18n";
import { watch } from 'vue';



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


onMounted(() => {
  if (window.location.pathname === '/table') {
    return;
  }
  utils.populateEditableElements(locale.value, currentMessages);
});

onUpdated(() => {
  if (window.location.pathname === '/table') {
    return;
  }
  currentMessages = i18n.global.getLocaleMessage(locale.value);
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

  const idiomsDiv = document.querySelector('.current-idioms');
  const manageDiv = document.createElement('div');
  manageDiv.classList.add('manage');
  const h3 = document.createElement('h3');
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

    const idiomsDiv = document.querySelector('.current-idioms');
    const manageDiv = document.createElement('div');
    manageDiv.classList.add('manage');
    const h3 = document.createElement('h3');
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

function exportJson(idiom) {
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

  <h1>Manage all idioms</h1>

  <h2>Add a new Idiom</h2>

  <h4>Fill in the form below to add a new idiom</h4>

  <form>
    <div class = "name">
      <label for="name">Name</label>
      <input type="text" id="name" v-model="name" placeholder="2 letter code" >
    </div>
    <div class="vocabulary">
      <div class = "full-pair">
        <div class="pair">
          <label >Pair</label>
          <input type="text" class="key" placeholder="Key" >
          <input type="text" class="value" placeholder="Value" >
        </div>
      </div>
    </div>
    <button @click.prevent="addPair">Add Pair</button>
    <button tye="submit" @click.prevent="addIdiom">Add Idiom</button>
  </form>
  <div class="idioms-tip">
  <p :class="locale">{{ $t("If you are not sure about what words to add submit the idiom and fill the words in the")}}
    <RouterLink to="/table" class="Table" :class="locale">{{ $t("Table") }}</RouterLink>
  </p>
</div>

  <h4> Or import a Json File</h4>

  <form>
    <label for="file">Choose a file</label>
    <div class= "buttons">
    <input type="file" id="file" name="file" accept=".json" >
      <input type="reset" id="remove">
      <button class="import" @click.prevent="importJson">Import</button>
    </div>
  </form>





  <h2>Current Idioms</h2>
  <div class="current-idioms">
    <div v-for="(idiom, index) in idioms" :key="index">
      <div class="manage">
        <h3>{{ idiom.name + utils.getFlag(idiom.name) }}</h3>
        <button v-if="idiom.name != 'en'" @click.prevent="deleteIdiom(idiom, $event)">Delete Idiom</button>
        <button @click.prevent="exportJson(idiom)">Export Json</button>
      </div>
    </div>
  </div>




</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}

h1{
  text-align: center;
  font-size: 50px;
  margin-bottom: 40px;
}



h2 {
  text-align: center;
  font-size: 35px;
  margin-bottom: 30px;
}

h3{
  text-align: center;
  font-size: 20px;
  margin-bottom: 20px;
  margin-right: 10px;

}

h4{
  text-align: center;
  font-size: 23px;
  margin-top: 35px;
  margin-bottom:25px;

}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 50px;
}

.idioms-tip {
  display: flex;
  text-align: center;
  font-size: 14px;

}

.idioms-tip p {
  width: 100%;
}

label{
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 10px;
  margin-right: 15px;
}


input[type="file"]{
  font-size: 16px;
  padding: 10px;
  border-radius: 10px;
  margin-right: 5px;
  border: 1px solid #41b883;
}

button, input[type="reset"]{
  font-size: 16px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #41b883;
  margin-bottom: 10px;
}

input[type="text"]{
  width: 50%;
  font-size: 16px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #41b883;
  margin-bottom: 10px;
  text-align: center;
  }

.buttons{
  display: flex;
  flex-direction: row;
}

.manage {
  display: flex;
  width: 100%;
  justify-content: center;
}

.pair{
  width: 55em;
  display: flex;
  flex-direction: row;
  justify-content: center;
  text-align: center;
  align-content: center;
  align-items: center;
}

.vocabulary{
  display: flex;
  flex-direction: column;
  align-items: center;
}

.full-pair{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.name{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-right: 40px;
}

</style>
