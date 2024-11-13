import BigNumber from 'bignumber.js';
import { cloneDeep, isEqual } from 'lodash';
import { CustomParse, CustomStringify, parse, stringify, StringifyType, TypedValue } from '../index';

type TestType = StringifyType | 'BigNumber' | 'Buffer';

const customStringify: CustomStringify<TestType> = (obj) => {
	if (obj instanceof BigNumber) {
		return { useResult: true, result: { t: 'BigNumber', v: obj.toString() } };
	} else if (obj instanceof Buffer) {
		return { useResult: true, result: { t: 'Buffer', v: obj.toString('base64') } };
	}
	return { useResult: false };
};

const customParse: CustomParse<TestType> = (typedValue: TypedValue<TestType>) => {
	const { t, v } = typedValue;
	switch (t) {
		case 'BigNumber': {
			if (v === undefined) {
				throw new Error('Value of BigNumber can not be undefined');
			}
			return { useResult: true, result: new BigNumber(v) };
		}
		case 'Buffer': {
			if (v === undefined) {
				throw new Error('Value of Buffer can not be undefined');
			}
			return { useResult: true, result: Buffer.from(v, 'base64') };
		}
	}
	return { useResult: false };
};

const bigTestObject = {
	t: {
		a: 2,
		b: 'bbbbbbbbbbb',
		c: null, // eslint-disable-line unicorn/no-null
		d: undefined,
		e: new Date(1_731_319_860_000),
		f: new BigNumber(12_345.6789),
	},
	v: {
		t: '4444',
		v: 'aaaaaaa',
	},
	bla: [1, 2, BigInt(3), 4, 5, new BigNumber(987.654)],
	hui: [
		{ ab: 4, ca: 5 },
		{ ab: 9, ca: 2 },
	],
	a: new BigNumber(1.5),
};

test('Empty object', () => {
	const obj = {};
	expect(isEqual(obj, parse(stringify(obj)))).toBe(true);
});

test('Empty array', () => {
	const obj = new Array<unknown>();
	expect(isEqual(obj, parse(stringify(obj)))).toBe(true);
});

test('null', () => {
	const obj = null; // eslint-disable-line unicorn/no-null
	expect(isEqual(obj, parse(stringify(obj)))).toBe(true);
});

test('undefined', () => {
	const obj = undefined;
	expect(isEqual(obj, parse(stringify(obj)))).toBe(true);
});

test('Empty string', () => {
	const obj = '';
	expect(isEqual(obj, parse(stringify(obj)))).toBe(true);
});

test('string', () => {
	const obj = 'hello';
	expect(isEqual(obj, parse(stringify(obj)))).toBe(true);
});

test('string with quotes', () => {
	const obj = '"hello"';
	expect(isEqual(obj, parse(stringify(obj)))).toBe(true);
});

test('number', () => {
	const obj = 123;
	expect(isEqual(obj, parse(stringify(obj)))).toBe(true);
});

test('boolean', () => {
	const obj = true;
	expect(isEqual(obj, parse(stringify(obj)))).toBe(true);
});

test('bigint', () => {
	const obj = BigInt(123);
	expect(isEqual(obj, parse(stringify(obj)))).toBe(true);
});

test('bigint radix 16', () => {
	const obj = BigInt(123);
	expect(isEqual(obj, parse(stringify(obj, { bigintRadix: 16 })))).toBe(true);
});

test('bigint radix 36', () => {
	const obj = BigInt(123_456_789);
	expect(isEqual(obj, parse(stringify(obj, { bigintRadix: 16 })))).toBe(true);
});

test('negative bigint radix 36', () => {
	const obj = BigInt(-123_456_789);
	expect(isEqual(obj, parse(stringify(obj, { bigintRadix: 16 })))).toBe(true);
});

test('bigint radix 37', () => {
	const obj = BigInt(123_456_789);
	expect(() => parse(stringify(obj, { bigintRadix: 37 }))).toThrow(RangeError);
});

test('Date', () => {
	const obj = new Date(1_731_319_860_000);
	expect(isEqual(obj, parse(stringify(obj)))).toBe(true);
});

test('Date with dateFormat = "number"', () => {
	const obj = new Date(1_731_319_860_000);
	expect(isEqual(obj, parse(stringify(obj, { dateFormat: 'number' })))).toBe(true);
});

test('Big object', () => {
	expect(isEqual(bigTestObject, parse(stringify(bigTestObject, { customStringify }), { customParse }))).toBe(true);
});

test('Big object with skipNull', () => {
	const obj = cloneDeep(bigTestObject);
	delete (obj.t as any).c; // eslint-disable-line @typescript-eslint/no-explicit-any
	expect(isEqual(obj, parse(stringify(bigTestObject, { customStringify, skipNull: true }), { customParse }))).toBe(
		true,
	);
});

test('Big object with skipUndefined', () => {
	const obj = cloneDeep(bigTestObject);
	delete (obj.t as any).d; // eslint-disable-line @typescript-eslint/no-explicit-any
	expect(isEqual(obj, parse(stringify(bigTestObject, { customStringify, skipUndefined: true }), { customParse }))).toBe(
		true,
	);
});

test('Big array', () => {
	const obj = (Object.keys(bigTestObject) as Array<keyof typeof bigTestObject>).map((key) => bigTestObject[key]);
	expect(isEqual(obj, parse(stringify(obj, { customStringify }), { customParse }))).toBe(true);
});

test('BigNumber', () => {
	const obj = new BigNumber(34_345.424_323_4);
	expect(isEqual(obj, parse(stringify(obj, { customStringify }), { customParse }))).toBe(true);
});

test('Buffer', () => {
	const obj = Buffer.from('Hello world!');
	expect(isEqual(obj, parse(stringify(obj, { customStringify }), { customParse }))).toBe(true);
});

test('Symbol()', () => {
	const obj = Symbol();
	expect(typeof parse(stringify(obj)) === 'symbol').toBe(true);
});

test('Symbol.for("test")', () => {
	const obj = Symbol.for('test');
	expect(isEqual(obj, parse(stringify(obj)))).toBe(true);
});

test('Function', () => {
	const obj = (): void => undefined;
	expect(isEqual(undefined, parse(stringify(obj, { ignoreFunctions: true })))).toBe(true);
});

test('Function without "ignoreFunctions = true" should throw an error', () => {
	const obj = (): void => undefined; // eslint-disable-line unicorn/consistent-function-scoping
	expect(() => parse(stringify(obj))).toThrow(Error);
	expect(() => parse(stringify(obj, { ignoreFunctions: false }))).toThrow(Error);
});

test('Set', () => {
	const obj = new Set([1, '2', 3, 4, 5]);
	expect(isEqual(obj, parse(stringify(obj)))).toBe(true);
});
