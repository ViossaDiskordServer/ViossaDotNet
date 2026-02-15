import { type Locale } from "@/i18n/locale";
import flakkaImg from "@/assets/flakka.png";
import discordImg from "@/assets/discord.png";
import { boldT, italicT, linkT, richT } from "@/i18n/rich";

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
					section: {
						header: ({ ruleNumber }) =>
							`Rule ${String(ruleNumber)}: No translation`,
						body: [
							{
								type: "paragraph",
								paragraph: richT(
									"Translation is not how we learn and teach Viossa. Instead, we teach using pictures, diagrams, video calls, and other aids to couple words to meaning.",
								),
							},
							{
								type: "paragraph",
								paragraph: richT(
									"On the Viossa Diskordserver, you are allowed to translate the following four words. If you want an extra challenge, don't unspoiler the text:",
								),
							},
							{
								type: "paragraph",
								paragraph: richT(
									boldT(italicT("TODO - big 4")),
								),
							},
							{
								type: "paragraph",
								paragraph: richT(
									"Outside of the teaching-learning cycle, we also make an exception for artistic translations (such as those of songs, books, or poems), as well as for academic translations (such as for a formal research paper). In both cases, this exception is dependent on translations of either class appearing in the appropriate place. If you're not sure where that is, please ask.",
								),
							},
							{
								type: "paragraph",
								paragraph: richT(
									"Additionally, please don't attempt to derive or share translation-based learning materials on-server, or poach members for such a purpose.",
								),
							},
						],
					},
				},
				lfsv: {
					overview: {
						text: richT("If it's understood, it's Viossa."),
						subtext: null,
					},
					section: {
						header: ({ ruleNumber }) =>
							`Rule ${String(ruleNumber)}: If it's understood, it's Viossa`,
						body: [
							{
								type: "paragraph",
								paragraph: richT(
									"All that is required to speak Viossa is that other speakers be able to understand you. There is no right or wrong way to speak or write, and no global standard.",
								),
							},
							{
								type: "paragraph",
								paragraph: richT(
									"However, Viossa is a collaborative group project: members should strive to make others understand them, and in return make an effort to understand others.",
								),
							},
						],
					},
				},
				viossaOnlyChats: {
					overview: {
						text: richT(
							"The chats in the Viossa Only category are Viossa only.",
						),
						subtext: null,
					},
					section: {
						header: ({ ruleNumber }) =>
							`Rule ${String(ruleNumber)}: Viossa-only chats`,
						body: [
							{
								type: "paragraph",
								paragraph: richT(
									"Chats in the Viossa Only section do not permit English. If you must use English to coach learners on the learning process, go to ",
									boldT("#meta"),
									" instead.",
								),
							},
							{
								type: "paragraph",
								paragraph: richT(
									"This doesn't mean that other channels are English-only, though! Viossa is allowed everywhere.",
								),
							},
						],
					},
				},
				sfw: {
					overview: {
						text: richT(
							"This server is SFW. No sexually explicit, gory, or violent content.",
						),
						subtext: null,
					},
					section: {
						header: ({ ruleNumber }) =>
							`Rule ${String(ruleNumber)}: SFW`,
						body: [
							{
								type: "paragraph",
								paragraph: richT(
									"If a mod does not like what you have posted, they will inform you; see ",
									linkT({
										children: ["Rule 6"],
										props: {
											to: {
												type: "internal",
												internal: { id: "rule-6" },
											},
										},
									}),
									". This is a public Discord server; think before you post.",
								),
							},
						],
					},
				},
				respectOthers: {
					overview: {
						text: richT(
							"Don't use hate speech, and respect each other.",
						),
						subtext: null,
					},
					section: {
						header: ({ ruleNumber }) =>
							`Rule ${String(ruleNumber)}: Respect one another`,
						body: [
							{
								type: "paragraph",
								paragraph: richT(
									"Respect one another. Using slurs or hate speech against others, whether on- or off-server, or advocating for violence are not welcome. This is an LGBTQ+ friendly international community.",
								),
							},
						],
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
					section: {
						header: ({ ruleNumber }) =>
							`Rule ${String(ruleNumber)}: Respect the staff's rulings`,
						body: [
							{
								type: "paragraph",
								paragraph: richT(
									"The word of staff (the Yewald as well as the Yewaldnen) is final, and they may kick, ban, or mute members or change members' access permissions to make sure this environment stays respectful and puts the Viossa community first.",
								),
							},
							{
								type: "paragraph",
								paragraph: richT(
									"Appeals will always be considered, and if you feel that a mod action was inappropriate, you can DM any Yewald or open a ticket with YAGPDB's /tickets open command.",
								),
							},
							{
								type: "paragraph",
								paragraph: richT(
									"If you are banned, there will be instructions on how to appeal the ban, however, please take the time to reflect on the ban reason before appealing.",
								),
							},
						],
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
					section: {
						header: ({ ruleNumber }) =>
							`Rule ${String(ruleNumber)}: #polite and ike`,
						body: [
							{
								type: "paragraph",
								paragraph: richT(
									"Many are life's troubling realities, and vast is our need to discuss them. The ike category is an opt-in set of chats where discussion of heavy, sensitive, or potentially contentious topics is allowed, provided that users are especially respectful of each other during such discussions. By accepting the ike role, you agree to adhere to this rule and encourage others to do the same.",
								),
							},
							{
								type: "header",
								header: richT("Venting vs seeking advice"),
							},
							{
								type: "paragraph",
								paragraph: richT(
									"Sometimes you want to let people know that you're dealing with an issue and just be acknowledged, other times you want help in solving a problem. If you are open to one but not the other, it's often a good idea to let people know as part of the discussion so that you can receive the kind of responses you are looking for.",
								),
							},
							{
								type: "header",
								header: richT(`Self-harm and Violence`),
							},
							{
								type: "paragraph",
								paragraph: richT(
									"While discussing self-harm in general is allowed (with appropriate and clear use of content warnings), this server in itself is not an emergency mental health resource, and is not a substitute for professional help. Asking others for advice in finding support or resources off-server is fine, but asking others to participate in talking you down is inappropriate.",
								),
							},
							{
								type: "paragraph",
								paragraph: richT(
									"You should not use this space to:",
								),
							},
							{
								type: "ulist",
								ulist: [
									richT(
										"express intent or desire to harm yourself or others",
									),
									richT(
										"solicit help in stopping yourself from harming yourself or someone else",
									),
								],
							},
							{
								type: "paragraph",
								paragraph: richT(
									"By crossing these boundaries, please be aware that you are asking members of the server (including moderators and the owner) to perform a role for which they are not trained or equipped. At the moderators' sole discretion, this may not be tolerated and may result in a warning, timeout, removal of the ",
									boldT("@ike"),
									" role, or removal from the server.",
								),
							},
							{
								type: "paragraph",
								paragraph: richT(
									"If you are struggling with thoughts of this nature, but are not immediately in danger, please consider seeking counseling. If you are experiencing an immediate crisis, please call ",
									boldT("988"),
									" (in the United States), ",
									boldT("999"),
									" (in the UK), or locate an emergency hotline appropriate for you. A list of resources by country exists here: ",
									linkT({
										children: [
											"https://blog.opencounseling.com/suicide-hotlines/",
										],
										props: {
											to: {
												type: "external",
												external:
													"https://blog.opencounseling.com/suicide-hotlines/",
											},
											newTab: true,
										},
									}),
								),
							},
						],
					},
				},
			},
		},
	},
} as const satisfies Locale;
