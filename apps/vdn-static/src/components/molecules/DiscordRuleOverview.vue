<script setup lang="ts">
import SmartLink from "../atoms/SmartLink.vue";
import type { Value } from "@/utils/types";
import MarkdownDisplay from "../atoms/MarkdownDisplay.vue";
import type { Locale } from "@/i18n";
import type { DeepReadonly } from "vue";
import { isEmptyMarkdown } from "@/vi18n-lib/markdown";

const props = defineProps<{
	overview: DeepReadonly<
		Value<Locale["discord"]["rulesPage"]["rules"]>["overview"]
	>;
	ruleNumber: number;
}>();

const subtext = props.overview.subtext();
</script>

<template>
	<span>
		<SmartLink
			covert
			:to="{ type: 'internal', internal: { id: `rule-${ruleNumber}` } }"
			:style="{ width: 'fit-content', display: 'inline-block' }">
			<li :style="{ width: 'fit-content' }">
				<MarkdownDisplay
					:markdown="overview.text()"
					line-class="mb-0" />
				<ul v-if="!isEmptyMarkdown(subtext)" class="mt-0 w-fit">
					<MarkdownDisplay
						tag="li"
						:style="{ width: 'fit-content' }"
						:markdown="subtext" />
				</ul>
			</li>
		</SmartLink>
	</span>
</template>
