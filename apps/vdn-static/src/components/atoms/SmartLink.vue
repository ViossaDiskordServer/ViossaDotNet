<script setup lang="ts">
import type { CssClass } from "@/utils/css";
import { computed, ref } from "vue";
import type { SmartLinkProps } from "./SmartLink";

const props = defineProps<SmartLinkProps>();

type To = { type: "a"; a: string } | { type: "routerLink"; routerLink: string };

const to = ((): To => {
	const { to, newTab } = props;
	switch (to.type) {
		case "external": {
			return { type: "a", a: to.external };
		}
		case "internal": {
			const { route, id } = to.internal;
			const endpoint = `${route ?? ""}${id === undefined ? "" : `#${id}`}`;

			if (newTab || id !== undefined) {
				return { type: "a", a: endpoint };
			}

			// <RouterLink> can only be used for route-only endpoints
			// that require no other special functionality of <a>
			return { type: "routerLink", routerLink: endpoint };
		}
	}
})();

const isHovered = ref(false);

const classes = computed<CssClass>(() => [
	props.covert && !isHovered.value && "has-text-text",
]);
</script>

<template>
	<!-- eslint-disable-next-line vue/no-restricted-html-elements - we need to at least use <a> once to create this wrapper type -->
	<a
		v-if="to.type === 'a'"
		:href="to.a"
		:target="newTab ? '_blank' : undefined"
		rel="noopener noreferrer nofollow"
		@mouseenter="isHovered = true"
		@mouseleave="isHovered = false"
		:class="classes">
		<slot />
	</a>
	<!-- eslint-disable-next-line vue/no-restricted-html-elements - we need to at least use <RouterLink> once to create this wrapper type -->
	<RouterLink v-else :to="to.routerLink" :class="classes">
		<span @mouseenter="isHovered = true" @mouseleave="isHovered = false">
			<slot />
		</span>
	</RouterLink>
</template>
