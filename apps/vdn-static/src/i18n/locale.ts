import type { DeepRemoveFallback, Fallback, MessagePack } from "./marker";
import type { RichTemplate } from "./rich";
import type { VilanticId } from "./vilantic";

export interface Locale extends DeepRemoveFallback<LocaleMask> {}

export type LocaleMask = MessagePack<{
	localeName: string;
	vilanticLangs: VilanticLangs;
	navbar: Navbar;
	home: HomePage;
	resources: ResourcesPage;
	kotoba: KotobaPage;
	discord: Discord;
}>;

export type VilanticLangs = MessagePack<Record<VilanticId, string>>;

export type Navbar = MessagePack<
	Record<"whatIsViossa" | "resources" | "kotoba", string>
>;

export type HomePage = MessagePack<{ sections: HomeSections }>;

export type HomeSections = MessagePack<
	Record<"whatIsViossa" | "historyOfViossa" | "community", HomeSection>
>;

export type HomeSection = MessagePack<{
	title: string;
	text: string;
	image: Image | null;
}>;

export type ResourcesPage = MessagePack<{
	title: string;
	resources: Resources;
}>;

export type Resources = MessagePack<{ discord: Resource<"join" | "rules"> }>;

export type Resource<ButtonKey extends string> = MessagePack<{
	title: string;
	subtitle: string;
	desc: string;
	image: Image | null;
	buttons: MessagePack<Record<ButtonKey, Button>>;
}>;

export type KotobaPage = MessagePack<{ title: string; searchHelp: string }>;

export type Button = MessagePack<{ label: string }>;

// coupled to require alt text for all images
export type Image = MessagePack<{
	src: string | Fallback; // fallback can be used if image doesn't need to be translated
	alt: string;
}>;

export type Discord = MessagePack<{ rulesPage: DiscordRulesPage }>;

export type DiscordRulesPage = MessagePack<{
	title: string;
	overview: DiscordRulesPageOverview;
	rules: DiscordRules;
}>;

export type DiscordRulesPageOverview = MessagePack<{
	title: string;
	help: string;
}>;

export type DiscordRules = MessagePack<
	Record<
		| "noTranslation"
		| "lfsv"
		| "viossaOnlyChats"
		| "sfw"
		| "respectOthers"
		| "respectStaff"
		| "controversialTopics",
		DiscordRule
	>
>;

export type DiscordRule = MessagePack<{
	overview: DiscordRuleOverview;
	section: DiscordRuleSection;
}>;

export type DiscordRuleOverview = MessagePack<{
	text: RichTemplate<never>;
	subtext: RichTemplate<never> | null;
}>;

export type DiscordRuleSection = MessagePack<{
	header: (ctx: { ruleNumber: number }) => string;
	body: DiscordRuleSectionBodyElement[];
}>;

export type DiscordRuleSectionBodyElement =
	| { type: "paragraph"; paragraph: RichTemplate<never> }
	| { type: "header"; header: RichTemplate<never> }
	| { type: "ulist"; ulist: RichTemplate<never>[] };
