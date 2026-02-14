<script setup lang="ts">
import type { SmartDest, SmartInternalDest } from "../../utils/smart-dest"; // needs to be relative for vue sfc compiler

export interface SmartLinkProps {
	to: SmartDest;
	newTab?: boolean;
}

const props = defineProps<SmartLinkProps>();

type To =
	| { type: "a"; a: string }
	| { type: "routerLink"; routerLink: SmartInternalDest };

const to = ((): To => {
	const { to, newTab } = props;
	switch (to.type) {
		case "external": {
			return { type: "a", a: to.external };
		}
		case "internal": {
			if (newTab) {
				return { type: "a", a: to.internal };
			}

			return { type: "routerLink", routerLink: to.internal };
		}
	}
})();
</script>

<template>
	<a
		v-if="to.type === 'a'"
		:href="to.a"
		:target="newTab ? '_blank' : undefined"
		rel="noopener noreferrer nofollow">
		<slot />
	</a>
	<RouterLink v-else :to="to.routerLink">
		<slot />
	</RouterLink>
</template>
