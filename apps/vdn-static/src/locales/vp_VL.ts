import type { Locale } from "@/i18n/locale";
import flakkaImg from "@/assets/flakka.png";

export default {
	localeName: "Viossa",
	home: {
		layout: null,
		data: {
			whatIsViossa: {
				title: "Kafaen afto Viossa",
				text: "Viossa tte glossa mahena grun vi nai vil fshtojena na bakadjin, grun vi svinnur ja! De aldjin zovti lera ne",
				image: flakkaImg,
				alt: "Flag of the Viossa Language",
			},
			historyOfViossa: null,
			community: null,
		},
	},
	resources: { layout: null, data: { discord: null } },
} as const satisfies Locale;
