import type {
	SmartDest,
	SmartExternalDest,
	SmartInternalDest,
} from "@/utils/smart-dest";
import type { Result } from "@/utils/types";
import type { RouteNamedMap } from "vue-router/auto-routes";
import { routes } from "vue-router/auto-routes";

export interface Markdown<Slot extends string = string> {
	lines: MarkdownLine<Slot>[];
	slots: Slot[];
}

export type MarkdownLine<Slot extends string = string> = {
	type: "paragraph" | "header";
	elements: MarkdownLineElement<Slot>[];
};

export type MarkdownFeature =
	| Exclude<MarkdownLine["type"], "paragraph">
	| Exclude<MarkdownLineElement["type"], "plain">;

export type MarkdownLineElement<Slot extends string = string> =
	| { type: "plain"; plain: string }
	| { type: "italic"; italic: MarkdownLineElement[] }
	| { type: "bold"; bold: MarkdownLineElement[] }
	| {
			type: "link";
			link: {
				label: MarkdownLineElement[];
				to: SmartDest;
				newTab: boolean;
			};
	  }
	| { type: "slot"; slot: Slot };

export function parseMarkdown<Slot extends string>(
	markdownString: string,
	slots: readonly Slot[],
): Result<Markdown<Slot>, string> {
	if (markdownString === "|~") {
		return { type: "ok", ok: { lines: [], slots: [] } };
	}

	const lines = markdownString.split("\n");
	const strippedLines: string[] = [];
	for (const line of lines) {
		const MARKDOWN_LINE_PREFIX = "| ";
		if (!line.startsWith(MARKDOWN_LINE_PREFIX)) {
			return {
				type: "err",
				err: `Line ${String(strippedLines.length + 1)} of markdown is not prefixed`,
			};
		}

		strippedLines.push(line.substring(MARKDOWN_LINE_PREFIX.length));
	}

	const markdownLines: MarkdownLine<Slot>[] = [];
	for (const line of strippedLines) {
		const markdownLineRes = parseMarkdownLine(line, slots);
		if (markdownLineRes.type === "err") {
			return {
				type: "err",
				err: `On line ${String(markdownLines.length + 1)}:\n${markdownLineRes.err}`,
			};
		}

		const markdownLine = markdownLineRes.ok;
		markdownLines.push(markdownLine);
	}

	return { type: "ok", ok: { lines: markdownLines, slots: [...slots] } };
}

function parseMarkdownLine<Slot extends string>(
	line: string,
	slots: readonly Slot[],
): Result<MarkdownLine<Slot>, string> {
	if (line.startsWith("#")) {
		const elementsRes = parseMarkdownLineElements(line.substring(1), slots);

		if (elementsRes.type === "err") {
			return {
				type: "err",
				err: `While parsing elements:\n${elementsRes.err}`,
			};
		}

		const elements = elementsRes.ok;
		return { type: "ok", ok: { type: "header", elements } };
	}

	const elementsRes = parseMarkdownLineElements(line, slots);
	if (elementsRes.type === "err") {
		return {
			type: "err",
			err: `While parsing elements:\n${elementsRes.err}`,
		};
	}

	const elements = elementsRes.ok;
	return { type: "ok", ok: { type: "paragraph", elements } };
}

function parseMarkdownLineElements<Slot extends string>(
	line: string,
	slots: readonly Slot[],
): Result<MarkdownLineElement<Slot>[], string> {
	if (line.startsWith("#")) {
		// subheaders may be supported in the future,
		// so ignoring them or treating them as h1 headers now would be a breaking change when
		// subheader support is implemented.
		// making subheaders a compile error for now ensures
		// all current i18n is backwards-compatible when/if they are implemented
		return { type: "err", err: "Subheaders are not supported." };
	}

	const trimmedLine = line.trim();
	const chars = trimmedLine.split("");
	const elementsRes = readMarkdownLineElements(chars, slots, {
		inItalic: false,
		inBold: false,
	});
	if (elementsRes.type === "err") {
		return elementsRes;
	}

	const elements = elementsRes.ok;
	return { type: "ok", ok: elements };
}

interface ReadMarkdownLineElementCtx {
	inItalic: boolean;
	inBold: boolean;
}

function readMarkdownLineElements<Slot extends string>(
	chars: string[],
	slots: readonly Slot[],
	ctx: ReadMarkdownLineElementCtx,
): Result<MarkdownLineElement<Slot>[], string> {
	const elements: MarkdownLineElement<Slot>[] = [];
	while (true) {
		const elementRes = readMarkdownLineElement(chars, slots, ctx);
		if (elementRes.type === "err") {
			return elementRes;
		}

		const element = elementRes.ok;
		if (element.length === 0) {
			break;
		}

		elements.push(...element);
	}

	return { type: "ok", ok: elements };
}

