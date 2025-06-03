<template>
  <div class="min-h-screen flex flex-col"><!-- Main application wrapper -->
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <RouterLink class="navbar-item has-text-weight-bold" to="/">Viossa.net</RouterLink>
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <RouterLink class="navbar-item" to="/">What is Viossa?</RouterLink>
          <RouterLink class="navbar-item" to="/resources">Resources</RouterLink>
        </div>
      </div>
    </nav>
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import './assets/style.scss'
</script>
