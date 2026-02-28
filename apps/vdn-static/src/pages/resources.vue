<script setup lang="ts">
import LearningResourceWrapper, {
	type ResourceButton,
} from "@/components/molecules/LearningResourceWrapper.vue";
import { useLocale, type Locale } from "@/new-i18n";
import type * as i18n from "@/new-i18n/config";
import { computed } from "vue";
import { useRoute } from "vue-router";
import discordImg from "@/assets/discord.png";
import flakkaImg from "@/assets/flakka.png";
import vimiveraImg from "@/assets/vimivera2025.webp";
import korohtella from "@/assets/korohtella.png";
import piikImg from "@/assets/piik.webp";

type ResourceId = keyof Locale["resources"]["resources"];
type Category = "learning" | "cultural";

interface ResourceConfig {
	id: ResourceId;
	category: Category;
	image?: keyof typeof imagesI18n.value;
	buttons: (id: ResourceId) => ResourceButton[];
}

const locale = useLocale();
const route = useRoute();

const pageI18n = computed(() => locale.value.resources);

interface ImageI18n {
	src: string;
	metadata: i18n.Image;
}

const imagesI18n = computed(() => {
	const imgs = pageI18n.value.images;
	return {
		discordLogo: { src: discordImg,    metadata: imgs.discordLogo },
		viossaFlag:  { src: flakkaImg,     metadata: imgs.viossaFlag },
		vimivera2025:{ src: vimiveraImg,   metadata: imgs.vimivera2025 },
		korohtella:  { src: korohtella,    metadata: imgs.korohtella },
		piik:        { src: piikImg,       metadata: imgs.piik },
	} as const satisfies Record<string, ImageI18n>;
});

const RESOURCE_CONFIGS: ResourceConfig[] = [
	{
		id: "discord",
		category: "learning",
		image: "discordLogo",
		buttons: () => {
			const buttons = pageI18n.value.resources.discord.buttons;
			return [
				{
					link: { to: { type: "external", external: "https://discord.gg/g3mG2gYjZD" }, newTab: true },
					label: buttons.join.label(),
					style: { color: "primary" },
				},
				{
					link: { to: { type: "internal", internal: { route: "/discord/rules" } } },
					label: buttons.rules.label(),
					style: { color: "warning", outlined: true },
				},
			];
		},
	},
	{
		id: "vikoli",
		category: "learning",
		image: "viossaFlag",
		buttons: () => {
			const buttons = pageI18n.value.resources.vikoli.buttons;
			return [
				{
					link: { to: { type: "external", external: "https://vikoli.org/Huomilehti" }, newTab: true },
					label: buttons.visit.label(),
					style: { color: "primary" },
				},
			];
		},
	},
	{
		id: "daviSpil",
		category: "cultural",
		image: "discordLogo",
		buttons: () => {
			const buttons = pageI18n.value.resources.daviSpil.buttons;
			return [
				{
					link: { to: { type: "external", external: "https://discord.gg/6QgRhw5DRJ" }, newTab: true },
					label: buttons.join.label(),
					style: { color: "primary" },
				},
			];
		},
	},
	{
		id: "vimivera2025",
		category: "cultural",
		image: "vimivera2025",
		buttons: () => {
			const buttons = pageI18n.value.resources.vimivera2025.buttons;
			return [
				{
					link: { to: { type: "internal", internal: { route: "/Vimivera_2025_Paemara_Sentakuena.pdf" } } },
					label: buttons.read.label(),
					style: { color: "primary" },
				},
			];
		},
	},
	{
		id: "korohtella",
		category: "cultural",
		image: "korohtella",
		buttons: () => {
			const buttons = pageI18n.value.resources.korohtella.buttons;
			return [
				{
					link: { to: { type: "external", external: "https://open.spotify.com/album/0skzWl5HU7ulKPm7qGssAX?si=jYzB26xSRE6m3C0LYYNWNw" }, newTab: true },
					label: buttons.spotify.label(),
					style: { color: "success" },
				},
				{
					link: { to: { type: "external", external: "https://www.youtube.com/watch?v=KsmTrqJFtjo&list=OLAK5uy_n2GcJf52fbN7nYB3PDCO-oWXEFV4Jdcrk" }, newTab: true },
					label: buttons.youtube.label(),
					style: { color: "danger" },
				},
			];
		},
	},
	{
		id: "piik",
		category: "cultural",
		image: "piik",
		buttons: () => {
			const buttons = pageI18n.value.resources.piik.buttons;
			return [
				{
					link: { to: { type: "external", external: "https://thunderstore.io/c/peak/p/vimik/ViPIIK/" }, newTab: true },
					label: buttons.thunderstore.label(),
					style: { color: "primary" },
				},
			];
		},
	},
];

const category = computed<Category | null>(() => {
	const q = route.query.category;
	if (q === "learning" || q === "cultural") return q;
	return null;
});

const pageTitle = computed(() => {
	switch (category.value) {
		case "learning": return locale.value.navbar.resourcesLearning();
		case "cultural": return locale.value.navbar.resourcesCultural();
		default:         return locale.value.resources.title();
	}
});

const filteredResources = computed(() =>
	RESOURCE_CONFIGS.filter(
		(r) => category.value === null || r.category === category.value,
	),
);
</script>

<template>
	<div>
		<section class="section">
			<h1 class="title">{{ pageTitle }}</h1>
		</section>

		<section class="section container">
			<LearningResourceWrapper
				v-for="resource in filteredResources"
				:key="resource.id"
				:title="pageI18n.resources[resource.id].title()"
				:subtitle="pageI18n.resources[resource.id].subtitle()"
				:desc="pageI18n.resources[resource.id].desc()"
				:image="
					resource.image && {
						src: imagesI18n[resource.image].src,
						alt: imagesI18n[resource.image].metadata.alt(),
					}
				"
				:buttons="resource.buttons(resource.id)" />
		</section>
	</div>
</template>