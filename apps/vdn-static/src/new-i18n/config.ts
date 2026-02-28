import {
	message,
	record,
	type InferLocale,
	type LocaleConfig,
} from "@/new-i18n-lib/config";

const homeSectionConfig = { title: message(), body: message() };

const imageConfig = { alt: message() };
export interface Image extends InferLocale<typeof imageConfig> {}

const buttonConfig = { label: message() };

const resourceConfig = <ButtonKey extends string>(buttonKeys: ButtonKey[]) => ({
	title: message(),
	subtitle: message(),
	desc: message(),
	buttons: record(buttonKeys, () => buttonConfig),
});

const discordRuleConfig = {
	overview: {
		text: message({ markdown: { bold: true, italic: true, link: true } }),
		subtext: message({
			markdown: { bold: true, italic: true, link: true },
		}),
	},
	section: {
		header: message({ placeables: { ruleNumber: { type: "number" } } }),
		body: message({
			markdown: { bold: true, header: true, italic: true, link: true },
		}),
	},
};

export const localeConfig = {
	localeName: message(),
	vilanticLangs: record(["viossa", "wodox", "minemiaha"], () => message()),
	navbar: record(["whatIsViossa", "resources", "resourcesLearning", "resourcesCultural", "kotoba"], () => message()),
	home: {
		sections: record(
			["whatIsViossa", "historyOfViossa", "community"],
			() => homeSectionConfig,
		),
		images: record(["viossaFlag"], () => imageConfig),
	},
	resources: {
		title: message(),
		resources: {
			discord:     resourceConfig(["join", "rules"]),
			vikoli:      resourceConfig(["visit"]),
			daviSpil:    resourceConfig(["join"]),
			vimivera2025: resourceConfig(["read"]),
			korohtella:  resourceConfig(["spotify", "youtube"]),
			piik:        resourceConfig(["thunderstore"]),
		},
		images: record(
			["discordLogo", "viossaFlag", "vimivera2025", "korohtella", "piik"],
			() => imageConfig,
		),
	},
	kotoba: { title: message(), searchHelp: message() },
	discord: {
		rulesPage: {
			title: message(),
			overview: { title: message(), help: message() },
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