<script setup lang="ts">
import HomeSectionWrapper from "@/components/molecules/HomeSectionWrapper.vue";
import { useI18n } from "@/i18n";
import { GREETINGS, type Greeting } from "@/i18n/greeting";
import type { Locale } from "@/i18n/locale";
import { VILANTIC_ID_TO_FLAG } from "@/i18n/vilantic";
import { randomElement } from "@/utils/random";
import { computed } from "vue";

const i18n = useI18n();

const greeting: Greeting = randomElement(GREETINGS);

const SECTION_ORDER = [
	"whatIsViossa",
	"historyOfViossa",
	"community",
] as const satisfies (keyof Locale["home"]["sections"])[];

const sections = computed(() =>
	SECTION_ORDER.map((id) => i18n.v(`home.sections.${id}`)),
);
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
						i18n.v("vilanticLangs")[greeting.lang]
					}})
					<figure class="image is-32x32">
						<img :src="VILANTIC_ID_TO_FLAG[greeting.lang]" />
					</figure>
				</div>
			</div>
		</section>

		<section class="section container">
			<HomeSectionWrapper
				v-for="(section, index) in sections"
				:key="index"
				:title="section.title"
				:text="section.text"
				:image="section.image?.src"
				:alt="section.image?.alt"
				:reverse="index % 2 !== 0" />
		</section>
	</div>
</template>
