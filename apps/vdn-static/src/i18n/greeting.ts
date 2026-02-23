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
	{
		title: "VIOSSA.NET VR̄ATULAŢAJO",
		subtitle: "Hažilɛ̄ti na viɔssalɛɾa! Viɔssa lɛstɛvr̄ā ɡlɔssa﹐tɛndɔţa!",
		author: "Rju",
		lang: "viossa",
	},
	{
		title: "bratsatulla na viossa.net made!",
		subtitle: "Furalehti vilanta",
		author: "Niko",
		lang: "viossa",
	},
	{
		title: "Bratula na viossa.net!",
		subtitle: "Davi lera vjosa medrio!",
		author: "2o3ka",
		lang: "viossa",
	},
	{
		title: "ברא־תולהצה viossa.net מדא!",
		subtitle: "דבֿי לרה איו הנסו שתוף צויתה נא בֿיוסה",
		author: "Visa Chin",
		lang: "viossa",
	},
	{
		title: "Bratullatsa viossa.net made!",
		subtitle: "Leratsa Viossa au letstehal sztof andra derna",
		author: "Visa Chin",
		lang: "viossa",
	},
	{
		title: "BRATULA VIOSSA.NET MADE",
		subtitle: "Hadжilehti pęr ʋjosalera! Nintendotsa",
		author: "Kurokot",
		lang: "viossa",
	},
	{
		title: "бrατuλα αδ viossa.net mαᴅε!!",
		subtitle: "xαᵹιλε̃τι v́ ʋιossα λεrαᴅѥτ! nιnτεnᴅocα nαruγα!",
		author: "Orenge",
		lang: "viossa",
	},
	{
		title: "Bratulla na viossa.net made!",
		subtitle: "Hazsilehti fu viossaklani—yuenttsa na her yo!",
		author: "Zsiyo",
		lang: "viossa",
	},
	{
		title: "Alú ri viossa.net-ssa!",
		subtitle: "Ya vir atuarpik Viossáha druzsai-mais!",
		author: "Zsiyo",
		lang: "minemiaha",
	},
] as const satisfies Greeting[];
