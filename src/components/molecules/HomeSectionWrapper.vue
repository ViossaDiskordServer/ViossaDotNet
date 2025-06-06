<template>
  <div class="box my-5 px-4 py-3 columns is-vcentered">

      <template v-if="reverse">
        <div class="column">
          <h2 class="title is-4">{{ title }}</h2>
          <p class="has-text-white">{{ text }}</p>
        </div>
        <div class="column is-one-quarter" v-if="image">
          <figure class="image">
            <img :src="image" :alt="alt" :title="alt" />
          </figure>
        </div>
      </template>

      <template v-else>
        <div class="column is-one-quarter" v-if="image">
          <figure class="image">
            <img :src="image" :alt="alt" :title="alt" />
          </figure>
        </div>
        <div class="column">
          <h2 class="title is-4">{{ title }}</h2>
          <p class="has-text-white">{{ text }}</p>
        </div>
      </template>

  </div>
</template>

<script setup lang="ts">
defineProps({
  title: String,
  text: String,
  image: { type: String, required: false },
  alt: { type: String, required: false },
  reverse: Boolean,
})
</script>