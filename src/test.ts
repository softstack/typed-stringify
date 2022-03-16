import BigNumber from 'bignumber.js';
import { isEqual } from 'lodash';
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

const test = (obj: unknown) => {
	console.log('original    ', obj);
	const s1 = stringify(obj, customStringify);
	const d1 = parse(s1, customParse);
	console.log('deserialised', d1);
	console.log('serialised', s1);
	if (!isEqual(obj, d1)) {
		console.log('Issue: Objects are not equal!!!');
	}
	console.log();
};

export const main = () => {
	test(test1);
	test(test2);
	test(test3);
};

main();
