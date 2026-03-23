<script setup lang="ts" generic="Slot extends string">
import { type DeepReadonly, type VNode } from "vue";
import SmartLink from "../atoms/SmartLink.vue";
import type { MarkdownSpan } from "@/vi18n-lib/markdown";

defineProps<{
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
	elements: DeepReadonly<MarkdownSpan<Slot>[]>;
	slots: DeepReadonly<ReadonlySet<Slot>>;
}>();

const vueSlots = defineSlots<{ [K in Slot]: () => VNode[] }>();
</script>

<template>
	<template v-for="(part, index) in elements" :key="index">
		<template v-if="part.type === 'plain'">
			{{ part.plain }}
		</template>
		<template v-else-if="part.type === 'slot'">
			<template v-for="(slot, name) in vueSlots" :key="name">
				<template v-if="name === part.slot">
					<component :is="slot" />
				</template>
			</template>
		</template>
		<template v-else-if="part.type === 'bold'">
			<b>
				<!-- eslint-disable-next-line vue/no-restricted-html-elements - it can use itself -->
				<MarkdownParts :elements="part.bold" :slots="slots">
					<template
						v-for="(slot, name) in vueSlots"
						:key="name"
						#[name]>
						<component :is="slot" />
					</template>
				</MarkdownParts>
			</b>
		</template>
		<template v-else-if="part.type === 'italic'">
			<i>
				<!-- eslint-disable-next-line vue/no-restricted-html-elements - it can use itself -->
				<MarkdownParts :elements="part.italic" :slots="slots">
					<template
						v-for="(slot, name) in vueSlots"
						:key="name"
						#[name]>
						<component :is="slot" />
					</template>
				</MarkdownParts>
			</i>
		</template>
		<template v-else-if="part.type === 'link'">
			<SmartLink :to="part.link.to" :new-tab="part.link.newTab">
				<!-- eslint-disable-next-line vue/no-restricted-html-elements - it can use itself -->
				<MarkdownParts :elements="part.link.label" :slots="slots">
					<template
						v-for="(slot, name) in vueSlots"
						:key="name"
						#[name]>
						<component :is="slot" />
					</template>
				</MarkdownParts>
			</SmartLink>
		</template>
	</template>
</template>
