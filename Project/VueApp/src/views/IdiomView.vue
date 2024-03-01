<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n() // Get the current locale
</script>

<template>
    

    <div class="text">
        
        <div class="nav__end">
        <p class="numbers" :class="locale">{{ $t("numbers") }}</p>
        </div>

    </div>
</template>
<style>
</style>
