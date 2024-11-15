export type StringifyType =
	| 'bigint'
	| 'boolean'
	| 'Date'
	| 'Error'
	| 'function'
	| 'Map'
	| 'null'
	| 'number'
	| 'Set'
	| 'string'
	| 'symbol'
	| 'undefined';

export type DateFormat = 'iso' | 'number';

export interface TypedValue<T extends string> {
	t: T;
	v?: string;
}

// Start stringify

export interface BaseStringifyOptions {
	bigintRadix: number;
	dateFormat: DateFormat;
	ignoreFunctions: boolean;
	skipNull: boolean;
	skipUndefined: boolean;
}

export interface CustomStringifyOptions<T extends string> extends BaseStringifyOptions {
	customStringify: CustomStringify<T>;
}

export type CustomStringifyResult<T extends string> = { useResult: boolean; result?: TypedValue<T> };

export type CustomStringify<T extends string> = (
	obj: unknown,
	options: CustomStringifyOptions<T>,
) => CustomStringifyResult<T>;

export interface DefaultedStringifyOptions<T extends string> extends BaseStringifyOptions {
	customStringify?: CustomStringify<T>;
}

export type StringifyOptions<T extends string> = Partial<DefaultedStringifyOptions<T>>;

// End stringify

// Start parse

export interface CustomParseOptions<T extends string> {
	customParse: CustomParse<T>;
}

export type CustomParseResult = { useResult: boolean; result?: unknown };

export type CustomParse<T extends string> = (obj: TypedValue<T>, options: CustomParseOptions<T>) => CustomParseResult;

export type ParseOptions<T extends string> = Partial<CustomParseOptions<T>>;

// End parse
