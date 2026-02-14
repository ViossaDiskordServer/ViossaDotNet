import type { RouteNamedMap } from "vue-router/auto-routes";

export type SmartDest =
	| { type: "internal"; internal: SmartInternalDest }
	| { type: "external"; external: SmartExternalDest };

export type SmartInternalDest = keyof RouteNamedMap;
export type SmartExternalDest = `https://${string}` | `http://${string}`;
