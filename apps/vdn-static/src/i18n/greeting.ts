export interface Greeting {
	title: string;
	subtitle: string;
}

export const GREETINGS = [
	{
		title: "BRÅTULA VIOSSA.NET MÅDE",
		subtitle: "Hadjiplas per lera para Viossa – glossa fu vi",
	},
	{
		title: "akka po viossa.net!",
		subtitle: "kenomasufobo o gen wi tropos o viosox",
	},
] as const satisfies Greeting[];
