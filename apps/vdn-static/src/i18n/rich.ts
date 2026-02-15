import type { Slot } from "./marker";
import type { SmartLinkProps } from "@/components/atoms/SmartLink";

const richTextSymbol: unique symbol = Symbol("richText");
export interface RichText {
	[richTextSymbol]: true;
	parts: RichTextPart[];
}

export function rich(...parts: RichTextPart[]): RichText {
	return { [richTextSymbol]: true, parts };
}

export type RichTextPart =
	| string
	| { type: "bold"; bold: RichTextPart[] }
	| { type: "italic"; italic: RichTextPart[] };

export function bold(
	...content: RichTextPart[]
): RichTextPart & { type: "bold" } {
	return { type: "bold", bold: content };
}

export function italic(
	...content: RichTextPart[]
): RichTextPart & { type: "italic" } {
	return { type: "italic", italic: content };
}

const richTemplateSymbol: unique symbol = Symbol("richTemplate");
export interface RichTemplate<SlotName extends string> {
	[richTemplateSymbol]: true;
	parts: RichTemplatePart<SlotName>[];
}

export type RichTemplatePart<SlotName extends string> =
	| string
	| { type: "bold"; bold: RichTemplatePart<SlotName>[] }
	| { type: "italic"; italic: RichTemplatePart<SlotName>[] }
	| {
			type: "link";
			link: {
				children: RichTemplatePart<SlotName>[];
				props: SmartLinkProps;
			};
	  }
	| Slot<SlotName>;

export function richT<SlotName extends string>(
	...parts: RichTemplatePart<SlotName>[]
): RichTemplate<SlotName> {
	return { [richTemplateSymbol]: true, parts };
}

export function isRichT(value: unknown): value is RichTemplate<string> {
	return (
		value !== null
		&& typeof value === "object"
		&& richTemplateSymbol in value
	);
}

export function boldT<SlotName extends string>(
	...children: [RichTemplatePart<SlotName>, ...RichTemplatePart<SlotName>[]]
): RichTemplatePart<SlotName> & { type: "bold" } {
	return { type: "bold", bold: children };
}

export function italicT<SlotName extends string>(
	...children: [RichTemplatePart<SlotName>, ...RichTemplatePart<SlotName>[]]
): RichTemplatePart<SlotName> & { type: "italic" } {
	return { type: "italic", italic: children };
}

export function linkT<SlotName extends string>(ctx: {
	children: [RichTemplatePart<SlotName>, ...RichTemplatePart<SlotName>[]];
	props: SmartLinkProps;
}): RichTemplatePart<SlotName> & { type: "link" } {
	return { type: "link", link: ctx };
}
