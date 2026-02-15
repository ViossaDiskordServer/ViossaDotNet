<script setup lang="ts" generic="SlotName extends string">
import { type VNode } from "vue";
import {
	type CompiledRichTemplatePart,
	type RichTemplateMessagePath,
} from "@/i18n";
import SmartLink from "../atoms/SmartLink.vue";

defineProps<{
	keypath: RichTemplateMessagePath<SlotName>;
	content: CompiledRichTemplatePart[];
	templateUuidToTemplate: Record<string, string>;
	slots: SlotName[];
}>();

const vueSlots = defineSlots<{ [K in SlotName]: () => VNode[] }>();
</script>

<template>
	<template v-for="(part, index) in content" :key="index">
		<template v-if="typeof part === 'string'">
			{{ part }}
		</template>
		<template v-else-if="part.type === 'templateUuid'">
			<!-- eslint-disable-next-line vue/no-restricted-html-elements - this is the safe wrapper -->
			<i18n-t
				:keypath="`${keypath}.templateUuidToTemplate.${part.templateUuid}`">
				<template v-for="(slot, name) in vueSlots" :key="name" #[name]>
					<component :is="slot" />
				</template>
			</i18n-t>
		</template>
		<template v-else-if="part.type === 'bold'">
			<b>
				<!-- eslint-disable-next-line vue/no-restricted-html-elements - it can use itself -->
				<RichTemplateParts
					:keypath="keypath"
					:content="part.bold"
					:template-uuid-to-template="templateUuidToTemplate"
					:slots="slots">
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
				<RichTemplateParts
					:keypath="keypath"
					:content="part.italic"
					:template-uuid-to-template="templateUuidToTemplate"
					:slots="slots">
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
				<RichTemplateParts
					:keypath="keypath"
					:content="part.link.children"
					:template-uuid-to-template="templateUuidToTemplate"
					:slots="slots">
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
