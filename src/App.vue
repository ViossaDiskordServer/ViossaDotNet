<template>
  <div class="min-h-screen flex flex-col" style="gap: 4rem;"><!-- Main application wrapper -->
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/resources">Resources</RouterLink>
    </nav>

    <RouterView />

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

<script lang="ts">
import PaddingWrapper from './components/molecules/PaddingWrapper.vue'
import IntroSection from './components/organisms/IntroSection.vue'
import HistorySection from './components/organisms/HistorySection.vue'
import './assets/style.scss'
import 'bulma/css/bulma.css'

export default {
  name: 'app',
  components: {
    PaddingWrapper,
    IntroSection,
    HistorySection
  },
  data() {
    return {
      sectionList: ['IntroSection', 'HistorySection']
    }
  }
}
</script>
