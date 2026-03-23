<script setup lang="ts">
import LearningResourceWrapper, {
	type ResourceButton,
} from "@/components/molecules/LearningResourceWrapper.vue";
import { useLocale, type Locale } from "@/i18n";
import type * as i18n from "@/i18n/config";
import { ignore } from "@/utils/ignore";
import { computed } from "vue";
import discordImg from "@/assets/discord.png";

interface ResourceConfig {
	id: keyof Locale["resources"]["resources"];
	image?: keyof typeof imagesI18n.value;
}

const RESOURCE_CONFIGS = [
	{ id: "discord", image: "discordLogo" },
] as const satisfies ResourceConfig[];

const locale = useLocale();

const pageI18n = computed(() => locale.value.resources);

interface ImageI18n {
	src: string;
	metadata: i18n.Image;
}

const imagesI18n = computed(() => {
	const imagesI18n = pageI18n.value.images;

	return {
		discordLogo: { src: discordImg, metadata: imagesI18n.discordLogo },
	} as const satisfies Record<string, ImageI18n>;
});

const resourcesI18n = computed(() =>
	RESOURCE_CONFIGS.map(
		({ id, image }: ResourceConfig) =>
			({
				id,
				text: pageI18n.value.resources[id],
				image: image && imagesI18n.value[image],
			}) as const,
	),
);

const computeButtons = (
	id: keyof Locale["resources"]["resources"],
): ResourceButton[] => {
	// will warn us if a new variant is added that isn't handled, and so we should add a switch
	// once we have a switch statement, this won't be needed as that will check for exhaustiveness
	ignore<"discord">(id);

	const buttons = pageI18n.value.resources[id].buttons;
	return [
		{
			link: {
				to: {
					type: "external",
					external: "https://discord.viossa.net",
				},
				newTab: true,
			},
			label: buttons.join.label(),
			style: { color: "primary" },
		},
		{
			link: {
				to: { type: "internal", internal: { route: "/discord/rules" } },
			},
			label: buttons.rules.label(),
			style: { color: "warning", outlined: true },
		},
	];
};
</script>

<template>
	<div>
		<section class="section">
			<h1 class="title">{{ locale.resources.title() }}</h1>
		</section>

		<section class="section container">
			<LearningResourceWrapper
				v-for="(resourceI18n, index) in resourcesI18n"
				:key="index"
				:title="resourceI18n.text.title()"
				:subtitle="resourceI18n.text.subtitle()"
				:desc="resourceI18n.text.desc()"
				:image="
					resourceI18n.image && {
						src: resourceI18n.image.src,
						alt: resourceI18n.image.metadata.alt(),
					}
				"
				:buttons="computeButtons(resourceI18n.id)" />
		</section>
	</div>
</template>
