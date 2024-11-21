import {
	CustomStringifyOptions,
	DefaultedStringifyOptions,
	StringifyOptions,
	StringifyType,
	TypedValue,
} from './types';

const convertType = <T extends string>(
	obj: unknown,
	options: DefaultedStringifyOptions<T>,
): TypedValue<StringifyType> | undefined => {
	const { bigintRadix, dateFormat, ignoreFunctions, skipNull, skipUndefined } = options;
	if (obj === null) {
		return skipNull ? undefined : { t: 'null' };
	} else if (obj === undefined) {
		return skipUndefined ? undefined : { t: 'undefined' };
	} else if (obj instanceof Date) {
		return { t: 'Date', v: dateFormat === 'iso' ? obj.toISOString() : obj.getTime().toString() };
	} else if (obj instanceof Error) {
		return {
			t: 'Error',
			v: stringify({ name: obj.name, message: obj.message, stack: obj.stack }, options),
		};
	} else if (obj instanceof Map) {
		return { t: 'Map', v: stringify([...obj], options) };
	} else if (obj instanceof Set) {
		return { t: 'Set', v: stringify([...obj], options) };
	}
	switch (typeof obj) {
		case 'bigint': {
			if (!Number.isInteger(bigintRadix) || bigintRadix < 2 || bigintRadix > 36) {
				throw new RangeError('bigintRadix must be an integer between 2 and 36');
			}
			if (bigintRadix === 10) {
				return { t: 'bigint', v: obj.toString() };
			}
			return { t: 'bigint', v: 'r' + bigintRadix.toString(36).slice(-1) + obj.toString(bigintRadix) };
		}
		case 'boolean': {
			return { t: 'boolean', v: obj ? '1' : '0' };
		}
		case 'function': {
			if (!ignoreFunctions) {
				throw new Error('Functions can not be stringified');
			}
			return { t: 'function' };
		}
		case 'number': {
			return { t: 'number', v: obj.toString() };
		}
		case 'string': {
			return { t: 'string', v: obj };
		}
		case 'symbol': {
			return { t: 'symbol', v: Symbol.keyFor(obj) };
		}
	}
	throw new Error(`Unknown datatype: ${typeof obj}`);
};

const decent = <T extends string>(obj: unknown, options: DefaultedStringifyOptions<T>): unknown => {
	const { customStringify, currentDepth, maxDepth } = options;
	if (currentDepth > maxDepth) {
		throw new Error('Max depth exceeded');
	}
	if (customStringify) {
		const { useResult, result } = customStringify(obj, {
			...options,
			currentDepth: currentDepth + 1,
		} as CustomStringifyOptions<T>);
		if (useResult) {
			return result;
		}
	}
	if (Array.isArray(obj)) {
		return obj.map((obj) => decent(obj, { ...options, currentDepth: currentDepth + 1 }));
	} else if (
		obj &&
		typeof obj === 'object' &&
		!(obj instanceof Date) &&
		!(obj instanceof Error) &&
		!(obj instanceof Map) &&
		!(obj instanceof Set)
	) {
		const tmpObj: { [key: string]: unknown } = {};
		for (const [key, value] of Object.entries(obj)) {
			tmpObj[key] = decent(value, { ...options, currentDepth: currentDepth + 1 });
		}
		return tmpObj;
	}
	return convertType(obj, { ...options, currentDepth: currentDepth + 1 });
};

export const stringify = <T extends string = StringifyType>(obj: unknown, options: StringifyOptions<T> = {}): string =>
	JSON.stringify(
		decent(obj, {
			bigintRadix: options.bigintRadix ?? 10,
			currentDepth: options.currentDepth ?? 0,
			customStringify: options.customStringify,
			dateFormat: options.dateFormat ?? 'iso',
			ignoreFunctions: options.ignoreFunctions ?? false,
			maxDepth: options.maxDepth ?? 20,
			skipNull: options.skipNull ?? false,
			skipUndefined: options.skipUndefined ?? false,
		}),
	);
