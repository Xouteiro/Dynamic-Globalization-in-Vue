<!--
We can render content conditionally or in a loop with the v-if and v-for directives.
-->

<script setup>
import { ref } from 'vue'

const show = ref(true)
const list = ref([1, 2, 3])
let isReversed = ref(false)

function pop (list) {
  if(!isReversed){
    list.shift()
  }else{
    list.pop()
  }
}

function reverse(list){
  list.reverse()
  isReversed = !isReversed
}
  
function push(list){
  if(!isReversed) list.unshift(list.length + 1)
  else list.push(list.length + 1)
             
}
</script>

<template>
  <button @click="show = !show">Toggle List</button>
  <button @click="push(list)">Push Number</button>
  <button @click="pop(list)">Pop Number</button>
  <button @click="reverse(list) ">Reverse List</button>

  <ul v-if="show && list.length">
    <li v-for="item of list">{{ item }}</li>
  </ul>
  <p v-else-if="list.length">List is not empty, but hidden.</p>
  <p v-else>List is empty.</p>
</template>