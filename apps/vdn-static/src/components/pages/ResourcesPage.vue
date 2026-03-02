<script setup lang="ts">
import LearningResourceWrapper from "@/components/molecules/LearningResourceWrapper.vue";
import { useLocale } from "@/i18n";
import { localizeLayout } from "@/utils/localizeLayout";
import { useRoute } from "vue-router";
import { computed } from "vue";

const locale = useLocale();
const route = useRoute();

const pageTitle = computed(() => {
        const category = route.query.category;
        if (category === "learning") return locale.value.navbar.resourcesLearning;
        if (category === "cultural") return locale.value.navbar.resourcesCultural;
        return locale.value.resources.title;
});

const filteredResources = computed(() => {
        const all = localizeLayout(locale.value.resources.layout);
        const category = route.query.category;
        if (!category) return all;
        return all.filter(r => r.category === category);
});
</script>

<template>
        <div>
                <section class="section">
                        <h1 class="title">{{ pageTitle }}</h1>
                </section>
                <section class="section container">
                        <LearningResourceWrapper
                                v-for="(resource, index) in filteredResources"
                                :key="index"
                                :title="resource.title"
                                :subtitle="resource.subtitle"
                                :desc="resource.desc"
                                :link="resource.link"
                                :rulesLink="resource.rulesLink"
                                :image="resource.image"
                                :alt="resource.alt"
                                :joinText="resource.joinText"
                                :rulesText="resource.rulesText" />
                </section>
        </div>
</template>