function readMarkdownLineElement<Slot extends string>(
	chars: string[],
	slots: readonly Slot[],
	ctx: ReadMarkdownLineElementCtx,
): Result<MarkdownLineElement<Slot>[], string> {
	const [firstChar, secondChar] = chars;
	if (firstChar === undefined) {
		return { type: "ok", ok: [] };
	} else if (firstChar === "<") {
		return readMarkdownLineElementSlot(chars, slots);
	} else if (firstChar === "[") {
		return readMarkdownLineElementLink(chars, slots, ctx);
	} else if (firstChar === "*" && secondChar === "*" && !ctx.inBold) {
		return readMarkdownLineElementBold(chars, slots, ctx);
	} else if (firstChar === "*" && secondChar !== "*" && !ctx.inItalic) {
		return readMarkdownLineElementItalic(chars, slots, ctx);
	} else {
		return readMarkdownLineElementPlain(chars);
	}
}

function isInArray<T, U extends T>(value: T, array: readonly U[]): value is U {
	// SAFETY: this is just an equality check, it is safe to pass in any value
	return array.includes(value as U);
}

function readMarkdownLineElementSlot<Slot extends string>(
	chars: string[],
	slots: readonly Slot[],
): Result<MarkdownLineElement<Slot>[], string> {
	const openAngleRes = expectReadChar(chars, "<");
	if (openAngleRes.type === "err") {
		return openAngleRes;
	}

	const slotNameRes = readUntilClosing({
		chars,
		elementName: "slot",
		closingChar: ">",
	});

	if (slotNameRes.type === "err") {
		return slotNameRes;
	}

	const slotName = slotNameRes.ok;
	if (!isInArray(slotName, slots)) {
		return { type: "err", err: `Unexpected slot name: ${slotName}` };
	}

	return { type: "ok", ok: [{ type: "slot", slot: slotName }] };
}

function readMarkdownLineElementLink<Slot extends string>(
	chars: string[],
	slots: readonly Slot[],
	ctx: ReadMarkdownLineElementCtx,
): Result<MarkdownLineElement<Slot>[], string> {
	const openSquareRes = expectReadChar(chars, "[");
	if (openSquareRes.type === "err") {
		return openSquareRes;
	}

	const labelElementsRes = readMarkdownLineElements(chars, slots, ctx);
	if (labelElementsRes.type === "err") {
		return labelElementsRes;
	}

	const closeSquareRes = expectReadChar(chars, "]");
	if (closeSquareRes.type === "err") {
		return closeSquareRes;
	}

	const labelElements = labelElementsRes.ok;
	const openParenRes = expectReadChar(chars, "(");
	if (openParenRes.type === "err") {
		return openParenRes;
	}

	interface LinkProps {
		dest: SmartDest;
		newTab: boolean;
	}

	const linkPropsRes = ((): Result<LinkProps, string> => {
		if (peekStringEq(chars, "external")) {
			const externalRes = expectReadString(chars, "external");
			if (externalRes.type === "err") {
				return externalRes;
			}

			const dotRes = expectReadChar(chars, ".");
			if (dotRes.type === "err") {
				return dotRes;
			}

			const tabStringRes = readUntilClosing({
				chars,
				elementName: "link tab",
				closingChar: ":",
			});

			if (tabStringRes.type === "err") {
				return tabStringRes;
			}

			const tabString = tabStringRes.ok;
			const newTabRes = ((): Result<boolean, string> => {
				switch (tabString) {
					case "new": {
						return { type: "ok", ok: true };
					}
					case "replace": {
						return { type: "ok", ok: false };
					}
					default: {
						return {
							type: "err",
							err: `Expected \`replace\` or \`new\`; Found: ${tabString}`,
						};
					}
				}
			})();

			if (newTabRes.type === "err") {
				return newTabRes;
			}

			const newTab = newTabRes.ok;

			const destRes = readUntilClosing({
				chars,
				elementName: "link dest",
				closingChar: ")",
			});

			if (destRes.type === "err") {
				return destRes;
			}

			const dest = destRes.ok;
			const externalDestRes = validateExternalDest(dest);
			if (externalDestRes.type === "err") {
				return externalDestRes;
			}

			const externalDest = externalDestRes.ok;

			return {
				type: "ok",
				ok: {
					dest: { type: "external", external: externalDest },
					newTab,
				},
			};
		} else if (peekStringEq(chars, "internal")) {
			const internalRes = expectReadString(chars, "internal");
			if (internalRes.type === "err") {
				return internalRes;
			}

			const dotRes = expectReadChar(chars, ".");
			if (dotRes.type === "err") {
				return dotRes;
			}

			const tabStringRes = readUntilClosing({
				chars,
				elementName: "link tab",
				closingChar: ":",
			});

			if (tabStringRes.type === "err") {
				return tabStringRes;
			}

			const tabString = tabStringRes.ok;
			const newTabRes = ((): Result<boolean, string> => {
				switch (tabString) {
					case "new": {
						return { type: "ok", ok: true };
					}
					case "replace": {
						return { type: "ok", ok: false };
					}
					default: {
						return {
							type: "err",
							err: `Expected \`replace\` or \`new\`; Found: ${tabString}`,
						};
					}
				}
			})();

			if (newTabRes.type === "err") {
				return newTabRes;
			}

			const newTab = newTabRes.ok;

			const destRes = readUntilClosing({
				chars,
				elementName: "link dest",
				closingChar: ")",
			});

			if (destRes.type === "err") {
				return destRes;
			}

			const dest = destRes.ok;
			const internalDestRes = validateInternalDest(dest);
			if (internalDestRes.type === "err") {
				return internalDestRes;
			}

			const internalDest = internalDestRes.ok;

			return {
				type: "ok",
				ok: {
					dest: { type: "internal", internal: internalDest },
					newTab,
				},
			};
		} else {
			return {
				type: "err",
				err: `Expected external or internal link prefix; Found: "${chars.slice(0, 10).join("")}..."`,
			};
		}
	})();

	if (linkPropsRes.type === "err") {
		return linkPropsRes;
	}

	const { dest, newTab } = linkPropsRes.ok;

	const resolvedLabel: MarkdownLineElement[] =
		labelElements.length === 0 ?
			[
				{
					type: "plain",
					plain:
						dest.type === "external" ?
							dest.external
						:	`${window.location.protocol}${window.location.hostname}${dest.internal.route ?? window.location.pathname}${dest.internal.id === undefined ? "" : `#${dest.internal.id}`}`,
				},
			]
		:	labelElements;

	return {
		type: "ok",
		ok: [
			{ type: "link", link: { label: resolvedLabel, to: dest, newTab } },
		],
	};
}

