import BigNumber from 'bignumber.js';
import { isITypedValue, parse } from 'parse';
import { stringify } from 'stringify';
import { IType, ITypedValue } from 'types';

const test1 = {
	t: {
		a: 2,
		b: 'bbbbbbbbbbb',
		c: null,
		d: undefined,
		e: new Date(),
		f: new BigNumber(12345.6789),
	},
	v: {
		t: '4444',
		v: 'aaaaaaa',
	},
	bla: [1, 2, 3n, 4, 5, new BigNumber(987.654)],
	hui: [
		{ ab: 4, ca: 5 },
		{ ab: 9, ca: 2 },
	],
	a: new BigNumber(1.5),
};

const test2 = (Object.keys(test1) as Array<keyof typeof test1>).map((key) => test1[key]);

const test3 = new BigNumber(34345.4243234);

type ITestType = IType | 'BigNumber';

const customStringify = (obj: unknown): ITypedValue<ITestType> | undefined => {
	if (obj instanceof BigNumber) {
		return { t: 'BigNumber', v: obj.toString() };
	}
	return undefined;
};

const customParse = (obj: unknown): { use: boolean; data?: BigNumber } => {
	if (isITypedValue(obj)) {
		const tmpObj = obj as ITypedValue<ITestType>;
		if (tmpObj.t === 'BigNumber') {
			return { use: true, data: new BigNumber(tmpObj.v) };
		}
	}
	return { use: false };
};

export const main = () => {
	console.log('original    ', test1);
	const s1 = stringify(test1, customStringify);
	const d1 = parse(s1, customParse);
	console.log('deserialised', d1);
	console.log('serialised', s1);

	console.log();
	console.log('original    ', test2);
	const s2 = stringify(test2, customStringify);
	const d2 = parse(s2, customParse);
	console.log('deserialised', d2);
	console.log('serialised', s2);

	console.log();
	console.log('original    ', test3);
	const s3 = stringify(test3, customStringify);
	const d3 = parse(s3, customParse);
	console.log('deserialised', d3);
	console.log('serialised', s3);
};

main();
