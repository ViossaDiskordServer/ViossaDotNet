<template>
	<div class="min-h-screen flex flex-col" style="gap: 4rem">
		<!-- Main application wrapper -->
    <section class="section">
      <h1 class="title has-text-black p-6">Learning Resources</h1>
    </section>

    <section class="section">
      <LearningResourceWrapper class="is-one-quarter" 
        v-for="(resource, index) in resourcesWithImages" 
        :key="index"
        :title="resource.title"
        :desc="resource.desc"
				:link="resource.link"
        :image="resource.image"
        :alt="resource.alt"
      />
    </section>
	</div>
</template>

<script setup lang="ts">
import LearningResourceWrapper from '@/components/molecules/LearningResourceWrapper.vue'
import '@/assets/style.scss'
import 'bulma/css/bulma.css'
import { useI18n } from 'vue-i18n'
import type { MessageSchema } from '@/i18n/types'
import { computed } from 'vue'

const { tm } = useI18n()
const resourceList = computed<MessageSchema['resources']>(() => tm('resources'))
const resourcesWithImages = computed(() =>
  resourceList.value.map(resource => {
    if (!resource.image) return resource

    return {
      ...resource,
      image: new URL(`../../assets/${resource.image}`, import.meta.url).href
    }
  })
)
</script>
