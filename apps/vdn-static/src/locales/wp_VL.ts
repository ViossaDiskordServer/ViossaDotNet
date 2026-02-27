import type { Locale } from "@/i18n/locale";
import flakkaImg from "@/assets/flakka.png";
import discordImg from "@/assets/discord.png";
import vimiveraImg from "@/assets/vimivera2025.webp";
import korohtella from "@/assets/korohtella.png";
import piikImg from "@/assets/piik.webp";
import type { DeepPartial } from "@/utils/deep-partial";

export default {
	localeName: "wodox",
	vilanticLangs: { viossa: "viosox", wodox: "wodox" },
	navbar: {
		whatIsViossa: "viosox e ano?",
		resources: "tropos",
		resourcesLearning: "tropos o gen",
		resourcesCultural: "tropos o ro",
		kotoba: "mot o viosox",
	},
	home: {
		layout: {
			order: ["whatIsViossa", "historyOfViossa", "community"],
			data: {
				whatIsViossa: {
					title: "viosox e ano?",
					text: "viosox e hez ox pamzal, zoz stende zalkun tuo mit multa nengwi ox. zal o viosox stende lik zal o hez il ox keta, zalilkun wi tuo mit multa nengwi ox. mono i fal o viosox stendenai; omni axsi o viosox zal nengokun fal o viosox, de falmot wi falax o il stende e keko trenengwi tua o nengwi stende, ge fala e keko lik ro o tuo viosoxsi. genil viosox ibe il wi nengwi stende axkun ge pisakun po tuo ox — stende gen muskunnai mit zaiox.",
					image: flakkaImg,
					alt: "fomma o viosox",
				},
				historyOfViossa: {
					title: "zal o viosox",
					text: "wi o zal o viosox stende po multa o Skype wi 2014 ibe stendera o multa r/conlangs o Reddit. zalsi o viosox danzalgo hez, tuo zal o viosox e lik zal o hez il ox keta, zalil tuo ox mit nengwi multa ox ibe zalsi fiemnaikun sama i ox. viosox e nengwi tuo ox pamzal keta; zalilkun keko ox keta mit lik du wi tre ox, aga zalil viosox mit multa wi plus obo o ox na il ox keta ibe zalsi o viosox stende po multa mi o mo.",
					image: flakkaImg,
					alt: "fomma o viosox",
				},
				community: {
					title: "viosoxsi",
					text: "nengwi multa ro o viosoxsi stende ibe stendenura po nengwi multa mi o mo ge wekakunnura zai nengwi viosoxsi po jilobo. ibe mono i fal o viosox stendenai ge ibe viosoxsi zalkun nengwi multa fal o viosox, de nengwi zoz ko o ro lik ro o viosoxsi stende po ro o viosa. po multa hez viosoxsi, falmot wi falax o tuo stende stende po ro o tuo stende. ibe mono i fal o viosox stendenai ge ibe ro o mot inkun nengwi po nengwi viosoxsi, de multa stende amanata hez, zal zalgonukun surat au mola au sucik.",
					image: null,
					alt: null,
				},
			},
		},
	},
	resources: {
		title: "tropos o gen",
		layout: {
			order: ["discord", "vikoli", "daviSpil", "vimivera2025", "korohtella", "piik"],
			data: {
				discord: {
					category: "learning",
					title: "server o Diskord",
					subtitle: "axilkun ge genilkun po ce! wekatutsa!",
					desc: "danzalil hez server po 2015. ibe dutukun musra po ce, de ibe wiftutsakun dof po pam, de wekatukun po server!",
					link: "https://discord.gg/g3mG2gYjZD",
					linkColor: "primary",
					link2: "",
					link2Text: "",
					link2Color: "",
					rulesLink: "https://viossadiskordserver.github.io/rules",
					image: discordImg,
					alt: "surat o Diskord",
					joinText: "wekatutsa",
					rulesText: "musra",
				},
				vikoli: {
					// TODO: translate to wodox
					category: "learning",
					title: "Vikoli",
					subtitle: "Shirulehti Vilanta.",
					desc: "Yam na Vikoli mangge lerakran au shakaiting. Mena, afto zelehti brukena haaste grun mono bruk Viossa. Bra kran per Viossadjin ke vill maha shiruzma sui plubra os na opetadjin ke vill maha opetatropos plusimper met opetakran.",
					link: "https://vikoli.org/Huomilehti",
					linkColor: "primary",
					link2: "",
					link2Text: "",
					link2Color: "",
					rulesLink: "",
					image: flakkaImg,
					alt: "Flakka fu Viossa",
					joinText: "Suha",
					rulesText: "",
				},
				daviSpil: {
					// TODO: translate to wodox
					category: "cultural",
					title: "Davi Spil",
					subtitle: "Server per spildjin ke hanu Viossa.",
					desc: "Viossa Spilserver.\n\nDavi Spil tak spilhuomi fu Viossadjin. Mangge spil yam hjer: Shahtamaha, Piik, Taikafesta, au Sakana (Viossatjesu) prosta na tatoeba.",
					link: "https://discord.gg/6QgRhw5DRJ",
					linkColor: "primary",
					link2: "",
					link2Text: "",
					link2Color: "",
					rulesLink: "",
					image: discordImg,
					alt: "surat o Diskord",
					joinText: "wekatutsa",
					rulesText: "",
				},
				vimivera2025: {
					// TODO: translate to wodox
					category: "cultural",
					title: "Paemliber Vimivera 2025",
					subtitle: "Paemara sentakujena Vimivera 2025 Paemtuvat kara.",
					desc: "",
					link: "/Vimivera_2025_Paemara_Sentakuena.pdf",
					linkColor: "primary",
					link2: "",
					link2Text: "",
					link2Color: "",
					rulesLink: "",
					image: vimiveraImg,
					alt: "Paemliber Vimivera 2025 Kara",
					joinText: "Lesa",
					rulesText: "",
				},
				korohtella: {
					// TODO: translate to wodox
					category: "cultural",
					title: "Korohtella",
					subtitle: "Viliid",
					desc: "Lesteshiruena Viossaliidklaani, Djima kara. Ain kokorodai liidtumam, jokku mahajena au jokku kjannosena.",
					link: "https://open.spotify.com/album/0skzWl5HU7ulKPm7qGssAX?si=jYzB26xSRE6m3C0LYYNWNw",
					linkColor: "success",
					link2: "https://www.youtube.com/watch?v=KsmTrqJFtjo&list=OLAK5uy_n2GcJf52fbN7nYB3PDCO-oWXEFV4Jdcrk",
					link2Text: "Anhore na YouTube",
					link2Color: "danger",
					rulesLink: "",
					image: korohtella,
					alt: "Korohtella album kara",
					joinText: "Anhore na Spotify",
					rulesText: "",
				},
				piik: {
					// TODO: translate to wodox
					category: "cultural",
					title: "Peak — ViPIIK",
					subtitle: "Piik",
					desc: "Vikjannos per Piikspil. Ima tshangki na glossa fu vi.",
					link: "https://thunderstore.io/c/peak/p/vimik/ViPIIK/",
					linkColor: "primary",
					link2: "",
					link2Text: "",
					link2Color: "",
					rulesLink: "",
					image: piikImg,
					alt: "ViPIIK mod",
					joinText: "Zedvera",
					rulesText: "",
				},
			},
		},
	},
	kotoba: {
		title: "zalkuketutsa mot o viosox mit il o omni falmot",
		searchHelp: "ibe tastatukun il falmot o mot o viosox po pam, de zalkuketukun.",
	},
} as const satisfies DeepPartial<Locale>;