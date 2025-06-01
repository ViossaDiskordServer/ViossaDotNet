<template>
  <div class="box m-3 p-3 columns is-vcentered">
    <div class="column is-one-quarter" v-if="image">
      <figure class="image is-128x128">
        <img :src="image" :alt="alt" />
      </figure>
    </div>
    <div class="column">
      <h4 class="title">{{ title }}</h4>
      <p class="has-text-white is-size-5 mb-3">{{ desc }}</p>
      <a
        :href="link"
        target="_blank"
        rel="noopener noreferrer nofollow"
        class="button is-link is-medium has-text-white"
      >
        {{ link }}
      </a>
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