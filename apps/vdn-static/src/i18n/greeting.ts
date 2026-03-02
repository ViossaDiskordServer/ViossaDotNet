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
		title: "Bratulla Viossa.net made!",
		subtitle: "Hadjiplas per lera Viossa para.",
		author: "Maikaelja",
		lang: "viossa",
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
		author: "Nikomiko",
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
	{
		title: "GLAUDAI TULANA NA viossa.net ALJIN",
		subtitle: "Nintenca au glauca na lerana Viossa",
		author: "Delvjin",
		lang: "viossa",
	},
	{
		title: "글라우다이 툴라나 나 viossa.net 알진",
		subtitle: "닌텐차 아우 글라우차 나 을레라나 삐옷사",
		author: "Delvjin",
		lang: "viossa",
	},
	{
		title: "Брацатулла на viossa.net",
		subtitle: "Фуралегти виланта",
		author: "Nikomiko",
		lang: "viossa",
	},
	{
		title: "Bratulaca na viossa.net!",
		subtitle: "Da lera cui Viossa au da nintendo!",
		author: "Luna",
		lang: "viossa",
	},
] as const satisfies Greeting[];