function validateExternalDest(dest: string): Result<SmartExternalDest, string> {
	const HTTPS_PREFIX = "https://";
	const HTTP_PREFIX = "http://";

	if (dest.startsWith(HTTPS_PREFIX)) {
		return {
			type: "ok",
			ok: `${HTTPS_PREFIX}${dest.substring(HTTPS_PREFIX.length)}`,
		};
	}

	if (dest.startsWith(HTTP_PREFIX)) {
		return {
			type: "ok",
			ok: `${HTTP_PREFIX}${dest.substring(HTTP_PREFIX.length)}`,
		};
	}

	return {
		type: "err",
		err: `External dest must start with https:// or http://`,
	};
}

function validateInternalDest(dest: string): Result<SmartInternalDest, string> {
	const [routeString, id] = dest.split("#");

	const validatedRouteRes = ((): Result<
		keyof RouteNamedMap | undefined,
		string
	> => {
		if (routeString === undefined || routeString.length === 0) {
			return { type: "ok", ok: undefined };
		}

		const route = routes.find((route) => route.path === routeString);
		if (route === undefined) {
			return {
				type: "err",
				err: `Route with ID \`${routeString}\` does not exist`,
			};
		}

		return {
			type: "ok",
			// SAFETY: we validated the route exists in the router about
			ok: route.path as keyof RouteNamedMap,
		};
	})();

	if (validatedRouteRes.type === "err") {
		return validatedRouteRes;
	}

	const validatedRoute = validatedRouteRes.ok;

	if (validatedRoute !== undefined) {
		return { type: "ok", ok: { route: validatedRoute, id } };
	} else if (id !== undefined) {
		return { type: "ok", ok: { route: validatedRoute, id } };
	} else {
		return {
			type: "err",
			err: `Either route or ID must be defined for internal dest`,
		};
	}
}

function readMarkdownLineElementBold<Slot extends string>(
	chars: string[],
	slots: readonly Slot[],
	ctx: ReadMarkdownLineElementCtx,
): Result<MarkdownLineElement<Slot>[], string> {
	const firstStarRes = expectReadChar(chars, "*");
	if (firstStarRes.type === "err") {
		return firstStarRes;
	}

	const secondStarRes = expectReadChar(chars, "*");
	if (secondStarRes.type === "err") {
		return secondStarRes;
	}

	ctx.inBold = true;
	const elements: MarkdownLineElement<Slot>[] = [];
	let closed = false;
	while (true) {
		const elementRes = readMarkdownLineElement(chars, slots, ctx);
		if (elementRes.type === "err") {
			return elementRes;
		}

		const element = elementRes.ok;
		if (element.length === 0) {
			break;
		}

		elements.push(...element);
		const [firstChar, secondChar] = chars;
		if (firstChar === "*" && secondChar === "*") {
			chars.shift();
			chars.shift();
			closed = true;
			break;
		} else if (firstChar === undefined) {
			closed = false;
			break;
		}
	}

	ctx.inBold = !closed;
	if (closed) {
		return { type: "ok", ok: [{ type: "bold", bold: elements }] };
	} else {
		return {
			type: "ok",
			ok: [{ type: "plain", plain: "**" }, ...elements],
		};
	}
}

