<script setup lang="ts">
import { computed } from "vue";
import type { RichText, RichTextPart } from "../../i18n/rich"; // relative import for vue sfc compiler

const props = defineProps<{ content: RichText | RichTextPart[] }>();

const parts = computed<RichTextPart[]>(() => {
	const content = props.content;
	if (Array.isArray(content)) {
		return content;
	}

	return content.parts;
});

console.log(parts.value);
</script>

<template>
	<template v-for="(part, index) in parts" :key="index">
		<template v-if="typeof part === 'string'">
			{{ part }}
		</template>
		<template v-else-if="part.type === 'bold'">
			<b><RichText :content="part.bold" /></b>
		</template>
		<template v-else-if="part.type === 'italic'">
			<i><RichText :content="part.italic" /></i>
		</template>
	</template>
</template>
