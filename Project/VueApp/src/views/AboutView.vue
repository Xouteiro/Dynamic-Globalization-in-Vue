<script setup>

import { i18nFunctions } from '@/i18n.js';
import { onMounted } from 'vue';
import utils from '@/utils.ts';
import i18n from '@/i18n.js';
import { useI18n } from "vue-i18n";
import { watch } from 'vue';
import { onUpdated } from 'vue';




let { locale } = useI18n();
let currentMessages = i18n.global.getLocaleMessage(locale.value);
let idioms = i18nFunctions.idioms


watch(locale, (newLocale) => {
  currentMessages = i18n.global.getLocaleMessage(newLocale);
});


onMounted(() => {
  utils.populateEditableElements(locale.value, currentMessages);
});



</script>
<template>
    <div class="elements">
    <h1 class="Text-Elements" :class="locale">{{$t("Text-Elements")}}</h1>
    <div class="element">
    <p>h3 - </p><h3 class="Hello-World" :class="locale">{{ $t("Hello-World") }}</h3>
    </div>

    <div class="element">
      <p>p - </p><p class="Hello-World" :class="locale">{{ $t("Hello-World") }}</p>
    </div>
    <div class="element">
      <p>span - </p><span class="Hello-World" :class="locale">{{ $t("Hello-World") }}</span>
    </div>
    <div class="element">
      <p>a - </p><a href="#" class="Hello-World" :class="locale">{{ $t("Hello-World") }}</a>
    </div>
    <div class="element">
      <p>button - </p><button class="Hello-World" :class="locale">{{ $t("Hello-World") }}</button>
    </div>
    <div class="element">
      <p>label - </p><label class="Hello-World" :class="locale">{{ $t("Hello-World") }}</label>
    </div>
    <div class="element">
      <p class="li">li  </p><li class="Hello-World" :class="locale">{{ $t("Hello-World") }}</li>
    </div>
    <div class="element">
      <p>button - </p><button class="Hello-World" :class="locale" > {{ $t("Hello-World") }}</button>
    </div>
    <div class="element">
      <p>input - </p><input class="Hello-World" :placeholder="$t('Hello-World')" :class="locale" />
    </div>

    <div class="element">
      <p>marquee - </p><marquee class="Hello-World" :class="locale">{{ $t("Hello-World") }}</marquee>
    </div>
    <div class="element">
      <p>textarea - </p><textarea class="Hello-World" :placeholder="$t('Hello-World')" :class="locale"></textarea>
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

h2 {
  display: block;
  text-align: center;
  font-size: 50px;
  margin: 0 auto;
  margin-bottom: 40px;
  width: 100%;
}

.elements {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-size: 20px;
}

.element {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 10px 0;
}

.li{
  margin-right: 30px;
}

.Hello-World{
  margin-left: 5px;
}

p {
  font-size: 20px;
  font-weight: 700;

}

</style>
