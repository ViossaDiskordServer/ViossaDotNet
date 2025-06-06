<template>
  <div class="box columns is-vcentered">
    <div class="column is-one-quarter" v-if="image">
      <figure class="image">
        <img :src="image" :alt="alt" :title="alt"/>
      </figure>
    </div>
    <div class="column">
      <h4 class="title">{{ title }}</h4>
      <p class="">{{ desc }}</p>
      <a
        :href="link"
        target="_blank"
        rel="noopener noreferrer nofollow"
        class="button is-link is-medium"
        :text="linkText">
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  desc: String,
  link: String,
  linkText: String,
  image: { type: String, required: false },
  alt: { type: String, required: false },
})
</script>