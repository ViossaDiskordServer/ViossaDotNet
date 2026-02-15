<script setup lang="ts">
import DiscordRuleOverview from "@/components/molecules/DiscordRuleOverview.vue";
import DiscordRuleSection from "@/components/molecules/DiscordRuleSection.vue";
import { useI18n } from "@/i18n";
import { computed } from "vue";

const i18n = useI18n();

const pageI18n = computed(() => i18n.v("discord.rulesPage"));
const rules = computed(() => pageI18n.value.rules);

const RULE_ORDER = [
	"noTranslation",
	"lfsv",
	"viossaOnlyChats",
	"sfw",
	"respectOthers",
	"respectStaff",
	"controversialTopics",
] as const satisfies (keyof typeof pageI18n.value.rules)[];

function unwrapProxy<T extends object>(
	value: T,
	maxDepth: number,
	depth: number = 0,
): T {
	if (depth > maxDepth) {
		return value;
	}

	const entries = Object.entries(value);
	const unwrappedEntries = entries.map(
		([key, value]) =>
			[
				key,
				value !== null && typeof value === "object" ?
					unwrapProxy(value, maxDepth, depth + 1)
				:	value,
			] as const,
	);

	return Object.fromEntries(unwrappedEntries) as T;
}

console.log(unwrapProxy(rules.value, 5));
</script>

<template>
	<div>
		<section class="section">
			<h1 class="title">
				{{ pageI18n.title }}
			</h1>
		</section>
		<section class="section content">
			<h2>{{ pageI18n.overview.title }}</h2>
			<blockquote>
				{{ pageI18n.overview.help }}
			</blockquote>
			<ol :style="{ display: 'flex', flexDirection: 'column' }">
				<DiscordRuleOverview
					v-for="(id, index) in RULE_ORDER"
					:key="index"
					:rule-number="index + 1"
					:overview="rules[id].overview" />
			</ol>
		</section>
		<DiscordRuleSection
			v-for="(id, index) in RULE_ORDER"
			:key="index"
			:section="rules[id].section"
			:rule-number="index + 1" />
	</div>
</template>
