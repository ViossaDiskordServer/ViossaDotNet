<script setup lang="ts">
import { LOCALE_IDS, localeId, useLocale, type LocaleId } from "@/i18n";
import { ref } from "vue";
import { vOnClickOutside } from "@vueuse/components";

const locale = useLocale();
var navbarDirection;
console.log(locale.value);

const isOpen = ref<boolean>(false);

const toggleOpen = (): void => {
	navbarDirection = locale.value.localeDir == 'rtl' ? 'is-left' : 'is-right'; 
	isOpen.value = !isOpen.value;
};

const close = (): void => {
	isOpen.value = false;
};

const setLocaleId = (id: LocaleId): void => {
	localeId.value = id;
	close();
};
</script>

<template>
	<div
		:class="['dropdown', isOpen && 'is-active', 'navbar-item', navbarDirection]" 
		v-on-click-outside="close">
		<div class="dropdown-trigger">
			<button
				class="button"
				aria-haspopup="true"
				aria-controls="dropdown-menu"
				@click="toggleOpen()">
				<span>{{ useLocale().value.localeName }}</span>
				<span class="icon is-small">
					<i class="fas fa-angle-down" aria-hidden="true"></i>
				</span>
			</button>
		</div>
		<div class="dropdown-menu" id="dropdown-menu" role="menu">
			<div class="dropdown-content">
				<a
					v-for="(id, index) in LOCALE_IDS"
					:key="index"
					href="#"
					:class="['dropdown-item', localeId === id && 'is-active']"
					@click="setLocaleId(id)">
					{{ useLocale({ locale: id }).value.localeName }}
				</a>
			</div>
		</div>
	</div>
</template>
