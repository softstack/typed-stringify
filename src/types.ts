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

export interface CustomStringifyOptions {
	ignoreDataLoss?: boolean;
}

export type CustomStringify<T extends string> = (
	obj: unknown,
	options: CustomStringifyOptions
) => TypedValue<T> | undefined;

export interface StringifyOptions<T extends string> {
	customStringify?: CustomStringify<T>;
	ignoreDataLoss?: boolean;
}

export type CustomParse = (obj: TypedValue) => { useResult: boolean; result?: unknown };

export interface ParseOptions {
	customParse?: CustomParse;
}
