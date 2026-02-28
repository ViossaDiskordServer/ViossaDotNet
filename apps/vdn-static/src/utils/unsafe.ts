import type { Result } from "./types";

export async function unsafeAsync<R>(
	f: () => Promise<R>,
): Promise<Result<R, unknown>> {
	try {
		return { type: "ok", ok: await f() };
	} catch (e) {
		return { type: "err", err: e };
	}
}
