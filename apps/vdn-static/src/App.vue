<script setup lang="ts">
import "./assets/style.scss";
import { ref, type Ref } from "vue";
import LocalePicker from "./components/organisms/LocalePicker.vue";
import { vOnClickOutside } from "@vueuse/components";
import { useLocale } from "@/i18n";

const locale = useLocale();

const burgerOpen: Ref<boolean> = ref<boolean>(false);

const toggleBurger = (): void => {
	burgerOpen.value = !burgerOpen.value;
};

const closeBurger = (): void => {
	burgerOpen.value = false;
};
</script>

<template>
	<div :dir="`${ locale.localeDir }`" class="min-h-screen flex flex-col" v-on-click-outside="closeBurger">
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
					<RouterLink
						class="navbar-item"
						to="/"
						@click="closeBurger()"
						>{{locale.navbar.whatIsViossa}}</RouterLink
					>
					<RouterLink
						class="navbar-item"
						to="/resources"
						@click="closeBurger()"
						>{{locale.navbar.resources}}</RouterLink
					>
					<RouterLink class="navbar-item" to="/kotoba">
						{{locale.navbar.kotoba}}
					</RouterLink>
					
				</div>
				<div class="navbar-end">
					<LocalePicker />
				</div>
			</div>
		</nav>
		<RouterView />
	</div>
</template>
