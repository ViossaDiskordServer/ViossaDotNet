<script setup lang="ts">
import LearningResourceWrapper, {
	type ResourceButton,
} from "@/components/molecules/LearningResourceWrapper.vue";
import { useLocale } from "@/i18n";
import type { Locale } from "@/i18n/locale";
import { ignore } from "@/utils/ignore";
import { computed } from "vue";

const locale = useLocale();

const resourceIdToResource = computed(() => locale.value.resources.resources);

const RESOURCE_ORDER = [
	"discord",
] as const satisfies (keyof Locale["resources"]["resources"])[];

const resources = computed(() =>
	RESOURCE_ORDER.map((id) => [id, resourceIdToResource.value[id]] as const),
);

const computeButtons = (
	id: keyof Locale["resources"]["resources"],
): ResourceButton[] => {
	// will warn us if a new variant is added that isn't handled, and so we should add a switch
	// once we have a switch statement, this won't be needed as that will check for exhaustiveness
	ignore<"discord">(id);

	const buttons = resourceIdToResource.value[id].buttons;
	return [
		{
			link: {
				to: {
					type: "external",
					external: "https://discord.viossa.net",
				},
				newTab: true,
			},
			label: buttons.join.label,
			style: { color: "primary" },
		},
		{
			link: {
				to: { type: "internal", internal: { route: "/discord/rules" } },
			},
			label: buttons.rules.label,
			style: { color: "warning", outlined: true },
		},
	];
};
</script>

<template>
	<div>
		<section class="section">
			<h1 class="title">{{ locale.resources.title }}</h1>
		</section>

		<section class="section container">
			<LearningResourceWrapper
				v-for="([resourceId, resource], index) in resources"
				:key="index"
				:title="resource.title"
				:subtitle="resource.subtitle"
				:desc="resource.desc"
				:image="resource.image ?? undefined"
				:buttons="computeButtons(resourceId)" />
		</section>
	</div>
</template>
