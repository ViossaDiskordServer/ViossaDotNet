<script setup lang="ts">
defineProps<{
	title: string;
	text: string;
	image?: string;
	alt?: string;
	reverse: boolean;
}>();
</script>

<template>
	<div class="box my-5 px-4 py-3 columns is-vcentered">
		<template v-if="reverse">
			<div class="column">
				<h2 class="title is-4">{{ title }}</h2>
				<p class="has-text-white">{{ text }}</p>
			</div>
			<div class="column is-one-quarter" v-if="image">
				<figure class="image">
					<img :src="image" :alt="alt" :title="alt" />
				</figure>
			</div>
		</template>

		<template v-else>
			<div class="column is-one-quarter" v-if="image">
				<figure class="image">
					<img :src="image" :alt="alt" :title="alt" />
				</figure>
			</div>
			<div class="column">
				<h2 class="title is-4">{{ title }}</h2>
				<p class="has-text-white">{{ text }}</p>
			</div>
		</template>
	</div>
</template>
