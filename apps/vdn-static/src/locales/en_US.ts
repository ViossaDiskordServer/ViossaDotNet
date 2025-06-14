import type { Locale } from "@/i18n/locale";
import flakkaImg from "@/assets/flakka.png";
import discordImg from "@/assets/discord.png";

export default {
	localeName: "English",
	home: {
		layout: ["whatIsViossa", "historyOfViossa", "community"],
		data: {
			whatIsViossa: {
				title: "What is Viossa?",
				text: "Viossa is a community-created artificial pidgin language, created to simulate the formation of natural pidgin languages. Viossa is characterized by its lack of standardization, with each speaker developing a personal idiolect. Spelling and pronunciation can vary greatly, and serve as a form of personal self-expression. Viossa is learnt and taught entirely by immersion — translation is prohibited while learning.",
				image: flakkaImg,
				alt: "Flag of the Viossa Language",
			},
			historyOfViossa: {
				title: "History of Viossa",
				text: "Viossa began as a Skype group in 2014, created by members of the r/conlangs community on Reddit, as an experiment to simulate the formation of a pidgin language. Pidgins are simplified languages resulting from contact between populations with no shared common language. Unlike most pidgins, which usually have two to three contributor languages, Viossa comes from many diverse languages. This is because people from all around the world helped to contribute to Viossa's vocabulary.",
				image: flakkaImg,
				alt: "Flag of the Viossa Language",
			},
			community: {
				title: "Community",
				text: "The Viossa community is rich and colourful, drawing from many global traditions due to its worldwide online membership. Since the teaching culture puts an emphasis on linguistic immersion, and discourages prescriptivism, the culture of Viossa is as diverse and varied as the language and the people who speak it. For many, their personal dialect is a key form of identity and expression. The fluid nature of Viossa and lack of defined meanings makes Viossa popular for creative purposes, such as poetry and songwriting.",
				image: null,
				alt: null,
			},
		},
	},
	resources: {
		layout: ["discord"],
		data: {
			discord: {
				title: "Discord Server",
				subtitle:
					"This is where most of the action happens! Hop on in!",
				desc: "Originally started in 2015 something something read the rules here, then click the link below to join!",
				link: "https://discord.gg/g3mG2gYjZD",
				rulesLink: "https://viossadiskordserver.github.io/rules",
				image: discordImg,
				alt: "Discord logo",
				joinText: "Join",
				rulesText: "Rules",
			},
		},
	},
} as const satisfies Locale;
