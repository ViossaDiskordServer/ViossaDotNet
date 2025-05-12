<template>
  <div class="min-h-screen flex flex-col" style="gap: 4rem;"><!-- Main application wrapper -->
    <!-- <SideBar /> -->

    <h1 class="title has-text-black p-6">BRÅTULA VIOSSA.NET MÅDE</h1>

    <PaddingWrapper v-for="(sectionName, index) in sectionList" :key="index">
      <component :is="sectionName" />
    </PaddingWrapper>
  </div>
</template>

<script lang="ts">
// import SideBar from './components/organisms/SideBar.vue'
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
