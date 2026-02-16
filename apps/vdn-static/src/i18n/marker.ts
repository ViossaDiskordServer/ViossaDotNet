// special symbol to explicitly specify when to fallback to default (en_US) translation
// instead of translating a specific key, which still not being marked as a missing translation.
// can only be used on keys which are typed as being able to use a fallback.
export const fallback: unique symbol = Symbol("fallback");
export type Fallback = typeof fallback;

const templateSymbol: unique symbol = Symbol("template");
export type Template<SlotName extends string> = {
	[templateSymbol]: true;
	parts: (string | Slot<SlotName>)[];
};

const slotSymbol: unique symbol = Symbol("slot");
export type Slot<Name extends string> = { [slotSymbol]: true; name: Name };

export function template<SlotName extends string>(
	...parts: (string | Slot<SlotName>)[]
): Template<SlotName> {
	return { [templateSymbol]: true, parts };
}

export function isTemplate(value: unknown): value is Template<string> {
	return (
		value !== null && typeof value === "object" && templateSymbol in value
	);
}

export function slot<Name extends string>(name: Name): Slot<Name> {
	return { [slotSymbol]: true, name };
}

export function isSlot(value: unknown): value is Slot<string> {
	return value !== null && typeof value === "object" && slotSymbol in value;
}

export type DeepRemoveFallback<T> = Exclude<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends (...args: any[]) => any ? T
	: T extends object ? { [K in keyof T]: DeepRemoveFallback<T[K]> }
	: T,
	Fallback
>;

const messagePackSymbol: unique symbol = Symbol("messagePack");
export type MessagePack<T> = Omit<T, typeof messagePackSymbol> & {
	[messagePackSymbol]: true;
};

export type NotMessagePack<T> = Omit<T, typeof messagePackSymbol> & {
	[messagePackSymbol]?: undefined;
};

export type DeMessagePack<T> =
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends (...args: any[]) => any ? T
	: T extends unknown[] ? T
	: T extends object ? Omit<T, typeof messagePackSymbol>
	: T;

export type DeepStrictMessagePackValues<T> =
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends (...args: any[]) => any ? T
	: T extends object ?
		T extends MessagePack<T> ?
			MessagePack<{ [K in keyof T]: DeepStrictMessagePackValues<T[K]> }>
		:	NotMessagePack<{ [K in keyof T]: DeepStrictMessagePackValues<T[K]> }>
	:	T;

export function messagePack<T>(
	value: T extends NotMessagePack<unknown> ? never
	:	Omit<T, typeof messagePackSymbol>,
): T {
	return { ...value, [messagePackSymbol]: true };
}

export function isMessagePack<T>(
	value: T,
): value is (T extends MessagePack<infer U> ? MessagePack<U>
:	MessagePack<unknown>)
	& T {
	return (
		value !== null
		&& typeof value === "object"
		&& messagePackSymbol in value
	);
}
