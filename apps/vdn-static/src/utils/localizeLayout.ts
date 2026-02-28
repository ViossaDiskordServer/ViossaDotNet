import type { Layout } from "@/i18n/locale";
import type { DeepReadonly } from "vue";

export function localizeLayout<T>(
	layout: DeepReadonly<Layout<T>>,
): T[keyof T][] {
	const sections: T[keyof T][] = [];
	for (const sectionId of layout.order ?? []) {
		const section = (layout.data as T)[sectionId as keyof T];
		if (section) {
			sections.push(section);
		}
	}

	return sections;
}
