import { fallback } from "@/i18n/marker";
import { type LocaleMask } from "@/i18n/locale";
import type { DeepPartial } from "@/utils/types";

export default {
	localeName: "wodox",
	vilanticLangs: { viossa: "viosox", wodox: "wodox" },
	navbar: {
		whatIsViossa: "viosox e ano?",
		resources: "tropos",
		kotoba: "mot o viosox",
	},
	home: {
		sections: {
			whatIsViossa: {
				title: "viosox e ano?",
				text: "viosox e hez ox pamzal, zoz stende zalkun tuo mit multa nengwi ox. zal o viosox stende lik zal o hez il ox keta, zalilkun wi tuo mit multa nengwi ox. mono i fal o viosox stendenai; omni axsi o viosox zal nengokun fal o viosox, de falmot wi falax o il stende e keko trenengwi tua o nengwi stende, ge fala e keko lik ro o tuo viosoxsi. genil viosox ibe il wi nengwi stende axkun ge pisakun po tuo ox — stende gen muskunnai mit zaiox.",
				image: { src: fallback, alt: "fomma o viosox" },
			},
			historyOfViossa: {
				title: "zal o viosox",
				text: "wi o zal o viosox stende po multa o Skype wi 2014 ibe stendera o multa r/conlangs o Reddit. zalsi o viosox danzalgo hez, tuo zal o viosox e lik zal o hez il ox keta, zalil tuo ox mit nengwi multa ox ibe zalsi fiemnaikun sama i ox. viosox e nengwi tuo ox pamzal keta; zalilkun keko ox keta mit lik du wi tre ox, aga zalil viosox mit multa wi plus obo o ox na il ox keta ibe zalsi o viosox stende po multa mi o mo.",
				image: { src: fallback, alt: "fomma o viosox" },
			},
			community: {
				title: "viosoxsi",
				text: "nengwi multa ro o viosoxsi stende ibe stendenura po nengwi multa mi o mo ge wekakunnura zai nengwi viosoxsi po jilobo. ibe mono i fal o viosox stendenai ge ibe viosoxsi zalkun nengwi multa fal o viosox, de nengwi zoz ko o ro lik ro o viosoxsi stende po ro o viosa. po multa hez viosoxsi, falmot wi falax o tuo stende stende po ro o tuo stende. ibe mono i fal o viosox stendenai ge ibe ro o mot inkun nengwi po nengwi viosoxsi, de multa stende amanata hez, zal zalgonukun surat au mola au sucik.",
				image: null,
			},
		},
	},
	resources: {
		title: "tropos o gen",
		resources: {
			discord: {
				title: "server o Diskord",
				subtitle: "axilkun ge genilkun po ce! wekatutsa!",
				desc: "danzalil hez server po 2015. ibe dutukun musra po ce, de ibe wiftutsakun dof po pam, de wekatukun po server!",
				image: { src: fallback, alt: "surat o Diskord" },
				buttons: {
					join: { label: "wekatutsa" },
					rules: { label: "musra" },
				},
			},
		},
	},
	kotoba: {
		title: "zalkuketutsa mot o viosox mit il o omni falmot",
		searchHelp:
			"ibe tastatukun il falmot o mot o viosox po pam, de zalkuketukun.",
	},
} as const satisfies DeepPartial<LocaleMask>;
