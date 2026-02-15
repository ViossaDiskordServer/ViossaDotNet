<script setup lang="ts">
import { useI18n } from "@/i18n";

const i18n = useI18n();
</script>

<template>
	<div>
		<section class="section">
			<h1 class="title">{{ i18n.t("kotoba.title") }}</h1>
		</section>

		<section class="section container">
			<div class="notification is-info block">
				<p>{{ i18n.t("kotoba.searchHelp") }}</p>
			</div>

			<div class="block is-flex is-flex-direction-row is-gap-2">
				<input class="input" type="text" />
			</div>

			<div class="container"></div>
		</section>
	</div>
</template>
