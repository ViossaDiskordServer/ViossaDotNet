<template>
	<div class="min-h-screen flex flex-col">
		<!-- Main application wrapper -->
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="title">BRÅTULA VIOSSA.NET MÅDE</div>
        <div class="subtitle">Hadjiplas per lera para Viossa – glossa fu vi</div>
      </div>
    </section>

    <section class="section">
      <HomeSectionWrapper 
        v-for="(section, index) in sectionsWithImages" 
        :key="index"
        :title="section.title"
        :text="section.text"
        :image="section.image"
        :alt="section.alt"
        :reverse="index % 2 !== 0"
      />
    </section>
	</div>
</template>

<script setup lang="ts">
import HomeSectionWrapper from '@/components/molecules/HomeSectionWrapper.vue'
import '@/assets/style.scss'
import { useI18n } from 'vue-i18n'
import type { MessageSchema } from '@/i18n/types'
import { computed } from 'vue'

const { tm } = useI18n()
const sectionList = computed<MessageSchema['sections']>(() => tm('sections'))
const sectionsWithImages = computed(() =>
  sectionList.value.map(section => {
    if (!section.image) return section

    return {
      ...section,
      image: new URL(`../../assets/${section.image}`, import.meta.url).href
    }
  })
)

console.log(sectionList.value)
</script>
