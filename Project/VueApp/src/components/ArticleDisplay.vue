<script setup>

let props = defineProps({
  newsContent: Object
})


const newsContent = props.newsContent
const identifier = newsContent.Identifier
const title = "News." + identifier + ".Title"
const subtitle = "News." + identifier + ".Subtitle"
const body = "News." + identifier + ".Body"

function debug() {
  //console.log(newsContentKeys)
}

</script>

<template>
  <div class=tile >
    <h1>{{ $t(title)}}</h1>
    <p>{{ $t(subtitle) }}</p>
    <p>{{ $t(body) }}</p>
    <!-- <button @click="debug">Debug</button> -->
  </div>
</template>


<style scoped>

</style>
