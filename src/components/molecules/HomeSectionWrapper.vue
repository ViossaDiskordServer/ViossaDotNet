<template>
  <div class="box my-6 px-4 py-5">

    <div v-if="image" class="columns is-vcentered">

      <template v-if="reverse">
        <div class="column">
          <h2 class="title is-4">{{ title }}</h2>
          <p class="has-text-white">{{ text }}</p>
        </div>
        <div class="column is-one-quarter">
          <figure class="image">
            <img :src="image" :alt="alt" />
          </figure>
        </div>
      </template>

      <template v-else>
        <div class="column is-one-quarter">
          <figure class="image">
            <img :src="image" :alt="alt" />
          </figure>
        </div>
        <div class="column">
          <h2 class="title is-4">{{ title }}</h2>
          <p class="has-text-white">{{ text }}</p>
        </div>
      </template>

    </div>

    <div v-else class="is-vcentered">
      <h2 class="title is-4">{{ title }}</h2>
      <p class="has-text-white">{{ text }}</p>
    </div>

  </div>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  text: String,
  image: String,
  alt: String,
  reverse: Boolean,
})
</script>