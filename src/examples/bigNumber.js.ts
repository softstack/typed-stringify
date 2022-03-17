import BigNumber from 'bignumber.js';
import { ICustomParse, ICustomStringify, isITypedValue, IType, ITypedValue, parse, stringify } from '../index';

type IMyType = IType | 'BigNumber';

const customStringify: ICustomStringify<IMyType> = (obj) => {
	if (obj instanceof BigNumber) {
		return { t: 'BigNumber', v: obj.toString() };
	}
	return undefined;
};

const customParse: ICustomParse = (obj) => {
	if (isITypedValue(obj)) {
		const { t, v } = obj as ITypedValue<IMyType>;
		if (t === 'BigNumber') {
			if (v === undefined) {
				throw new Error('No value');
			}
			return { useResult: true, result: new BigNumber(v) };
		}
	}
	return { useResult: false };
};

const obj = {
	a: 'hello',
	b: [new BigNumber(1), new BigNumber(2), new BigNumber(3), new BigNumber(4), new BigNumber(5)],
};
console.log(obj);
const s = stringify(obj, customStringify);
console.log(s);
// {"a":{"t":"string","v":"hello"},"b":[{"t":"BigNumber","v":"1"},{"t":"BigNumber","v":"2"},{"t":"BigNumber","v":"3"},{"t":"BigNumber","v":"4"},{"t":"BigNumber","v":"5"}]}
const d = parse(s, customParse);
console.log(d);
// {
// 	a: 'hello',
// 	b: [
// 		BigNumber { s: 1, e: 0, c: [Array] },
// 		BigNumber { s: 1, e: 0, c: [Array] },
// 		BigNumber { s: 1, e: 0, c: [Array] },
// 		BigNumber { s: 1, e: 0, c: [Array] },
// 		BigNumber { s: 1, e: 0, c: [Array] }
// 	]
// }
