import { ICustomParse, ITypedValue } from './types';

export const isITypedValue = (obj: unknown): obj is ITypedValue => {
	const tmpObj = obj as ITypedValue;
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

const convertType = ({ t, v }: ITypedValue): string | number | boolean | bigint | null | undefined | Date => {
	switch (t) {
		case 'null':
			return null;
		case 'undefined':
			return undefined;
	}
	if (v === undefined) {
		throw new Error('No value');
	}
	switch (t) {
		case 'string':
			return v;
		case 'number':
			return Number(v);
		case 'boolean':
			return v === '1';
		case 'bigint':
			return BigInt(v);
		case 'Date':
			return new Date(v);
		default:
			throw new Error('Unknown type');
	}
};

const decent = (obj: unknown, customParse?: ICustomParse): unknown => {
	if (customParse) {
		const { useResult, result } = customParse(obj);
		if (useResult) {
			return result;
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

export const parse = (s: string, customParse?: ICustomParse): unknown => {
	return decent(JSON.parse(s), customParse);
};
