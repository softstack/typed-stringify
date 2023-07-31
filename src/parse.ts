import { CustomParse, TypedValue } from './types';

export const isTypedValue = (obj: unknown): obj is TypedValue => {
	const tmpObj = obj as TypedValue;
	if (tmpObj && typeof tmpObj === 'object') {
		const keys = Object.keys(tmpObj);
		return (
			keys.includes('t') &&
			typeof tmpObj.t === 'string' &&
			(keys.length === 1 || (keys.length === 2 && keys.includes('v') && typeof tmpObj.v === 'string'))
		);
	}
	return false;
};

const convertType = ({ t, v }: TypedValue): bigint | boolean | Date | null | number | string | symbol | undefined => {
	switch (t) {
		case 'function':
			return undefined;
		case 'null':
			return null;
		case 'symbol':
			return v === undefined ? Symbol() : Symbol.for(v);
		case 'undefined':
			return undefined;
	}
	if (v === undefined) {
		throw new Error('No value');
	}
	switch (t) {
		case 'bigint':
			return BigInt(v);
		case 'boolean':
			return v === '1';
		case 'Date':
			return new Date(v);
		case 'number':
			return Number(v);
		case 'string':
			return v;
		default:
			throw new Error(`Unknown type: ${t}`);
	}
};

const decent = (obj: unknown, customParse?: CustomParse): unknown => {
	if (customParse) {
		const { useResult, result } = customParse(obj);
		if (useResult) {
			return result;
		}
	}
	if (Array.isArray(obj)) {
		return obj.map((obj) => decent(obj, customParse));
	} else if (obj && typeof obj === 'object') {
		if (isTypedValue(obj)) {
			return convertType(obj);
		}
		const tmpObj: { [key: string]: unknown } = {};
		for (const [key, value] of Object.entries(obj)) {
			tmpObj[key] = decent(value, customParse);
		}
		return tmpObj;
	}
	throw new Error('Invalid structure');
};

export const parse = (s: string, customParse?: CustomParse): unknown => {
	return decent(JSON.parse(s), customParse);
};
