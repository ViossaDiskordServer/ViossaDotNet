export interface Locale {
	props: Props;
	navbar: Navbar;
	home: Layout<HomeSections>;
	resourcesPage: ResourcesPage;
	resources: Layout<Resources>;
	kotoba: Kotoba;
}

export interface Layout<T> {
	layout: (keyof T)[] | null;
	data: { [K in keyof T]: T[K] | null };
}

export interface Props {
	name: string;
	dir: string;
	code: string;
}

export interface Navbar {
	whatIsViossa: string;
	resources: string;
	kotoba: string;
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

export interface Kotoba {
	title: string;
}

