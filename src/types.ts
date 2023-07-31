export type StringifyType =
	| 'bigint'
	| 'boolean'
	| 'Date'
	| 'function'
	| 'null'
	| 'number'
	| 'string'
	| 'symbol'
	| 'undefined';

export interface TypedValue<T extends string = StringifyType> {
	t: T;
	v?: string;
}

export type CustomStringify<T extends string> = (obj: unknown) => TypedValue<T> | undefined;

export type CustomParse = (obj: unknown) => { useResult: boolean; result?: unknown };
