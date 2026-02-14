export type DeepPartial<T extends object> = {
	[K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type Prettify<T> = T extends object ? { [K in keyof T]: T[K] } & {} : T;
export type Value<T> = T[keyof T];
