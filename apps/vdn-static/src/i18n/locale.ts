import type { VilanticId } from "./vilantic";

// special symbol to explicitly specify when to fallback to default (en_US) translation
// instead of translating a specific key, which still not being marked as a missing translation.
// can only be used on keys which are typed as being able to use a fallback.
export const fallback: unique symbol = Symbol("fallback");
export type Fallback = typeof fallback;

type DeepRemoveFallback<T> = Exclude<
	{ [K in keyof T]: DeepRemoveFallback<T[K]> },
	Fallback
>;

export interface Locale extends DeepRemoveFallback<LocaleMask> {}

export interface LocaleMask {
	localeName: string;
	vilanticLangs: VilanticLangs;
	navbar: Navbar;
	home: HomePage;
	resources: ResourcesPage;
	kotoba: KotobaPage;
	discord: Discord;
}

export interface VilanticLangs extends Record<VilanticId, string> {}

export interface Navbar
	extends Record<"whatIsViossa" | "resources" | "kotoba", string> {}

export interface HomePage {
	sections: HomeSections;
}

export interface HomeSections
	extends Record<
		"whatIsViossa" | "historyOfViossa" | "community",
		HomeSection
	> {}

export interface HomeSection {
	title: string;
	text: string;
	image: Image | null;
}

export interface ResourcesPage {
	title: string;
	resources: Resources;
}

export interface Resources {
	discord: Resource<"join" | "rules">;
}

export interface Resource<ButtonKey extends string> {
	title: string;
	subtitle: string;
	desc: string;
	image: Image | null;
	buttons: Record<ButtonKey, Button>;
}

export interface KotobaPage {
	title: string;
	searchHelp: string;
}

export interface Button {
	label: string;
}

// coupled to require alt text for all images
export interface Image {
	src: string | Fallback; // fallback can be used if image doesn't need to be translated
	alt: string;
}

export interface Discord {
	rulesPage: DiscordRulesPage;
}

export interface DiscordRulesPage {
	title: string;
	overview: DiscordRulesPageOverview;
	rules: DiscordRules;
}

export interface DiscordRulesPageOverview {
	title: string;
	help: string;
}

export interface DiscordRules extends Record<"noTranslation", DiscordRule> {}

export interface DiscordRule {
	overview: DiscordRuleOverview;
}

export interface DiscordRuleOverview {
	text: string;
	subtext: string | null;
}
