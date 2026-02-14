<script setup lang="ts">
import SmartLink, { type SmartLinkProps } from "../organisms/SmartLink.vue";
import type { CssClass } from "@/utils/css";

export interface ResourceButton {
	label: string;
	link: SmartLinkProps;
	style: ResourceButtonStyle;
}

export interface ResourceButtonStyle {
	color: "primary" | "warning";
	outlined?: boolean;
}

function buttonStyleToClasses(style: ResourceButtonStyle): CssClass[] {
	const colorClass = (() => {
		switch (style.color) {
			case "primary": {
				return "is-primary";
			}
			case "warning": {
				return "is-warning";
			}
		}
	})();

	return [colorClass, style.outlined && "is-outlined"];
}

defineProps<{
	title: string;
	subtitle: string;
	desc: string;
	image?: { src: string; alt: string };
	buttons: ResourceButton[];
}>();
</script>

<template>
	<div class="box columns is-vcentered is-gap-4">
		<div class="column is-one-quarter" v-if="image">
			<figure class="image">
				<img :src="image.src" :alt="image.alt" :title="image.alt" />
			</figure>
		</div>
		<div class="column">
			<h4 class="title">{{ title }}</h4>
			<p class="subtitle">{{ subtitle }}</p>
			<p class="content">{{ desc }}</p>

			<div class="level">
				<SmartLink
					v-for="(button, index) in buttons"
					:key="index"
					v-bind="button.link"
					:class="[
						'button',
						'is-medium',
						buttonStyleToClasses(button.style),
					]"
					>{{ button.label }}</SmartLink
				>
			</div>
		</div>
	</div>
</template>
