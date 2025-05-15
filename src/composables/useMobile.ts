import { onMounted, onUnmounted, ref } from "vue";

export function useMobile() {
	// 1023px is the max width of the "tablet" breakpoint in Bulma
	// https://bulma.io/documentation/start/responsiveness/
	const mobileQuery = window.matchMedia("(max-width: 1023px)");
	const mobile = ref(mobileQuery.matches);

	const update = (e: MediaQueryListEvent) => {
		mobile.value = e.matches;
	};

	onMounted(() => {
		mobileQuery.addEventListener("change", update);
	});

	onUnmounted(() => {
		mobileQuery.removeEventListener("change", update);
	});

	return mobile;
}
