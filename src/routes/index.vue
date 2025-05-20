<template>
	<div class="min-h-screen flex flex-col" style="gap: 4rem">
		<!-- Main application wrapper -->
    <section class="section">
      <h1 class="title has-text-black p-6">BRÅTULA VIOSSA.NET MÅDE</h1>
    </section>

    <section class="section">
      <HomeSectionWrapper 
        v-for="(section, index) in sectionList" 
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
import 'bulma/css/bulma.css'
import { useI18n } from 'vue-i18n'
import type { MessageSchema } from '../i18n/types'
import { computed } from 'vue'

const { tm } = useI18n()
const sectionList = computed<MessageSchema['sections']>(() => tm('sections'))

console.log(sectionList.value)
</script>
