<template>
  <div class="box m-3 p-3 columns">
    <div class="column is-one-quarter" v-if="image">
      <figure class="image">
        <img :src="image" :alt="alt" />
      </figure>
    </div>
    <div class="column">
      <h2 class="title">{{ title }}</h2>
      <p class="has-text-white is-size-4 mb-4">{{ desc }}</p>
      <h3 class="is-size-3">
        <a :href="link" target="_blank" rel="noopener noreferrer nofollow">{{ link }}</a>
      </h3>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  desc: String,
  link: String,
  image: { type: String, required: false },
  alt: { type: String, required: false },
})
</script>