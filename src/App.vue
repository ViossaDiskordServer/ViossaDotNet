<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
// import SideBar from './components/organisms/SideBar.vue'
import './assets/style.scss'
import 'bulma/css/bulma.css'
</script>

<template>
  <!-- <SideBar /> -->
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue = bråtula!" />
</template>

<style scoped>
.logo {
  height: 10em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #000000aa);
}
</style>
