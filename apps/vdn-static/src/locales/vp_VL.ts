import type { Locale } from "@/i18n/locale";
import flakkaImg from "@/assets/flakka.png";
import type { DeepPartial } from "@/utils/deep-partial";

export default {
	localeName: "Viossa",
	vilanticLangs: { viossa: "Viossa", wodox: "Wodossa" },
	navbar: {
		whatIsViossa: "Ka Viossa?",
		resources: "Lerakran",
		kotoba: "Kotoba",
	},
	home: {
		layout: {
			order: ["whatIsViossa", "historyOfViossa", "community"],
			data: {
				whatIsViossa: {
					title: "Ka Viossa?",
					text: "Viossa viskena-mahaossa mahajena na klaani, per mverm hur gvir viskossa mahajena. Viossa nai har rasmi, tont pashun bruk aparchigau tropos. Kakutro au hanutro deki chigaudai, au deki brukena per impla pashun. Viossa lerajena au opetajena na hel na hanu/kaku — dekinai kjannos per lera.",
					image: flakkaImg,
					alt: "Flakka fu Viossa",
				},
				historyOfViossa: {
					title: "Danvimi fu Viossa",
					text: "Viossa hadjidan na Skype na 2014, mahajena na klaani fu r/conlangs na Reddit, grun tuvat per mverm hur viskossa mahajena. Viskossa plussimper fal fu glossa grun klaani uten kamagglossa na sama plas. Na leste viskossa jam na snano 2-3 ranyaossa, men Viossa mahajena grun mange chigau ranyaossa. Grun mangedjin gele gaja apudan per maha viko.",
					image: flakkaImg,
					alt: "Flakka fu Viossa",
				},
				community: {
					title: "Klaani",
					text: "Klaani fu Viossa surudan mange au stranidai, mange rurret kara, na hel gaja, grun na zerjet. Opetaklupau maha uten kjannos os metahanu plussnano au hel uslovanai ke joku tro plusbra kena andr. Viossaklupau mange chigau likk glossa au hanudjin. Na mangedjin, tro awen tel fu sebja. Grun Viossa deki chigaudai au naijam mange tsatain imi znachi ke Viossa blogeta na ishu grunan, likk maha paem os liid.",
					image: null,
					alt: null,
				},
			},
		},
	},
	resources: {
		title: "Lerakran",
		layout: {
			order: ["discord"],
			data: {
				discord: {
					title: "Diskordserver",
					subtitle:
						"Alting Viossa tsuite slucha na her! Da zetulla jo!",
					desc: "Mahajena na 2016, server rupnejena na mange, na ima jam plus kena 6000 pashun long. Bitte da se ruuru au de bruk zedvera na una per zetulla!",
					link: "https://discord.gg/g3mG2gYjZD",
					rulesLink: "https://viossadiskordserver.github.io/rules",
					image: discordImg,
					alt: "Riso fu Diskord",
					joinText: "Zetulla",
					rulesText: "Ruuru",
				},
			},
		},
	},
	kotoba: {
		title: "Tropos-egal suha",
		searchHelp: "Li vil suha uten tro-egal, tastatsa joku ko os fras na una.",
	},
} as const satisfies DeepPartial<Locale>;
