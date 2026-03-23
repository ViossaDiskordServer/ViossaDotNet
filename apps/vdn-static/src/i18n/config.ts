import {
	string,
	markdown,
	record,
	type InferLocaleFromConfig,
	type LocaleConfig,
	type ConfigString,
} from "@/vi18n-lib/config";

function plainString(): ConfigString<object> {
	return string({ placeables: {} });
}

const homeSectionConfig = { title: plainString(), body: plainString() };

const imageConfig = { alt: plainString() };
export interface Image extends InferLocaleFromConfig<typeof imageConfig> {}

const buttonConfig = { label: plainString() };

const resourceConfig = <ButtonKey extends string>(buttonKeys: ButtonKey[]) => ({
	title: plainString(),
	subtitle: plainString(),
	desc: plainString(),
	buttons: record(buttonKeys, () => buttonConfig),
});

const discordRuleConfig = {
	overview: {
		text: markdown({
			placeables: {},
			slots: {},
			bold: true,
			italic: true,
			link: true,
		}),
		subtext: markdown({
			placeables: {},
			slots: {},
			bold: true,
			italic: true,
			link: true,
		}),
	},
	section: {
		header: string({ placeables: { ruleNumber: { type: "number" } } }),
		body: markdown({
			placeables: {},
			slots: {},
			bold: true,
			header: true,
			italic: true,
			link: true,
		}),
	},
};

export const localeConfig = {
	localeName: plainString(),
	vilanticLangs: record(["viossa", "wodox"], () => plainString()),
	navbar: record(["whatIsViossa", "resources", "kotoba"], () =>
		plainString(),
	),
	home: {
		sections: record(
			["whatIsViossa", "historyOfViossa", "community"],
			() => homeSectionConfig,
		),
		images: record(["viossaFlag"], () => imageConfig),
	},
	resources: {
		title: plainString(),
		resources: { discord: resourceConfig(["join", "rules"]) },
		images: record(["discordLogo"], () => imageConfig),
	},
	kotoba: { title: plainString(), searchHelp: plainString() },
	discord: {
		rulesPage: {
			title: plainString(),
			overview: { title: plainString(), help: plainString() },
			rules: record(
				[
					"noTranslation",
					"lfsv",
					"viossaOnlyChats",
					"sfw",
					"respectOthers",
					"respectStaff",
					"controversialTopics",
				],
				() => discordRuleConfig,
			),
		},
	},
} as const satisfies LocaleConfig;
