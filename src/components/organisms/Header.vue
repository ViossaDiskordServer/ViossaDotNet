<script setup lang="ts">
import { ref } from "vue";

let navActive = ref(false);

const toggleNav = () => {
	console.log("hello");
	navActive.value = !navActive.value;
};
</script>

<template>
	<div class="navbar">
		<div class="navbar-brand p-2">
			<h1
				class="title m-0 is-align-self-center"
				:style="{ transform: 'translate(0, -0.125rem)' }"
			>
				Viossa.net
			</h1>
			<a
				class="navbar-burger"
				role="button"
				aria-label="menu"
				aria-expanded="false"
				@click="toggleNav"
			>
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
				<span aria-hidden="true"></span>
			</a>
		</div>
		<div :class="{ 'navbar-menu': true, 'is-active': navActive }">
			<div class="navbar-start">
				<div class="navbar-item">
					<RouterLink to="/">Home</RouterLink>
				</div>
				<div class="navbar-item">
					<RouterLink to="/resources">Resources</RouterLink>
				</div>
			</div>
		</div>
	</div>
</template>
