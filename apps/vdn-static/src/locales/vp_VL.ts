import type { Locale } from "@/i18n/locale";
import flakkaImg from "@/assets/flakka.png";

export default {
	props: {
		name: "Viossa",
		dir: "ltr",
		code: "vp",
	},
	navbar: {
		whatIsViossa: "Ka Viossa?",
		resources: "Viktijena",
		kotoba: "Kotoba",
	},
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
	resourcesPage: { title: "", },
	resources: { layout: null, data: { discord: null } },
	kotoba: { title: "", },
} as const satisfies Locale;
