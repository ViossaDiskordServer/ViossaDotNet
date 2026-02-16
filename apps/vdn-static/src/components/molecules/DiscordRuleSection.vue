<script setup lang="ts">
import type { CompileLocale } from "@/i18n";
import type { Locale } from "@/i18n/locale";
import type { Value } from "@/utils/types";
import RichTemplate from "../atoms/RichTemplate.vue";
import type { DeepReadonly } from "vue";

defineProps<{
	section: DeepReadonly<
		Value<CompileLocale<Locale>["discord"]["rulesPage"]["rules"]>["section"]
	>;
	ruleNumber: number;
}>();
</script>

<template>
	<section class="section content" :id="`rule-${ruleNumber}`">
		<h2>{{ section.header({ ruleNumber }) }}</h2>
		<template v-for="(element, index) in section.body" :key="index">
			<p v-if="element.type === 'paragraph'">
				<RichTemplate :template="element.paragraph" />
			</p>
			<h3 v-else-if="element.type === 'header'">
				<RichTemplate :template="element.header" />
			</h3>
			<ul v-else-if="element.type === 'ulist'">
				<li v-for="(li, index) in element.ulist" :key="index">
					<RichTemplate :template="li" />
				</li>
			</ul>
		</template>
	</section>
</template>
