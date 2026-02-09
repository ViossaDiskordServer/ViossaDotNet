import type { Locale } from "@/i18n/locale";
import flakkaImg from "@/assets/flakka.png";
import type { DeepPartial } from "@/utils/deep-partial";

export default {
	localeName: "Viossa",
	home: {
		layout: {
			data: {
				whatIsViossa: {
					title: "Kafaen afto Viossa",
					text: "Viossa tte glossa mahena grun vi nai vil fshtojena na bakadjin, grun vi svinnur ja! De aldjin zovti lera ne",
					image: flakkaImg,
					alt: "Flag of the Viossa Language",
				},
			},
		},
	},
} as const satisfies DeepPartial<Locale>;
