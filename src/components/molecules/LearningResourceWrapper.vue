<template>
  <div class="box columns is-vcentered is-gap-4">
    <div class="column is-one-quarter" v-if="image">
      <figure class="image">
        <img :src="image" :alt="alt" :title="alt" />
      </figure>
    </div>
    <div class="column">
      <h4 class="title">{{ title }}</h4>
      <p class="subtitle">{{ subtitle }}</p>
      <p class="content">{{ desc }}</p>

      <div class="level">
        <a :href="link" 
          target="_blank" 
          rel="noopener noreferrer nofollow" 
          class="button is-primary is-medium"
          :text="joinText">
        </a>

        <a :href="``" 
          target="_blank" 
          rel="noopener noreferrer nofollow"
          class="button is-info is-outlined is-medium" 
          :text="rulesText">
        </a>

        <a :href="rulesLink" 
          target="_blank" 
          rel="noopener noreferrer nofollow"
          class="button is-warning is-outlined is-medium" 
          :text="rulesText">
        </a>
      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  subtitle: String,
  desc: String,
  link: String,
  rulesLink: String,
  joinText: String,
  rulesText: String,
  image: { type: String, required: false },
  alt: { type: String, required: false },
})
</script>