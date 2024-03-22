<script setup>
import { useI18n } from "vue-i18n";
import i18n from '@/i18n.js'
import utils from '../utils.ts';


let { locale } = useI18n()
let currentMessages = i18n.global.getLocaleMessage(locale.value);

let props = defineProps({
  newsContent: Object
})


const newsContent = props.newsContent
const identifier = newsContent.Identifier
const title = "News." + identifier + ".Title"
const subtitle = "News." + identifier + ".Subtitle"
const body = "News." + identifier + ".Body"


</script>

<template>
  <div class=tile >

    <div>
      <h1 :class="[title,locale]">{{ $t(title)}}</h1>
    </div>
    <div>
      <p :class="[subtitle,locale]" >{{ $t(subtitle) }}</p>
    </div>
    <div>
      <p :class="[body,locale]" >{{ $t(body) }}</p>
    </div>
  </div>
</template>


<style scoped>

</style>
