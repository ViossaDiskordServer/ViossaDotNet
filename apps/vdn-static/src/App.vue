<script setup lang="ts">
import "./assets/style.scss";
import { ref, type Ref } from "vue";
import { SAMPLE } from "@repo/common/sample";

const burgerOpen: Ref<boolean> = ref<boolean>(false);

const toggleBurger = (): void => {
	burgerOpen.value = !burgerOpen.value;
};
</script>

<template>
	<div class="min-h-screen flex flex-col">
		<!-- Main application wrapper -->
		<nav
			class="navbar is-fixed-top"
			role="navigation"
			aria-label="main navigation">
			<div class="navbar-brand">
				<RouterLink class="navbar-item has-text-weight-bold" to="/"
					><img src="@/assets/ViossaFlagRect.svg" alt=""
				/></RouterLink>

				<div class="navbar-item">
					<button
						type="button"
						@click="toggleBurger()"
						:class="`button is-link is-hoverable is-hidden-desktop ${burgerOpen ? 'is-active' : ''}`"
						aria-label="menu"
						:aria-expanded="`${burgerOpen ? 'true' : 'false'}`">
						<span class="bx bx-burger"></span>
					</button>
				</div>
			</div>

			<div :class="`navbar-menu ${burgerOpen ? 'is-active' : ''}`">
				<div class="navbar-start">
					<RouterLink class="navbar-item" to="/"
						>What is Viossa?</RouterLink
					>
					<RouterLink class="navbar-item" to="/resources"
						>Resources</RouterLink
					>
					<RouterLink class="navbar-item" to="/kotoba">
						Kotoba
					</RouterLink>
				</div>
			</div>
		</nav>
		<RouterView />
	</div>
</template>
