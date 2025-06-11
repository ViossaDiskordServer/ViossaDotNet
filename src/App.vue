<template>
  <div class="min-h-screen flex flex-col "><!-- Main application wrapper -->
    <Header />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import './assets/style.scss'
import Header from './components/organisms/Header.vue'
</script>
