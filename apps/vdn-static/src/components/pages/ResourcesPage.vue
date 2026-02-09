<script setup lang="ts">
import LearningResourceWrapper from "@/components/molecules/LearningResourceWrapper.vue";
import { useLocale } from "@/i18n";
import { localizeLayout } from "@/utils/localizeLayout";

const locale = useLocale();
</script>

<template>
	<div>
		<section class="section">
			<h1 class="title">{{ locale.resources.title }}</h1>
		</section>

		<section class="section container">
			<LearningResourceWrapper
				v-for="(resource, index) in localizeLayout(
					locale.resources.layout,
				)"
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
