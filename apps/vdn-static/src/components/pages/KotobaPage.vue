<script setup lang="ts">
	import { useLocale } from "@/i18n";

	const locale = useLocale();
</script>

<template>
	<div>
		<section class="section">
			<h1 class="title">{{locale.kotoba.title}}</h1>
		</section>

		<section class="section container">
			<input type="text" name="text" id="aaa">
		</section>
	</div>
</template>

<!--  -->

<script setup lang="ts">

</script>
