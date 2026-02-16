<script setup lang="ts" generic="SlotName extends string">
import { type DeepReadonly, type VNode } from "vue";
import { type CompiledRichTemplatePart } from "@/i18n";
import SmartLink from "../atoms/SmartLink.vue";

defineProps<{
	content: DeepReadonly<CompiledRichTemplatePart[]>;
	slots: DeepReadonly<SlotName[]>;
}>();

const vueSlots = defineSlots<{ [K in SlotName]: () => VNode[] }>();
</script>

<template>
	<template v-for="(part, index) in content" :key="index">
		<template v-if="typeof part === 'string'">
			{{ part }}
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
				<RichTemplateParts :content="part.bold" :slots="slots">
					<template
						v-for="(slot, name) in vueSlots"
						:key="name"
						#[name]>
						<component :is="slot" />
					</template>
				</RichTemplateParts>
			</b>
		</template>
		<template v-else-if="part.type === 'italic'">
			<i>
				<!-- eslint-disable-next-line vue/no-restricted-html-elements - it can use itself -->
				<RichTemplateParts :content="part.italic" :slots="slots">
					<template
						v-for="(slot, name) in vueSlots"
						:key="name"
						#[name]>
						<component :is="slot" />
					</template>
				</RichTemplateParts>
			</i>
		</template>
		<template v-else-if="part.type === 'link'">
			<SmartLink v-bind="part.link.props">
				<!-- eslint-disable-next-line vue/no-restricted-html-elements - it can use itself -->
				<RichTemplateParts :content="part.link.children" :slots="slots">
					<template
						v-for="(slot, name) in vueSlots"
						:key="name"
						#[name]>
						<component :is="slot" />
					</template>
				</RichTemplateParts>
			</SmartLink>
		</template>
	</template>
</template>
