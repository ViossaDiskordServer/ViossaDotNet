<script setup lang="ts">
import HomeSectionWrapper from "@/components/molecules/HomeSectionWrapper.vue";
import { useLocale } from "@/i18n";
import { GREETINGS, type Greeting } from "@/i18n/greeting";
import { localizeLayout } from "@/utils/localizeLayout";
import { randomElement } from "@/utils/random";

const locale = useLocale();
const greeting: Greeting = randomElement(GREETINGS);
</script>

<template>
	<div>
		<section class="hero is-primary">
			<div class="hero-body">
				<div class="title">{{ greeting.title }}</div>
				<div class="subtitle">{{ greeting.subtitle }}</div>
			</div>
		</section>

		<section class="section container">
			<HomeSectionWrapper
				v-for="(section, index) in localizeLayout(locale.home.layout)"
				:key="index"
				:title="section.title"
				:text="section.text"
				:image="section.image ?? undefined"
				:alt="section.alt ?? undefined"
				:reverse="index % 2 !== 0" />
		</section>
	</div>
</template>
