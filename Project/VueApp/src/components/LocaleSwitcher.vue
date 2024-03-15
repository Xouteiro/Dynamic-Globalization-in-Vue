
<script setup>
import { useI18n } from 'vue-i18n'
import { watchEffect } from 'vue'

const { locale } = useI18n() // Get the current locale

const emit = defineEmits(['update:locale'])

watchEffect(() => {
  emit('update:locale', locale.value) // Emit the current locale
})

</script>

<template>
  <div class="locale-switcher">
    <div class="locale-changer">
      
      <select v-model="$i18n.locale">
        <option   
          v-for="locale in $i18n.availableLocales"
          :key="`locale-${locale}`"
          :value="locale"
        >
          {{ locale }}
        </option>
      </select>
    </div>
  </div>
</template>


<style scoped>

select {
  font-size: 16px;
  width: fit-content;
  background-color: #41b883;
  border: 0;
  border-radius: 10%;
  padding: 0.5rem 1rem;

}

option {
  background-color: pink;
}


</style>