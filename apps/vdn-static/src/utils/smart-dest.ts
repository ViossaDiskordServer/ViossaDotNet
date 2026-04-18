import type { RouteNamedMap } from "vue-router/auto-routes";

export type SmartDest =
	| { type: "internal"; internal: SmartInternalDest }
	| { type: "external"; external: SmartExternalDest };

export type SmartInternalDest =
	| { route: keyof RouteNamedMap; id?: string }
	| { route?: keyof RouteNamedMap; id: string };

export type SmartExternalDest = `https://${string}` | `http://${string}`;
