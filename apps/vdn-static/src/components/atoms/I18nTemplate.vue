<script setup lang="ts" generic="Path extends TemplateMessagePath">
import {
	type MessageValue,
	type TemplateMessagePath,
	type CompiledTemplate,
	useI18n,
} from "@/i18n";
import type { VNode } from "vue";
import { useSlots, onMounted } from "vue";

const props = defineProps<{ keypath: Path }>();

const i18n = useI18n();

// Extract slot names from the CompiledTemplate type
type PathSlotName =
	MessageValue<Path> extends CompiledTemplate<infer SlotName> ? SlotName
	:	never;

const slots = defineSlots<{ [K in PathSlotName]: () => VNode[] }>();
const runtimeSlots = useSlots();

// Validate required slots at runtime
onMounted(() => {
	const requiredSlots = i18n.v(props.keypath).slots;
	const missingSlots = requiredSlots.filter(
		(slot) => !runtimeSlots[slot as string],
	);

	if (missingSlots.length > 0) {
		throw new Error(
			`Template is missing slots!\n\tTemplate: ${props.keypath}\n\tMissing Slots: ${missingSlots.join(", ")}`,
		);
	}
});
</script>

<template>
	<!-- eslint-disable-next-line vue/no-restricted-html-elements - this is the safe wrapper -->
	<i18n-t :keypath="`${keypath}.template`" scope="global">
		<template v-for="(slot, name) in slots" :key="name" #[name]>
			<component :is="slot" />
		</template>
	</i18n-t>
</template>
