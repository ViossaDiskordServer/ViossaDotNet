<script setup lang="ts">
import HomeSectionWrapper from "@/components/molecules/HomeSectionWrapper.vue";
import { useLocale } from "@/i18n";
import { GREETINGS, type Greeting } from "@/i18n/greeting";
import type * as i18n from "@/i18n/locale";
import { VILANTIC_ID_TO_FLAG } from "@/i18n/vilantic";
import { randomElement } from "@/utils/random";
import { computed } from "vue";
import flakkaImg from "@/assets/flakka.png";

interface SectionConfig {
	id: keyof i18n.Locale["home"]["sections"];
	image?: keyof typeof imagesI18n.value;
}

const SECTION_CONFIGS = [
	{ id: "whatIsViossa", image: "viossaFlag" },
	{ id: "historyOfViossa", image: "viossaFlag" },
	{ id: "community" },
] as const satisfies SectionConfig[];

const locale = useLocale();
const homeI18n = computed(() => locale.value.home);

interface ImageI18n {
	src: string;
	metadata: i18n.Image;
}

const imagesI18n = computed(() => {
	const imagesI18n = homeI18n.value.images;

	return {
		viossaFlag: { src: flakkaImg, metadata: imagesI18n.viossaFlag },
	} as const satisfies Record<string, ImageI18n>;
});

const greeting: Greeting = randomElement(GREETINGS);

const sectionsI18n = computed(() =>
	SECTION_CONFIGS.map(({ id, image }: SectionConfig) => ({
		text: homeI18n.value.sections[id],
		image: image && imagesI18n.value[image],
	})),
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
				v-for="(sectioni18n, index) in sectionsI18n"
				:key="index"
				:title="sectioni18n.text.title"
				:text="sectioni18n.text.body"
				:image="sectioni18n.image?.src"
				:alt="sectioni18n.image?.metadata.alt"
				:reverse="index % 2 !== 0" />
		</section>
	</div>
</template>
