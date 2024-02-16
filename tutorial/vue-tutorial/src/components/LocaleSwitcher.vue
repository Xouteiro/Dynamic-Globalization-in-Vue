
<script setup>
import { useI18n } from 'vue-i18n'
import { watchEffect, ref } from 'vue'

const { locale } = useI18n() // Get the current locale

const emit = defineEmits(['update:locale'])

watchEffect(() => {
  emit('update:locale', locale.value) // Emit the current locale
})

</script>

<template>
  <div class="locale-switcher">
    <div class="locale-changer">
      <select v-model="$i18n.locale" style="padding: 5px 15px;font-size: 16px;">
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