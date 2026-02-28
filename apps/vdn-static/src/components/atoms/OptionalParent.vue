<script setup lang="ts">
defineProps<{ is?: string | object | null | undefined }>();
</script>

<template>
	<component v-if="is !== null && is !== undefined" :is="is">
		<slot />
	</component>
	<template v-else>
		<slot />
	</template>
</template>
