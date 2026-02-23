import viossaFlag from "@/assets/flag_vp.webp";
import wodoxFlag from "@/assets/flag_wp.webp";

export type VilanticId = "viossa" | "wodox";

export const VILANTIC_ID_TO_FLAG = {
	viossa: viossaFlag,
	wodox: wodoxFlag,
} as const satisfies Record<VilanticId, string>;
