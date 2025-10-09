import type { Locale } from "@/i18n/locale";
import flakkaImg from "@/assets/flakka.png";
import discordImg from "@/assets/discord.png";

export default {
	localeName: "العربية",
	localeDir: "rtl",
	navbar: {
		whatIsViossa: "ما هي الفيوسية؟",
		resources: "الموارد",
		kotoba: "كوتوبا",
	},
	home: {
		layout: ["whatIsViossa", "historyOfViossa", "community"],
		data: {
			whatIsViossa: {
				title: "ما هي الفيوسية؟",
				text: "اللغة الفيوسية هي لغة مسطنعة أبدعتها الجماعة لتقليد تشكُل لغات مبسطة طبيعية. تتميز الفيوسية بعدم توحيدها فيشكل كل متكلم لهجة شخصية خاصة به. يتغاير الهجاء واللفظ كثيرا فيستعملهما المتكلمون بشكل التعبير الشخصي. تُتعلّم وتُعلّم اللغة بالإنغماس فيها ويُمنع الترجمة أثناء التعلم.",
				image: flakkaImg,
				alt: "Flag of the Viossa Language",
			},
			historyOfViossa: {
				title: "تاريخ اللغة الفيوسية",
				text: `
				بدأ المشروع الفيوسي عبر سكايب في عام ٢٠١٤، ببب

				Viossa began as a Skype group in 2014, created by members of the r/conlangs community on Reddit, as an experiment to simulate the formation of a pidgin language. Pidgins are simplified languages resulting from contact between populations with no shared common language. Unlike most pidgins, which usually have two to three contributor languages, Viossa comes from many diverse languages. This is because people from all around the world helped to contribute to Viossa's vocabulary.`,
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
				title: "خادم ديسكورد",
				subtitle:
					"This is where most of the action happens! Hop on in!",
				desc: "Originally started in 2015 something something read the rules here, then click the link below to join!",
				link: "https://discord.gg/g3mG2gYjZD",
				rulesLink: "https://viossadiskordserver.github.io/rules",
				image: discordImg,
				alt: "Discord logo",
				joinText: "Join",
				rulesText: "القوانين",
			},
		},
	},
	kotoba: {
		title: "بحث مستقل اللهجة",
	},
} as const satisfies Locale;