function readMarkdownLineElementItalic<Slot extends string>(
	chars: string[],
	slots: readonly Slot[],
	ctx: ReadMarkdownLineElementCtx,
): Result<MarkdownLineElement<Slot>[], string> {
	const starRes = expectReadChar(chars, "*");
	if (starRes.type === "err") {
		return starRes;
	}

	ctx.inItalic = true;
	const elements: MarkdownLineElement<Slot>[] = [];
	let closed = false;
	while (true) {
		const elementRes = readMarkdownLineElement(chars, slots, ctx);
		if (elementRes.type === "err") {
			return elementRes;
		}

		const element = elementRes.ok;
		if (element.length === 0) {
			break;
		}

		elements.push(...element);
		const [firstChar] = chars;
		if (firstChar === "*") {
			chars.shift();
			closed = true;
			break;
		} else if (firstChar === undefined) {
			closed = false;
			break;
		}
	}

	ctx.inItalic = !closed;
	if (closed) {
		return { type: "ok", ok: [{ type: "italic", italic: elements }] };
	} else {
		return { type: "ok", ok: [{ type: "plain", plain: "*" }, ...elements] };
	}
}

function readMarkdownLineElementPlain<Slot extends string>(
	chars: string[],
): Result<MarkdownLineElement<Slot>[], string> {
	let plain = "";
	let escaped = false;
	while (true) {
		const peek = chars[0];
		if (peek === undefined) {
			break;
		}

		if (escaped) {
			escaped = false;
		} else {
			if (peek === "\\") {
				escaped = true;
				chars.shift();
				continue;
			}

			if (
				peek === "*"
				|| peek === "<"
				|| peek === ">"
				|| peek === "["
				|| peek === "]"
			) {
				break;
			}
		}

		plain += peek;
		chars.shift();
	}

	return {
		type: "ok",
		ok: plain.length > 0 ? [{ type: "plain", plain }] : [],
	};
}

function expectReadChar(
	chars: string[],
	expectedChar: string,
): Result<void, string> {
	const nextChar = chars.shift();
	if (nextChar !== expectedChar) {
		return {
			type: "err",
			err: `Expected: "${expectedChar}"; Found: ${nextChar === undefined ? "undefined" : `"${nextChar}"`}`,
		};
	}

	return { type: "ok", ok: undefined };
}

function peekStringEq(chars: string[], expectedString: string): boolean {
	return chars.slice(0, expectedString.length).join("") === expectedString;
}

function expectReadString(
	chars: string[],
	expectedString: string,
): Result<void, string> {
	let foundString: string | undefined = undefined;
	for (const expectedChar of expectedString) {
		const nextChar = chars.shift();

		if (nextChar !== undefined) {
			foundString = (foundString ?? "") + nextChar;
		}

		if (expectedChar !== nextChar) {
			return {
				type: "err",
				err: `Expected: "${expectedString}"; Found: ${foundString === undefined ? "undefined" : `"${foundString}"`}`,
			};
		}
	}

	return { type: "ok", ok: undefined };
}

interface ReadUntilClosingCtx {
	chars: string[];
	elementName: string;
	closingChar: string;
}

function readUntilClosing(ctx: ReadUntilClosingCtx): Result<string, string> {
	const { chars, elementName, closingChar } = ctx;

	let value = "";
	let closed = false;
	let escaped = false;
	while (true) {
		const char = chars.shift();
		if (char === undefined) {
			closed = false;
			break;
		}

		if (char === "\\") {
			escaped = true;
			continue;
		}

		if (char === closingChar && !escaped) {
			closed = true;
			break;
		}

		value += char;
	}

	if (!closed) {
		return {
			type: "err",
			err: `Unclosed ${elementName}: <${value.replaceAll(closingChar, `\\${closingChar}`)}`,
		};
	}

	return { type: "ok", ok: value };
}

export function isEmptyMarkdown(markdown: Markdown): boolean {
	// const [firstLine] = markdown.lines;
	// if (firstLine === undefined) {
	// 	return true;
	// }

	// const [firstElement] = firstLine.elements;
	// if (firstElement === undefined) {
	// 	return true;
	// }

	// if (firstElement.type === "plain" && firstElement.plain.length === 0) {
	// 	return true;
	// }

	// return false;

	return markdown.lines.length === 0;
}
