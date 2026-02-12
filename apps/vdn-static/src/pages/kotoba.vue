<script setup lang="ts">
import { useLocale } from "@/i18n";

const locale = useLocale();
</script>

<template>
	<div>
		<section class="section">
			<h1 class="title">{{ locale.kotoba.title }}</h1>
		</section>

		<section class="section container">
			<div class="notification is-info block">
				<p>{{ locale.kotoba.searchHelp }}</p>
			</div>

			<div class="block is-flex is-flex-direction-row is-gap-2">
				<input class="input" type="text" />
			</div>

			<div class="container"></div>
		</section>
	</div>
</template>
