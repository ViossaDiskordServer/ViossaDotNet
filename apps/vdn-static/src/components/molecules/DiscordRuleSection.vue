<script setup lang="ts">
import type { Locale } from "@/i18n";
import type { Value } from "@/utils/types";
import type { DeepReadonly } from "vue";
import MarkdownDisplay from "../atoms/MarkdownDisplay.vue";

defineProps<{
	section: DeepReadonly<
		Value<Locale["discord"]["rulesPage"]["rules"]>["section"]
	>;
	ruleNumber: number;
}>();
</script>

<template>
	<section class="section content" :id="`rule-${ruleNumber}`">
		<h2>{{ section.header({ ruleNumber }) }}</h2>
		<MarkdownDisplay :markdown="section.body()" />
	</section>
</template>
