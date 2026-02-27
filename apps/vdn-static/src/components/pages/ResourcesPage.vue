<script setup lang="ts">
import LearningResourceWrapper, { type ResourceButton } from "@/components/molecules/LearningResourceWrapper.vue";
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

function makeButtons(resource: ReturnType<typeof filteredResources.value[0]>): ResourceButton[] {
        const buttons: ResourceButton[] = [];

        if (resource.link && resource.joinText) {
                buttons.push({
                        label: resource.joinText,
                        link: { type: "external", external: { href: resource.link, tab: "new" } },
                        style: { color: (resource.linkColor as ResourceButton["style"]["color"]) || "primary" },
                });
        }

        if (resource.link2 && resource.link2Text) {
                buttons.push({
                        label: resource.link2Text,
                        link: { type: "external", external: { href: resource.link2, tab: "new" } },
                        style: { color: (resource.link2Color as ResourceButton["style"]["color"]) || "primary" },
                });
        }

        if (resource.rulesLink && resource.rulesText) {
                buttons.push({
                        label: resource.rulesText,
                        link: { type: "external", external: { href: resource.rulesLink, tab: "new" } },
                        style: { color: "warning", outlined: true },
                });
        }

        return buttons;
}
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
                                class="mb-6"
                                :title="resource.title"
                                :subtitle="resource.subtitle"
                                :desc="resource.desc"
                                :image="resource.image ? { src: resource.image, alt: resource.alt } : undefined"
                                :buttons="makeButtons(resource)" />
                </section>
        </div>
</template>