import type {
	SmartDest,
	SmartExternalDest,
	SmartInternalDest,
} from "@/utils/smart-dest";
import type { Result } from "@/utils/types";
import type { RouteNamedMap } from "vue-router/auto-routes";
import { routes } from "vue-router/auto-routes";

export interface Markdown<Slot extends string = string> {
	elements: MarkdownElement<Slot>[];
	slots: Slot[];
}

export type MarkdownElement<Slot extends string = string> =
	| { type: "paragraph"; paragraph: { spans: MarkdownSpan<Slot>[] } }
	| { type: "header"; header: { spans: MarkdownSpan<Slot>[] } }
	| { type: "ulist"; ulist: { items: MarkdownSpan<Slot>[][] } };

type MarkdownLine<Slot extends string = string> = {
	type: "paragraph" | "header" | "ulistItem";
	spans: MarkdownSpan<Slot>[];
};

export type MarkdownFeature = "header" | "ulist" | "italic" | "bold" | "link";

export type MarkdownSpan<Slot extends string = string> =
	| { type: "plain"; plain: string }
	| { type: "italic"; italic: MarkdownSpan[] }
	| { type: "bold"; bold: MarkdownSpan[] }
	| {
			type: "link";
			link: { label: MarkdownSpan[]; to: SmartDest; newTab: boolean };
	  }
	| { type: "slot"; slot: Slot };

export function parseMarkdown<Slot extends string>(
	markdownString: string,
	slots: readonly Slot[],
): Result<Markdown<Slot>, string> {
	const linesRes = parseMarkdownLines(markdownString, slots);
	if (linesRes.type === "err") {
		return linesRes;
	}

	const lines = linesRes.ok;
	const elements: MarkdownElement<Slot>[] = [];
	while (true) {
		const line = lines.shift();
		if (line === undefined) {
			break;
		}

		const element = ((): MarkdownElement<Slot> => {
			switch (line.type) {
				case "paragraph": {
					return {
						type: "paragraph",
						paragraph: { spans: line.spans },
					};
				}
				case "header": {
					return { type: "header", header: { spans: line.spans } };
				}
				case "ulistItem": {
					const items: MarkdownSpan<Slot>[][] = [line.spans];
					while (true) {
						const peekLine = lines[0];
						if (
							peekLine === undefined
							|| peekLine.type !== "ulistItem"
						) {
							break;
						}

						items.push(peekLine.spans);
						lines.shift();
					}

					return { type: "ulist", ulist: { items } };
				}
			}
		})();

		elements.push(element);
	}

	return { type: "ok", ok: { elements, slots: [...slots] } };
}

