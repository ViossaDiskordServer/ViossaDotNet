<script setup lang="ts">
import type { Locale } from "@/i18n/locale";
import SmartLink from "../atoms/SmartLink.vue";
import type { Value } from "@/utils/types";
import RichTemplate from "../atoms/RichTemplate.vue";
import type { CompileLocale } from "@/i18n";

defineProps<{
	overview: Value<
		CompileLocale<Locale>["discord"]["rulesPage"]["rules"]
	>["overview"];
	ruleNumber: number;
}>();
</script>

<template>
	<span>
		<SmartLink
			covert
			:to="{ type: 'internal', internal: { id: `rule-${ruleNumber}` } }"
			:style="{ width: 'fit-content', display: 'inline-block' }">
			<li :style="{ width: 'fit-content' }">
				<RichTemplate :template="overview.text" />
				<ul v-if="overview.subtext !== null" class="mt-0 w-fit">
					<RichTemplate
						tag="li"
						:style="{ width: 'fit-content' }"
						:template="overview.subtext" />
				</ul>
			</li>
		</SmartLink>
	</span>
</template>
