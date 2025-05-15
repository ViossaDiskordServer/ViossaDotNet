<script setup lang="ts">
import Header from "./components/organisms/Header.vue";
</script>

<style lang="scss" module>
.root {
	width: 100%;
	min-height: 100%;
	overflow: auto;
	scrollbar-gutter: auto;
}
</style>

<template>
	<div :class="$style.root">
		<Header />
		<section class="container">
			<RouterView />
		</section>
	</div>
</template>
