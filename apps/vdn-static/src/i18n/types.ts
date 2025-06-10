import en_US from "../locales/en_US";
export interface MessageSchema extends Broaden<typeof en_US> {}

type Broaden<T> = {
	[K in keyof T]: T[K] extends object ? Broaden<T[K]>
	: T[K] extends string ? string
	: T[K];
} & {};
