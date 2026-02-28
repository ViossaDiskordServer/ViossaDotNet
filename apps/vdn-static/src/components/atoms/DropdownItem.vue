<script setup lang="ts">
import type { AnchorHTMLAttributes } from "vue";

defineProps<{
	onClick: AnchorHTMLAttributes["onClick"];
}>() satisfies AnchorHTMLAttributes;
</script>

<template>
	<!-- eslint-disable-next-line vue/no-restricted-html-elements - we're wrapping it into a useable type -->
	<a v-bind="$props">
		<slot />
	</a>
</template>
