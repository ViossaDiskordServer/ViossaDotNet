import type { Result } from "@/utils/types";
import {
	FluentBundle,
	FluentResource,
	type FluentVariable,
} from "@fluent/bundle";
import { unsafeAsync } from "@/utils/unsafe";
import type { Literal, Message, Pattern } from "@fluent/bundle/esm/ast";

export async function loadFluentBundle(
	localeId: string,
	src: string,
): Promise<Result<FluentBundle, string>> {
	const ftlFileResponseRes = await unsafeAsync(() => fetch(src));
	if (ftlFileResponseRes.type === "err") {
		return { type: "err", err: `Failed to fetch locale from src: ${src}` };
	}

	const ftlFileResponse = ftlFileResponseRes.ok;
	const ftlFileTextRes = await unsafeAsync(() => ftlFileResponse.text());
	if (ftlFileTextRes.type === "err") {
		return {
			type: "err",
			err: `Failed to fetch text content of FTL file from src: ${src}`,
		};
	}

	const ftlFileText = ftlFileTextRes.ok;
	console.log(ftlFileText);
	const resource = new FluentResource(ftlFileText);

	console.log(resource.body);

	const bundle = new FluentBundle(localeId);
	const errors = bundle.addResource(resource);
	if (errors.length > 0) {
		return {
			type: "err",
			err: `Failed to add Fluent resource to bundle:\n${errors.join("\n")}`,
		};
	}

	return { type: "ok", ok: bundle };
}

export type L10nRecord = {
	[id: string]:
		| { type: "message"; message: Message }
		| { type: "subrecord"; subrecord: L10nRecord };
};

export interface UncompiledLocale {
	bundle: FluentBundle;
	record: L10nRecord;
}

export function bundleToUncompiledLocale(
	bundle: FluentBundle,
): Result<UncompiledLocale, string> {
	const record: L10nRecord = {};
	for (const [id, message] of bundle._messages) {
		const idChain = id.split("-");
		let subrecord = record;

		while (true) {
			const subId = idChain.shift();
			if (subId === undefined) {
				return {
					type: "err",
					err: `Reached end of message ID chain before terminating for message ID: ${id}`,
				};
			}

			if (idChain.length === 0) {
				subrecord[subId] = { type: "message", message };
				break;
			} else {
				const maybeSubrecord = (subrecord[subId] ??= {
					type: "subrecord",
					subrecord: {},
				});

				if (maybeSubrecord.type === "subrecord") {
					subrecord = maybeSubrecord.subrecord;
				} else {
					return {
						type: "err",
						err: `Found message when expected subrecord for message ID: ${id} @ subId: ${subId}`,
					};
				}
			}
		}
	}

	return { type: "ok", ok: { bundle, record } };
}

export type SelectionChain = (Literal | SelectionChain)[];

export function selectionChainToString(chain: SelectionChain): string {
	return chain
		.map((part) => {
			if ("type" in part) {
				switch (part.type) {
					case "str": {
						return `[${part.value}]`;
					}
					case "num": {
						return `[${String(part.value)};${String(part.precision)}]`;
					}
				}
			}

			return `(${selectionChainToString(part)})`;
		})
		.join("+");
}

interface PatternVariant {
	selectionChain: SelectionChain;
	string: string;
}

export function computeAllVariants(
	pattern: Pattern,
): Result<PatternVariant[], string> {
	if (typeof pattern === "string") {
		return { type: "ok", ok: [{ selectionChain: [], string: pattern }] };
	}

	let variants: PatternVariant[] = [{ selectionChain: [], string: "" }];
	console.log(pattern);
	for (const element of pattern) {
		if (typeof element === "string") {
			variants = variants.map((variant) => ({
				selectionChain: variant.selectionChain,
				string: variant.string + element,
			}));

			continue;
		}

		switch (element.type) {
			case "select": {
				const selectVariants: PatternVariant[] = [];
				for (const selectVariant of element.variants) {
					const variantComputedRes = computeAllVariants(
						selectVariant.value,
					);

					if (variantComputedRes.type === "err") {
						return {
							type: "err",
							err: `Failed to compute select variants:\n${variantComputedRes.err}`,
						};
					}

					const variantComputed = variantComputedRes.ok;
					selectVariants.push(
						...variantComputed.map(
							(v): PatternVariant => ({
								selectionChain: [
									selectVariant.key,
									...v.selectionChain,
								],
								string: v.string,
							}),
						),
					);
				}

				variants = variants.flatMap((variant) =>
					selectVariants.map(
						(selectVariant): PatternVariant => ({
							selectionChain: [
								...variant.selectionChain,
								selectVariant.selectionChain,
							],
							string: variant.string + selectVariant.string,
						}),
					),
				);

				break;
			}
			case "var": {
				// used as a stand-in for runtime-provided values
				const DUMMY_STRING = "$$$";

				variants = variants.map((variant) => ({
					selectionChain: variant.selectionChain,
					string: variant.string + DUMMY_STRING,
				}));

				break;
			}
			case "str": {
				variants = variants.map((variant) => ({
					selectionChain: variant.selectionChain,
					string: variant.string + element.value,
				}));
				break;
			}
			default: {
				return {
					type: "err",
					err: `Unhandled PatternElement type: ${element.type}`,
				};
			}
		}
	}

	return { type: "ok", ok: variants };
}
