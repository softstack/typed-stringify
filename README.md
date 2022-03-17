## Features

- Stringifies and parses objects while restoring the proper type on parse
- Build in types: string, number, boolean, null, undefined, bigint and Date
- Supports restoring custom types

## Usage

Basic example

```javascript
import { parse, stringify } from 'typed-stringify';

const obj = { a: 'hello', b: [1, 2, 3, 4, 5] };
console.log(obj);
// { a: 'hello', b: [ 1, 2, 3, 4, 5 ] }
const s = stringify(obj);
console.log(s);
// {"a":{"t":"string","v":"hello"},"b":[{"t":"number","v":"1"},{"t":"number","v":"2"},{"t":"number","v":"3"},{"t":"number","v":"4"},{"t":"number","v":"5"}]}
const d = parse(s);
console.log(d);
// { a: 'hello', b: [ 1, 2, 3, 4, 5 ] }
```

Example using bignumber.js library

```javascript
import BigNumber from 'bignumber.js';
import { ICustomParse, ICustomStringify, isITypedValue, IType, ITypedValue, parse, stringify } from 'typed-stringify';

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
```
