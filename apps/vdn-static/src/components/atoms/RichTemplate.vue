<script setup lang="ts" generic="SlotName extends string">
import { type VNode } from "vue";
import {
	type CompiledRichTemplate,
	type RichTemplateMessagePath,
} from "@/i18n";
import RichTemplateParts from "./RichTemplateParts.vue";
import OptionalParent from "./OptionalParent.vue";

defineProps<{ template: CompiledRichTemplate<SlotName>; tag?: string }>();
const slots = defineSlots<{ [K in SlotName]: () => VNode[] }>();
</script>

<template>
	<OptionalParent :is="tag">
		<!-- eslint-disable-next-line vue/no-restricted-html-elements - this is an internal component for this component -->
		<RichTemplateParts
			:keypath="template.keypath as RichTemplateMessagePath<SlotName>"
			:content="template.parts"
			:template-uuid-to-template="template.templateUuidToTemplate"
			:slots="template.slots">
			<template v-for="(slot, name) in slots" :key="name" #[name]>
				<component :is="slot" />
			</template>
		</RichTemplateParts>
	</OptionalParent>
</template>
