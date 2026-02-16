<script setup lang="ts" generic="SlotName extends string">
import {
	getCurrentInstance,
	onMounted,
	type DeepReadonly,
	type VNode,
} from "vue";
import { type CompiledRichTemplate } from "@/i18n";
import RichTemplateParts from "./RichTemplateParts.vue";
import OptionalParent from "./OptionalParent.vue";

const props = defineProps<{
	template: DeepReadonly<CompiledRichTemplate<SlotName>>;
	tag?: string;
}>();
const providedSlots =
	defineSlots<{ [K in DeepReadonly<SlotName>]: () => VNode[] }>();
console.log(Object.entries(props.template));

function tryResolveComponentName(type: unknown): string | undefined {
	if (!type || typeof type !== "object") return undefined;
	const maybeType = type as { name?: string; __file?: string };
	if (maybeType.name) return maybeType.name;
	if (maybeType.__file) {
		const parts = maybeType.__file.split(/[\\/]/);
		const filename = parts.at(-1);
		if (filename === undefined) {
			return undefined;
		}

		const filenameParts = filename.split(".");
		filenameParts.pop();
		return filenameParts.join(".");
	}

	return undefined;
}

function resolveComponentName(type: unknown): string {
	return tryResolveComponentName(type) ?? "(unresolvable)";
}

const getComponentStack = () => {
	const instance = getCurrentInstance();
	if (!instance) return "";
	const names: string[] = [resolveComponentName(instance.type)];
	let current = instance.parent;
	while (current) {
		names.push(resolveComponentName(current.type));
		current = current.parent;
	}
	return names.length > 0 ? `\n\tComponent Stack: ${names.join(" > ")}` : "";
};

// Validate required slots at runtime
// FIXME: currently this won't flag required slots that aren't actually used by the template - this should be handled by seperately registering all required slots as a tuple somewhere else eventually
onMounted(() => {
	const requiredSlots = props.template.slots;
	const missingSlots = requiredSlots.filter(
		(slot) => providedSlots[slot] === undefined,
	);

	if (missingSlots.length > 0) {
		const componentStack = getComponentStack();
		throw new Error(
			`Template is missing slots!\n\tTemplate: ${props.template.keypath}\n\tMissing Slots: ${missingSlots.join(", ")}${componentStack}`,
		);
	}
});
</script>

<template>
	<OptionalParent :is="tag">
		<!-- eslint-disable-next-line vue/no-restricted-html-elements - this is an internal component for this component -->
		<RichTemplateParts :content="template.parts" :slots="template.slots">
			<template v-for="(slot, name) in providedSlots" :key="name" #[name]>
				<component :is="slot" />
			</template>
		</RichTemplateParts>
	</OptionalParent>
</template>
