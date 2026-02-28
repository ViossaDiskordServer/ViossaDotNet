<script setup lang="ts">
import DiscordRuleOverview from "@/components/molecules/DiscordRuleOverview.vue";
import DiscordRuleSection from "@/components/molecules/DiscordRuleSection.vue";
import { useLocale } from "@/new-i18n";
import { computed } from "vue";

const locale = useLocale();

const pageI18n = computed(() => locale.value.discord.rulesPage);
const rulesI18n = computed(() => pageI18n.value.rules);

const RULE_ORDER = [
	"noTranslation",
	"lfsv",
	"viossaOnlyChats",
	"sfw",
	"respectOthers",
	"respectStaff",
	"controversialTopics",
] as const satisfies (keyof typeof rulesI18n.value)[];
</script>

<template>
	<div>
		<section class="section">
			<h1 class="title">
				{{ pageI18n.title() }}
			</h1>
		</section>
		<section class="section content">
			<h2>{{ pageI18n.overview.title() }}</h2>
			<blockquote>
				{{ pageI18n.overview.help() }}
			</blockquote>
			<ol :style="{ display: 'flex', flexDirection: 'column' }">
				<DiscordRuleOverview
					v-for="(id, index) in RULE_ORDER"
					:key="index"
					:rule-number="index + 1"
					:overview="rulesI18n[id].overview" />
			</ol>
		</section>
		<DiscordRuleSection
			v-for="(id, index) in RULE_ORDER"
			:key="index"
			:section="rulesI18n[id].section"
			:rule-number="index + 1" />
	</div>
</template>
