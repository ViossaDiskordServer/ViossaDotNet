import { type Locale } from "@/i18n/locale";
import flakkaImg from "@/assets/flakka.png";
import discordImg from "@/assets/discord.png";
import { boldT, richT } from "@/i18n/rich";

export default {
	localeName: "English",
	vilanticLangs: { viossa: "Viossa", wodox: "Wodoch" },
	navbar: {
		whatIsViossa: "What is Viossa?",
		resources: "Resources",
		kotoba: "Kotoba",
	},
	home: {
		sections: {
			whatIsViossa: {
				title: "What is Viossa?",
				text: "Viossa is a community-created artificial pidgin language, created to simulate the formation of natural pidgin languages. Viossa is characterized by its lack of standardization, with each speaker developing a personal idiolect. Spelling and pronunciation can vary greatly, and serve as a form of personal self-expression. Viossa is learnt and taught entirely by immersion — translation is prohibited while learning.",
				image: { src: flakkaImg, alt: "Flag of the Viossa Language" },
			},
			historyOfViossa: {
				title: "History of Viossa",
				text: "Viossa began as a Skype group in 2014, created by members of the r/conlangs community on Reddit, as an experiment to simulate the formation of a pidgin language. Pidgins are simplified languages resulting from contact between populations with no shared common language. Unlike most pidgins, which usually have two to three contributor languages, Viossa comes from many diverse languages. This is because people from all around the world helped to contribute to Viossa's vocabulary.",
				image: { src: flakkaImg, alt: "Flag of the Viossa Language" },
			},
			community: {
				title: "Community",
				text: "The Viossa community is rich and colourful, drawing from many global traditions due to its worldwide online membership. Since the teaching culture puts an emphasis on linguistic immersion, and discourages prescriptivism, the culture of Viossa is as diverse and varied as the language and the people who speak it. For many, their personal dialect is a key form of identity and expression. The fluid nature of Viossa and lack of defined meanings makes Viossa popular for creative purposes, such as poetry and songwriting.",
				image: null,
			},
		},
	},
	resources: {
		title: "Learning Resources",
		resources: {
			discord: {
				title: "Discord Server",
				subtitle:
					"This is where most of the action happens! Hop on in!",
				desc: "Originally started in 2015 something something read the rules here, then click the link below to join!",
				image: { src: discordImg, alt: "Discord logo" },
				buttons: { join: { label: "Join" }, rules: { label: "Rules" } },
			},
		},
	},
	kotoba: {
		title: "Tropos-agnostic search",
		searchHelp: "To searcn tropos-agnostically, enter a term below.",
	},
	discord: {
		rulesPage: {
			title: "Discord Server Rules",
			overview: {
				title: "Overview",
				help: "Click any rule to see details.",
			},
			rules: {
				noTranslation: {
					overview: {
						text: richT(
							"No translation! Do not translate to/from Viossa on the server, except the big four translatables (you can learn in hard mode without them!)",
						),
						subtext: null,
					},
				},
				lfsv: {
					overview: {
						text: richT("If it's understood, it's Viossa."),
						subtext: null,
					},
				},
				viossaOnlyChats: {
					overview: {
						text: richT(
							"The chats in the Viossa Only category are Viossa only.",
						),
						subtext: null,
					},
				},
				sfw: {
					overview: {
						text: richT(
							"This server is SFW. No sexually explicit, gory, or violent content.",
						),
						subtext: null,
					},
				},
				respectOthers: {
					overview: {
						text: richT(
							"Don't use hate speech, and respect each other.",
						),
						subtext: null,
					},
				},
				respectStaff: {
					overview: {
						text: richT(
							"Respect the rulings of the staff (",
							boldT("@Yewald"),
							" and ",
							boldT("@Yewaldnen"),
							").",
						),
						subtext: null,
					},
				},
				controversialTopics: {
					overview: {
						text: richT(
							"Discussion of controversial topics (politics, war, etc.) should be directed to ",
							boldT("#polite"),
							", which requires the ",
							boldT("@Ike"),
							" role to view, which is itself locked behind ",
							boldT("@Viossadjin"),
							" and ",
							boldT("@mellandjin"),
							".",
						),
						subtext: richT(
							boldT("#feels-and-advice"),
							" is for talking about your feelings openly, but we draw the line at suicidal or violent ideation. These are trains of thought to be brought to a therapist, and are not jokes. Because of their seriousness, they simply don't belong here.",
						),
					},
				},
			},
		},
	},
} as const satisfies Locale;
