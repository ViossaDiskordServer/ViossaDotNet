<template>
  <div class="min-h-screen flex flex-col "><!-- Main application wrapper -->
    <Header />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import './assets/style.scss'
import Header from './components/organisms/Header.vue'
import { ref, type Ref } from 'vue'

const burgerOpen: Ref<Boolean> = ref<Boolean>(false);

function toggleBurger(): void {
  burgerOpen.value = !burgerOpen.value;
}
</script>
