import type { DeepPartialLocale } from "@/i18n";
import { type LocaleMask } from "@/i18n/locale";
import { messagePack } from "@/i18n/marker";

export default messagePack({
	localeName: "Viossa",
	home: messagePack({
		sections: messagePack({
			whatIsViossa: messagePack({
				title: "Kafaen afto Viossa",
				text: "Viossa tte glossa mahena grun vi nai vil fshtojena na bakadjin, grun vi svinnur ja! De aldjin zovti lera ne",
			}),
		}),
	}),
} as const) satisfies DeepPartialLocale<LocaleMask>;
