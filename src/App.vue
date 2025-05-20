<template>
  <div class="min-h-screen flex flex-col" style="gap: 4rem;"><!-- Main application wrapper -->
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/resources">Resources</RouterLink>
    </nav>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
// import HomeSectionWrapper from './components/molecules/HomeSectionWrapper.vue'
import './assets/style.scss'
import 'bulma/css/bulma.css'
// import { useI18n } from 'vue-i18n'
// import type { MessageSchema } from './i18n/types'

// const { t, tm } = useI18n()

// console.log(sectionList.value)
</script>
