export interface Locale {
	localeName: string;
	home: Layout<HomeSections>;
	resources: Layout<Resources>;
}

export interface Layout<T> {
	layout: (keyof T)[] | null;
	data: { [K in keyof T]: T[K] | null };
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
