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
  <div class="news">
    <div class="news-container">
      <div class="news-content">
        <div class="title">
          <h1 :class="[title, locale]">{{ $t(title) }}</h1>
        </div>
        <div class="subtitle">
          <p :class="[subtitle, locale]">{{ $t(subtitle) }}</p>
        </div>
        <div class="body">
          <p :class="[body, locale]">{{ $t(body) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>


.news-container {
  background: #d7eed8; 
  border-radius: 8px; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
  
  transition: box-shadow 0.3s ease, transform 0.3s ease; 
  position: relative; 
  width: 85%;
  margin: 0 auto 2rem; 
}
.news-container:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); 
  transform: scale(1.01); 
}

.news-content {
  padding: 2rem; 
}

.title h1 {
  font-size: 2.3rem; 
  font-weight: 700;
  margin-bottom: 1rem; 
  color: #333333; 
}

.subtitle p {
  font-size: 1.4rem;
  color: #666666; 
  margin-bottom: 1rem; 
}

.body p {
  font-size: 1.2rem; 
  color: #444444;
  line-height: 1.6; 
}


</style>
