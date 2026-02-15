<script setup lang="ts">
import { LOCALE_IDS, localeId, useI18n, type LocaleId } from "@/i18n";
import { ref } from "vue";
import { vOnClickOutside } from "@vueuse/components";
import DropdownItem from "../atoms/DropdownItem.vue";

const i18n = useI18n();

const isOpen = ref<boolean>(false);

const toggleOpen = (): void => {
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
		:class="['dropdown', isOpen && 'is-active']"
		v-on-click-outside="close">
		<div class="dropdown-trigger">
			<button
				class="button"
				aria-haspopup="true"
				aria-controls="dropdown-menu"
				@click="toggleOpen()">
				<span>{{ i18n.t("localeName") }}</span>
				<span class="icon is-small">
					<i class="fas fa-angle-down" aria-hidden="true"></i>
				</span>
			</button>
		</div>
		<div class="dropdown-menu" id="dropdown-menu" role="menu">
			<div class="dropdown-content">
				<DropdownItem
					v-for="(id, index) in LOCALE_IDS"
					:key="index"
					:class="[
						'dropdown-item is-clickable',
						localeId === id && 'is-active',
					]"
					@click="setLocaleId(id)">
					{{ i18n.t("localeName", { locale: id }) }}
				</DropdownItem>
			</div>
		</div>
	</div>
</template>
