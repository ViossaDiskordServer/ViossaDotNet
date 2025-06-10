<script setup lang="ts">
import LearningResourceWrapper from "@/components/molecules/LearningResourceWrapper.vue";
import "@/assets/style.scss";
import { useI18n } from "vue-i18n";
import type { MessageSchema } from "@/i18n/types";
import { computed } from "vue";

const { tm } = useI18n();
const resourceList = computed<MessageSchema["resources"]>(() =>
	tm("resources"),
);
const resourcesWithImages = computed(() =>
	resourceList.value.map((resource) => {
		if (!resource.image) return resource;

		return {
			...resource,
			image: new URL(`../../assets/${resource.image}`, import.meta.url)
				.href,
		};
	}),
);
</script>

<template>
	<div>
		<section class="section">
			<h1 class="title">Learning Resources</h1>
		</section>

		<section class="section container">
			<LearningResourceWrapper
				v-for="(resource, index) in resourcesWithImages"
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
