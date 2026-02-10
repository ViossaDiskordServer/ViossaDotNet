import type { VilanticId } from "./vilantic";

export interface Locale {
	localeName: string;
	vilanticLangs: VilanticLangs;
	navbar: Navbar;
	home: HomePage;
	resources: ResourcesPage;
	kotoba: KotobaPage;
}

export interface Layout<T> {
	order: (keyof T)[];
	data: { [K in keyof T]: T[K] };
}

export type VilanticLangs = Record<VilanticId, string>;

export interface Navbar {
	whatIsViossa: string;
	resources: string;
	kotoba: string;
}

export interface HomePage {
	layout: Layout<HomeSections>;
}

export interface HomeSections {
	whatIsViossa: HomeSection;
	historyOfViossa: HomeSection;
	community: HomeSection;
}

export interface HomeSection {
	title: string;
	text: string;
	image: string | null;
	alt: string | null;
}

export interface ResourcesPage {
	title: string;
	layout: Layout<Resources>;
}

export interface Resources {
	discord: Resource;
}

export interface Resource {
	title: string;
	subtitle: string;
	desc: string;
	link: string;
	rulesLink: string;
	image: string;
	alt: string;
	joinText: string;
	rulesText: string;
}

export interface KotobaPage {
	title: string;
	searchHelp: string;
}
