<script setup lang="ts">
import type { RouterLinkProps } from "vue-router";
import type { RouteNamedMap } from "vue-router/auto-routes";

defineProps<
	Omit<RouterLinkProps, "to">
		& (
			| { internal: true; to: keyof RouteNamedMap }
			| { external: true; to: `https://${string}` | `http://${string}` }
		)
>();
</script>

<template>
	<RouterLink v-bind="$props">
		<slot />
	</RouterLink>
</template>
