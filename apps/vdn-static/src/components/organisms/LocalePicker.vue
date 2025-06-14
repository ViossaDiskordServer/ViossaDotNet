<script setup lang="ts">
import { LOCALE_IDS, localeId, useLocale, type LocaleId } from "@/i18n";
import { onMounted, onUnmounted, ref, useTemplateRef } from "vue";

const isOpen = ref<boolean>(false);
const dropdownRef = useTemplateRef("dropdown");

const toggleOpen = (): void => {
	isOpen.value = !isOpen.value;
};

const setLocaleId = (id: LocaleId): void => {
	localeId.value = id;
};

const detectFocus = (e: MouseEvent) => {
	if (!isOpen) {
		return;
	}

	const dropdown = dropdownRef.value;
	if (!dropdown) {
		return;
	}

	const { target } = e;
	const focused =
		target instanceof Node
		&& (dropdown === target || dropdown.contains(target));

	if (!focused) {
		isOpen.value = false;
	}
};

onMounted(() => window.addEventListener("click", detectFocus));
onUnmounted(() => window.removeEventListener("click", detectFocus));
</script>

<template>
	<div :class="['dropdown', isOpen && 'is-active']" ref="dropdown">
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
