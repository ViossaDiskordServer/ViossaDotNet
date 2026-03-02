import {
	string,
	markdown,
	record,
	type InferLocaleFromConfig,
	type LocaleConfig,
	type ConfigString,
} from "@/new-i18n-lib/config";

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
			features: { bold: true, italic: true, link: true, slots: {} },
		}),
		subtext: markdown({
			placeables: {},
			features: { bold: true, italic: true, link: true, slots: {} },
		}),
	},
	section: {
		header: string({ placeables: { ruleNumber: { type: "number" } } }),
		body: markdown({
			placeables: {},
			features: {
				bold: true,
				header: true,
				italic: true,
				link: true,
				slots: {},
			},
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
