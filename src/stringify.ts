import { CustomStringify, StringifyType, TypedValue } from './types';

const convertType = (obj: unknown, ignoreDataLoss: boolean): TypedValue => {
	if (obj === null) {
		return { t: 'null' };
	}
	if (obj === undefined) {
		return { t: 'undefined' };
	}
	if (obj instanceof Date) {
		return { t: 'Date', v: obj.toISOString() };
	}
	switch (typeof obj) {
		case 'bigint':
			return { t: 'bigint', v: obj.toString() };
		case 'boolean':
			return { t: 'boolean', v: obj ? '1' : '0' };
		case 'function':
			if (!ignoreDataLoss) {
				throw new Error('Function can not be stringified without data loss');
			}
			return { t: 'function' };
		case 'number':
			return { t: 'number', v: obj.toString() };
		case 'string':
			return { t: 'string', v: obj };
		case 'symbol':
			return { t: 'symbol', v: Symbol.keyFor(obj) };
	}
	throw new Error(`Unknown datatype: ${typeof obj}`);
};

const decent = <T extends string = StringifyType>(
	obj: unknown,
	options: { customStringify?: CustomStringify<T>; ignoreDataLoss?: boolean } = {}
): unknown => {
	const { customStringify, ignoreDataLoss = false } = options;
	if (customStringify) {
		const tmpObj = customStringify(obj);
		if (tmpObj) {
			return tmpObj;
		}
	}
	if (Array.isArray(obj)) {
		return obj.map((obj) => decent(obj, options));
	} else if (obj && typeof obj === 'object' && !(obj instanceof Date)) {
		const tmpObj: { [key: string]: unknown } = {};
		for (const [key, value] of Object.entries(obj)) {
			tmpObj[key] = decent(value, options);
		}
		return tmpObj;
	}
	return convertType(obj, ignoreDataLoss);
};

export const stringify = <T = unknown, U extends string = StringifyType>(
	obj: T,
	options?: { customStringify?: CustomStringify<U>; ignoreDataLoss?: boolean }
): string => {
	return JSON.stringify(decent(obj, options));
};
