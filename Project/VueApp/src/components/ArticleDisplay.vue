<script setup>
import { useI18n } from "vue-i18n";



let { locale } = useI18n()

let props = defineProps({
  newsContent: Object
})


const newsContent = props.newsContent
const identifier = newsContent.Identifier
const title =  identifier + ".Title"
const subtitle = identifier + ".Subtitle"
const body =  identifier + ".Body"


</script>

<template>
  <div class=news >

    <div class="title">
      <h1 :class="[title,locale]">{{ $t(title)}}</h1>
    </div>
    <div class="subtitle">
      <p :class="[subtitle,locale]" >{{ $t(subtitle) }}</p>
    </div>
    <div class="body">
      <p :class="[body,locale]" >{{ $t(body) }}</p>
    </div>

    
  </div>
</template>


<style scoped>

.news {
  display: flex;
  flex-direction: column;
  align-self: center;
  margin-left: 110px;
  margin-right: auto;
  width: 80%;
  margin-top: 30px;
}


.news-title {
  display: flex;
  margin-bottom: 20px;
}

.news-subtitle {
  display: flex;
  margin-bottom: 20px;
}

.news-body {
  display: flex;
  margin-bottom: 20px;
}

</style>
