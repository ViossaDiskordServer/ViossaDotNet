import type { VilanticId } from "./vilantic";

export interface Greeting {
	title: string;
	subtitle: string;
	author: string;
	lang: VilanticId;
}

export const GREETINGS = [
	{
		title: "BRÅTULA VIOSSA.NET MÅDE",
		subtitle: "Hadjiplas per lera para Viossa – glossa fu vi",
		author: "Jez",
		lang: "viossa",
	},
	{
		title: "akka po viossa.net!",
		subtitle: "kenomasufobo o gen wi tropos o viosox",
		author: "Tetro",
		lang: "wodox",
	},
] as const satisfies Greeting[];
