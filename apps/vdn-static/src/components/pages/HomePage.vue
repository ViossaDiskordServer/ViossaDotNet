<script setup lang="ts">
import HomeSectionWrapper from "@/components/molecules/HomeSectionWrapper.vue";
import { useLocale } from "@/i18n";
import { localizeLayout } from "@/utils/localizeLayout";

const locale = useLocale();
</script>

<template>
	<div>
		<section class="hero is-primary">
			<div class="hero-body">
				<div class="title ignore-lang-font">BRÅTULA VIOSSA.NET MÅDE</div>
				<div class="subtitle">
					Hadjiplas per lera para Viossa – glossa fu vi
				</div>
			</div>
		</section>

		<section class="section container">
			<HomeSectionWrapper
				v-for="(section, index) in localizeLayout(locale.home)"
				:key="index"
				:title="section.title"
				:text="section.text"
				:image="section.image ?? undefined"
				:alt="section.alt ?? undefined"
				:reverse="index % 2 !== 0" />
		</section>
	</div>
</template>
