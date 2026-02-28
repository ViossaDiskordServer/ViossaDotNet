<script setup lang="ts">
import "./assets/style.scss";
import { computed, ref, type Ref } from "vue";
import LocalePicker from "./components/organisms/LocalePicker.vue";
import { vOnClickOutside } from "@vueuse/components";
import { useRouter } from "vue-router";
import SmartLink from "./components/atoms/SmartLink.vue";
import type { SmartDest } from "./utils/smart-dest";
import { useLocale, type Locale } from "./new-i18n";

const locale = useLocale();

const burgerOpen: Ref<boolean> = ref<boolean>(false);
const toggleBurger = (): void => {
        burgerOpen.value = !burgerOpen.value;
};
const closeBurger = (): void => {
        burgerOpen.value = false;
};

const resourcesOpen: Ref<boolean> = ref<boolean>(false);
const toggleResources = (): void => {
        resourcesOpen.value = !resourcesOpen.value;
};
const closeResources = (): void => {
        resourcesOpen.value = false;
};

const router = useRouter();
router.beforeEach(() => {
        closeBurger();
});

interface NavbarItem {
        to: SmartDest;
        label: string;
}

const NAVBAR_ITEM_ORDER = [
        "whatIsViossa",
        "kotoba",
] as const satisfies (keyof Locale["navbar"])[];

const navbarItems = computed(() =>
        NAVBAR_ITEM_ORDER.map((id): NavbarItem => {
                const label = locale.value.navbar[id]();

                const to = ((): SmartDest => {
                        switch (id) {
                                case "whatIsViossa": {
                                        return { type: "internal", internal: { route: "/" } };
                                }
                                case "kotoba": {
                                        return { type: "internal", internal: { route: "/kotoba" } };
                                }
                        }
                })();

                return { to, label };
        }),
);
</script>

<template>
        <div class="min-h-screen flex flex-col" v-on-click-outside="closeBurger">
                <!-- Main application wrapper -->
                <nav
                        class="navbar is-fixed-top"
                        role="navigation"
                        aria-label="main navigation">
                        <div class="navbar-brand">
                                <SmartLink
                                        class="navbar-item has-text-weight-bold"
                                        :to="{ type: 'internal', internal: { route: '/' } }">
                                        <img src="@/assets/ViossaFlagRect.svg" alt="" />
                                </SmartLink>

                                <div class="navbar-item is-hidden-desktop">
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
                                        <SmartLink
                                                v-for="(item, index) in navbarItems"
                                                :key="index"
                                                class="navbar-item"
                                                :to="item.to"
                                                >{{ item.label }}
                                        </SmartLink>
                                        <div
                                                :class="['navbar-item', 'has-dropdown', resourcesOpen && 'is-active']"
                                                v-on-click-outside="closeResources">
                                                <a class="navbar-link" @click="toggleResources()">
                                                        {{ locale.navbar.resources() }}
                                                </a>
                                                <div class="navbar-dropdown">
                                                        <RouterLink
                                                                class="navbar-item"
                                                                to="/resources?category=learning"
                                                                @click="closeBurger(); closeResources()">
                                                                {{ locale.navbar.resourcesLearning() }}
                                                        </RouterLink>
                                                        <RouterLink
                                                                class="navbar-item"
                                                                to="/resources?category=cultural"
                                                                @click="closeBurger(); closeResources()">
                                                                {{ locale.navbar.resourcesCultural() }}
                                                        </RouterLink>
                                                </div>
                                        </div>
                                        <LocalePicker class="navbar-item" />
                                </div>
                        </div>
                </nav>
                <RouterView />
        </div>
</template>