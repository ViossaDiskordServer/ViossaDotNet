import { type LocaleMask } from "@/i18n/locale";
import type { DeepPartial } from "@/utils/types";

export default {
	localeName: "Viossa",
	home: {
		sections: {
			whatIsViossa: {
				title: "Kafaen afto Viossa",
				text: "Viossa tte glossa mahena grun vi nai vil fshtojena na bakadjin, grun vi svinnur ja! De aldjin zovti lera ne",
			},
		},
	},
} as const satisfies DeepPartial<LocaleMask>;
