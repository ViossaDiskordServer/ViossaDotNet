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
import './assets/style.scss'
import 'bulma/css/bulma.css'
</script>
