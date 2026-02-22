import type { DeepRemoveFallback } from "./marker";
import type { RichTemplate } from "./rich";
import type { VilanticId } from "./vilantic";

export interface Locale extends DeepRemoveFallback<LocaleMask> {}

export type LocaleMask = {
	localeName: string;
	vilanticLangs: VilanticLangs;
	navbar: Navbar;
	home: HomePage;
	resources: ResourcesPage;
	kotoba: KotobaPage;
	discord: Discord;
};

export type VilanticLangs = Record<VilanticId, string>;

export type Navbar = Record<"whatIsViossa" | "resources" | "kotoba", string>;

export type HomePage = {
	sections: HomeSections;
	images: Record<"viossaFlag", Image>;
};

export type HomeSections = Record<
	"whatIsViossa" | "historyOfViossa" | "community",
	HomeSection
>;

export type HomeSection = { title: string; body: string };

export type ResourcesPage = {
	title: string;
	resources: Resources;
	images: Record<"discordLogo", Image>;
};

export type Resources = { discord: Resource<"join" | "rules"> };

export type Resource<ButtonKey extends string> = {
	title: string;
	subtitle: string;
	desc: string;
	buttons: Record<ButtonKey, Button>;
};

export type KotobaPage = { title: string; searchHelp: string };

export type Button = { label: string };

// coupled to require alt text for all images
export type Image = { alt: string };

export type Discord = { rulesPage: DiscordRulesPage };

export type DiscordRulesPage = {
	title: string;
	overview: DiscordRulesPageOverview;
	rules: DiscordRules;
};

export type DiscordRulesPageOverview = { title: string; help: string };

export type DiscordRules = Record<
	| "noTranslation"
	| "lfsv"
	| "viossaOnlyChats"
	| "sfw"
	| "respectOthers"
	| "respectStaff"
	| "controversialTopics",
	DiscordRule
>;

export type DiscordRule = {
	overview: DiscordRuleOverview;
	section: DiscordRuleSection;
};

export type DiscordRuleOverview = {
	text: RichTemplate<never>;
	subtext: RichTemplate<never> | null;
};

export type DiscordRuleSection = {
	header: (ctx: { ruleNumber: number }) => string;
	body: DiscordRuleSectionBodyElement[];
};

export type DiscordRuleSectionBodyElement =
	| { type: "paragraph"; paragraph: RichTemplate<never> }
	| { type: "header"; header: RichTemplate<never> }
	| { type: "ulist"; ulist: RichTemplate<never>[] };
