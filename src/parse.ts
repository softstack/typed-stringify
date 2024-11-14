import { CustomParseOptions, ParseOptions, StringifyType, TypedValue } from './types';

const hasOwnProperty = <X, Y extends PropertyKey>(object: X, property: Y): object is X & Record<Y, unknown> =>
	Object.prototype.hasOwnProperty.call(object, property);

const isTypedValue = <T extends string>(obj: unknown): obj is TypedValue<T> => {
	if (typeof obj === 'object' && hasOwnProperty(obj, 't') && typeof obj.t === 'string') {
		const keys = Object.keys(obj);
		return keys.length === 1 || (keys.length === 2 && hasOwnProperty(obj, 'v') && typeof obj.v === 'string');
	}
	return false;
};

const convertType = <T extends string>(
	{ t, v }: TypedValue<StringifyType>,
	options: ParseOptions<T>,
): bigint | boolean | Date | Map<unknown, unknown> | null | number | Set<unknown> | string | symbol | undefined => {
	switch (t) {
		case 'function': {
			return undefined;
		}
		case 'null': {
			return null; // eslint-disable-line unicorn/no-null
		}
		case 'symbol': {
			return v === undefined ? Symbol() : Symbol.for(v);
		}
		case 'undefined': {
			return undefined;
		}
	}
	if (v === undefined) {
		throw new Error('No value');
	}
	switch (t) {
		case 'bigint': {
			if (v.startsWith('r')) {
				let radix = Number.parseInt(v[1], 36);
				if (radix === 0) {
					radix = 36;
				}
				const negative = v[2] === '-';
				const startIndex = negative ? 3 : 2;
				const value = [v.slice(startIndex)].reduce(
					(r, v) => r * BigInt(radix) + BigInt(Number.parseInt(v, radix)),
					BigInt(0),
				);
				return negative ? -value : value;
			}
			return BigInt(v);
		}
		case 'boolean': {
			return v === '1';
		}
		case 'Date': {
			return v.includes('T') ? new Date(v) : new Date(Number(v));
		}
		case 'Map': {
			return new Map(parse(v, options) as Array<[unknown, unknown]>);
		}
		case 'number': {
			return Number(v);
		}
		case 'Set': {
			return new Set(parse(v, options) as Array<unknown>);
		}
		case 'string': {
			return v;
		}
		default: {
			throw new Error(`Unknown type: ${t}`);
		}
	}
};

const decent = <T extends string>(obj: unknown, options: ParseOptions<T>): unknown => {
	if (Array.isArray(obj)) {
		return obj.map((obj) => decent(obj, options));
	} else if (obj && typeof obj === 'object') {
		if (isTypedValue(obj)) {
			const { customParse } = options;
			if (customParse) {
				const { useResult, result } = customParse(obj as TypedValue<T>, options as CustomParseOptions<T>);
				if (useResult) {
					return result;
				}
			}
			return convertType(obj as TypedValue<StringifyType>, options);
		}
		const tmpObj: { [key: string]: unknown } = {};
		for (const [key, value] of Object.entries(obj)) {
			tmpObj[key] = decent(value, options);
		}
		return tmpObj;
	}
	throw new Error('Invalid structure');
};

export const parse = <T extends string>(json: string, options: ParseOptions<T> = {}): unknown => {
	return decent(JSON.parse(json), options);
};