function parseMarkdownLines<Slot extends string>(
	markdownString: string,
	slots: readonly Slot[],
): Result<MarkdownLine<Slot>[], string> {
	if (markdownString.trim() === "--") {
		return { type: "ok", ok: [] };
	}

	const lines = markdownString.split("\n");
	const dequotedLines: string[] = [];
	for (const line of lines) {
		const MARKDOWN_LINE_AFFIX = '"';
		if (!line.startsWith(MARKDOWN_LINE_AFFIX)) {
			return {
				type: "err",
				err: `Line ${String(dequotedLines.length + 1)} of markdown must start with ${MARKDOWN_LINE_AFFIX}`,
			};
		}

		if (!line.endsWith(MARKDOWN_LINE_AFFIX)) {
			return {
				type: "err",
				err: `Line ${String(dequotedLines.length + 1)} of markdown must end with ${MARKDOWN_LINE_AFFIX}`,
			};
		}

		const deprefixed = line.substring(MARKDOWN_LINE_AFFIX.length);
		const dequoted = deprefixed.substring(
			0,
			deprefixed.length - MARKDOWN_LINE_AFFIX.length,
		);

		dequotedLines.push(dequoted);
	}

	const markdownLines: MarkdownLine<Slot>[] = [];
	for (const line of dequotedLines) {
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

	return { type: "ok", ok: markdownLines };
}

function parseMarkdownLine<Slot extends string>(
	line: string,
	slots: readonly Slot[],
): Result<MarkdownLine<Slot>, string> {
	interface ResolvedLine {
		deprefixedLine: string;
		type: MarkdownLine["type"];
	}

	const { deprefixedLine, type } = ((): ResolvedLine => {
		if (line.startsWith("#")) {
			return { deprefixedLine: line.substring(1), type: "header" };
		} else if (line.startsWith("-")) {
			return { deprefixedLine: line.substring(1), type: "ulistItem" };
		} else {
			return { deprefixedLine: line, type: "paragraph" };
		}
	})();

	const spansRes = parseMarkdownSpans(deprefixedLine, slots);

	if (spansRes.type === "err") {
		return {
			type: "err",
			err: `While parsing ${type} spans:\n${spansRes.err}`,
		};
	}

	const spans = spansRes.ok;
	return { type: "ok", ok: { type, spans } };
}

function parseMarkdownSpans<Slot extends string>(
	line: string,
	slots: readonly Slot[],
): Result<MarkdownSpan<Slot>[], string> {
	if (line.startsWith("#")) {
		// subheaders may be supported in the future,
		// so ignoring them or treating them as h1 headers now would be a breaking change when
		// subheader support is implemented.
		// making subheaders a compile error for now ensures
		// all current i18n is backwards-compatible when/if they are implemented
		return { type: "err", err: "Subheaders are not supported." };
	}

	const chars = line.split("");
	const spansRes = readMarkdownSpans(
		chars,
		slots,
		ParseMarkdownSpansManager.new(),
	);

	if (spansRes.type === "err") {
		return spansRes;
	}

	const spans = spansRes.ok;

	return { type: "ok", ok: spans };
}

class ParseMarkdownSpansManager {
	private inItalic: boolean;
	private inBold: boolean;

	private constructor() {
		this.inItalic = false;
		this.inBold = false;
	}

	public static new(): ParseMarkdownSpansManager {
		return new this();
	}

	public tryUseItalic<R>(f: () => Result<R, string>): Result<R, string> {
		if (this.inItalic) {
			return {
				type: "err",
				err: "Cannot nest italic span (*) inside of another italic span",
			};
		}

		this.inItalic = true;

		const fRes = f();
		if (fRes.type === "err") {
			return fRes;
		}

		this.inItalic = false;

		const fOk = fRes.ok;
		return { type: "ok", ok: fOk };
	}

	public tryUseBold<R>(f: () => Result<R, string>): Result<R, string> {
		if (this.inBold) {
			return {
				type: "err",
				err: "Cannot nest bold span (**) inside of another bold span",
			};
		}

		this.inBold = true;

		const fRes = f();
		if (fRes.type === "err") {
			return fRes;
		}

		this.inBold = false;

		const fOk = fRes.ok;
		return { type: "ok", ok: fOk };
	}
}

function readMarkdownSpans<Slot extends string>(
	chars: string[],
	slots: readonly Slot[],
	manager: ParseMarkdownSpansManager,
): Result<MarkdownSpan<Slot>[], string> {
	const spans: MarkdownSpan<Slot>[] = [];
	while (true) {
		const spanRes = readMarkdownSpan(chars, slots, manager);
		if (spanRes.type === "err") {
			return spanRes;
		}

		const span = spanRes.ok;
		if (span === undefined) {
			break;
		}

		spans.push(span);
	}

	return { type: "ok", ok: spans };
}

function readMarkdownSpan<Slot extends string>(
	chars: string[],
	slots: readonly Slot[],
	manager: ParseMarkdownSpansManager,
): Result<MarkdownSpan<Slot> | undefined, string> {
	const [firstChar, secondChar, thirdChar] = chars;
	if (firstChar === undefined) {
		return { type: "ok", ok: undefined };
	} else if (firstChar === "<") {
		return readMarkdownSpanSlot(chars, slots);
	} else if (firstChar === "[") {
		return readMarkdownSpanLink(chars, slots, manager);
	} else if (firstChar === "*") {
		if (secondChar !== "*") {
			return readMarkdownSpanItalic(chars, slots, manager);
		}

		if (thirdChar !== "*") {
			return readMarkdownSpanBold(chars, slots, manager);
		}

		return readMarkdownSpanBoldItalic(chars, slots, manager);
	} else {
		return readMarkdownSpanPlain(chars);
	}
}

function isInArray<T, U extends T>(value: T, array: readonly U[]): value is U {
	// SAFETY: this is just an equality check, it is safe to pass in any value
	return array.includes(value as U);
}

function readMarkdownSpanSlot<Slot extends string>(
	chars: string[],
	slots: readonly Slot[],
): Result<MarkdownSpan<Slot>, string> {
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

	return { type: "ok", ok: { type: "slot", slot: slotName } };
}

function readMarkdownSpanLink<Slot extends string>(
	chars: string[],
	slots: readonly Slot[],
	manager: ParseMarkdownSpansManager,
): Result<MarkdownSpan<Slot>, string> {
	const openSquareRes = expectReadChar(chars, "[");
	if (openSquareRes.type === "err") {
		return openSquareRes;
	}

	const labelElementsRes = readMarkdownSpans(chars, slots, manager);
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

	const resolvedLabel: MarkdownSpan[] =
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
		ok: { type: "link", link: { label: resolvedLabel, to: dest, newTab } },
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

function readMarkdownSpanItalic<Slot extends string>(
	chars: string[],
	slots: readonly Slot[],
	manager: ParseMarkdownSpansManager,
): Result<MarkdownSpan<Slot>, string> {
	return manager.tryUseItalic(() => {
		const singleStarRes = expectReadString(chars, "*");
		if (singleStarRes.type === "err") {
			return singleStarRes;
		}

		const spans: MarkdownSpan<Slot>[] = [];
		let closed = false;
		while (true) {
			const spanRes = readMarkdownSpan(chars, slots, manager);
			if (spanRes.type === "err") {
				return spanRes;
			}

			const span = spanRes.ok;
			if (span === undefined) {
				break;
			}

			spans.push(span);

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

		if (!closed) {
			return { type: "err", err: "Italic span (*) is never closed" };
		}

		return { type: "ok", ok: { type: "italic", italic: spans } };
	});
}

function readMarkdownSpanBold<Slot extends string>(
	chars: string[],
	slots: readonly Slot[],
	manager: ParseMarkdownSpansManager,
): Result<MarkdownSpan<Slot>, string> {
	return manager.tryUseBold(() => {
		const doubleStarRes = expectReadString(chars, "**");
		if (doubleStarRes.type === "err") {
			return doubleStarRes;
		}

		const spans: MarkdownSpan<Slot>[] = [];
		let closed = false;
		while (true) {
			const spanRes = readMarkdownSpan(chars, slots, manager);
			if (spanRes.type === "err") {
				return spanRes;
			}

			const span = spanRes.ok;
			if (span === undefined) {
				break;
			}

			spans.push(span);
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

		if (!closed) {
			return { type: "err", err: "Bold span (**) is never closed" };
		}

		return { type: "ok", ok: { type: "bold", bold: spans } };
	});
}

function readMarkdownSpanBoldItalic<Slot extends string>(
	chars: string[],
	slots: readonly Slot[],
	manager: ParseMarkdownSpansManager,
): Result<MarkdownSpan<Slot>, string> {
	return manager.tryUseBold(() =>
		manager.tryUseItalic(() => {
			const tripleStarRes = expectReadString(chars, "***");
			if (tripleStarRes.type === "err") {
				return tripleStarRes;
			}

			const spans: MarkdownSpan<Slot>[] = [];
			let closed = false;
			while (true) {
				const spanRes = readMarkdownSpan(chars, slots, manager);
				if (spanRes.type === "err") {
					return spanRes;
				}

				const span = spanRes.ok;
				if (span === undefined) {
					break;
				}

				spans.push(span);
				const [firstChar, secondChar, thirdChar] = chars;
				if (
					firstChar === "*"
					&& secondChar === "*"
					&& thirdChar === "*"
				) {
					chars.shift();
					chars.shift();
					chars.shift();
					closed = true;
					break;
				} else if (firstChar === undefined) {
					closed = false;
					break;
				}
			}

			if (!closed) {
				return {
					type: "err",
					err: "Bold italic span (***) is never closed",
				};
			}

			return {
				type: "ok",
				ok: { type: "bold", bold: [{ type: "italic", italic: spans }] },
			};
		}),
	);
}

function readMarkdownSpanPlain<Slot extends string>(
	chars: string[],
): Result<MarkdownSpan<Slot> | undefined, string> {
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
		ok: plain.length === 0 ? undefined : { type: "plain", plain },
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

	return markdown.elements.length === 0;
}
