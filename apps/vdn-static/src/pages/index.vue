<script setup lang="ts">
import HomeSectionWrapper from "@/components/molecules/HomeSectionWrapper.vue";
import { useLocale } from "@/i18n";
import { GREETINGS, type Greeting } from "@/i18n/greeting";
import { VILANTIC_ID_TO_FLAG } from "@/i18n/vilantic";
import { localizeLayout } from "@/utils/localizeLayout";
import { randomElement } from "@/utils/random";

const locale = useLocale();
const greeting: Greeting = randomElement(GREETINGS);
</script>

<template>
	<div>
		<section class="hero has-background-primary-soft is-primary">
			<div
				class="hero-body"
				style="padding-top: 3.75rem; padding-bottom: 3rem">
				<div class="title has-text-text-bold">{{ greeting.title }}</div>
				<div class="subtitle has-text-text-bold mb-4">
					{{ greeting.subtitle }}
				</div>
				<div
					class="subtitle is-size-6 is-flex is-flex-direction-row is-align-items-center is-gap-1 has-text-text-bold">
					&mdash; {{ greeting.author }} ({{
						locale.vilanticLangs[greeting.lang]
					}})
					<figure class="image is-32x32">
						<img :src="VILANTIC_ID_TO_FLAG[greeting.lang]" />
					</figure>
				</div>
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
