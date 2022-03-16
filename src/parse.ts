import { ITypedValue } from 'types';

export const isITypedValue = (obj: unknown): obj is ITypedValue => {
	const tmpObj = obj as ITypedValue;
	if (tmpObj && typeof tmpObj === 'object') {
		const keys = Object.keys(tmpObj);
		return (
			keys.length === 2 &&
			keys.includes('t') &&
			keys.includes('v') &&
			typeof tmpObj.t === 'string' &&
			typeof tmpObj.v === 'string'
		);
	}
	return false;
};

const convertType = ({ t, v }: ITypedValue): string | number | boolean | bigint | null | undefined | Date => {
	switch (t) {
		case 'string':
			return v;
		case 'number':
			return Number(v);
		case 'boolean':
			return JSON.parse(v);
		case 'bigint':
			return BigInt(v);
		case 'null':
			return null;
		case 'undefined':
			return undefined;
		case 'date':
			return new Date(v);
		default:
			throw new Error('Unknown type');
	}
};

const decent = (obj: unknown, customParse?: (obj: unknown) => { use: boolean; data?: unknown }): unknown => {
	if (customParse) {
		const { use, data } = customParse(obj);
		if (use) {
			return data;
		}
	}
	if (Array.isArray(obj)) {
		return obj.map((obj) => decent(obj, customParse));
	} else if (obj && typeof obj === 'object') {
		if (isITypedValue(obj)) {
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

export const parse = (s: string, customParse?: (obj: unknown) => { use: boolean; data?: unknown }): unknown => {
	return decent(JSON.parse(s), customParse);
};
