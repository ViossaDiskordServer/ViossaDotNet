<script setup lang="ts">
const { href } = defineProps<{ href: string }>();
</script>

<template>
	<a :href="href" target="_blank">
		<button class="button is-link">
			<slot />
		</button>
	</a>
</template>
