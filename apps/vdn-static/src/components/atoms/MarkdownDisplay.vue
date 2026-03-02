<script setup lang="ts" generic="Slot extends string">
import {
	getCurrentInstance,
	onMounted,
	type DeepReadonly,
	type VNode,
} from "vue";
import MarkdownParts from "./MarkdownParts.vue";
import OptionalParent from "./OptionalParent.vue";
import type { Markdown } from "@/new-i18n-lib/markdown";
import type { CssClass } from "@/utils/css";

const props = defineProps<{
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments -- I don't know why this error is here
	markdown: DeepReadonly<Markdown<Slot>>;
	lineClass?: CssClass;
	tag?: string;
}>();

const providedSlots =
	defineSlots<{ [K in DeepReadonly<Slot>]: () => VNode[] }>();

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
onMounted(() => {
	const requiredSlots = props.markdown.slots;
	const missingSlots = requiredSlots.filter(
		(slot) => providedSlots[slot] === undefined,
	);

	if (missingSlots.length > 0) {
		const componentStack = getComponentStack();
		throw new Error(
			`Markdown component is missing slots!\n\tMissing Slots: ${missingSlots.join(", ")}${componentStack}`,
		);
	}
});
</script>

<template>
	<OptionalParent :is="tag">
		<template v-for="(line, index) in markdown.elements" :key="index">
			<p v-if="line.type === 'paragraph'" :class="lineClass">
				<MarkdownParts
					:elements="line.paragraph.spans"
					:slots="markdown.slots">
					<template
						v-for="(slot, name) in providedSlots"
						:key="name"
						#[name]>
						<component :is="slot" />
					</template>
				</MarkdownParts>
			</p>
			<h3 v-else-if="line.type === 'header'" :class="lineClass">
				<MarkdownParts
					:elements="line.header.spans"
					:slots="markdown.slots">
					<template
						v-for="(slot, name) in providedSlots"
						:key="name"
						#[name]>
						<component :is="slot" />
					</template>
				</MarkdownParts>
			</h3>
			<ul v-else-if="line.type === 'ulist'" :class="lineClass">
				<li v-for="item in line.ulist.items">
					<MarkdownParts :elements="item" :slots="markdown.slots">
						<template
							v-for="(slot, name) in providedSlots"
							:key="name"
							#[name]>
							<component :is="slot" />
						</template>
					</MarkdownParts>
				</li>
			</ul>
		</template>
	</OptionalParent>
</template>
