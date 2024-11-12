## Features

- Stringifies and parses objects while restoring the proper type on parse
- Built in types: bigint, boolean, Date, number, null, string, symbol and undefined
- Supports restoring custom types

## Usage

Basic example

```typescript
import { parse, stringify } from '@softstack/typed-stringify';

const obj = { a: 'hello', b: [1, 2, 3, 4, 5], c: new Date(1_731_319_860_000), d: 123_345_789n, e: true };
console.log(obj);
/*
{
  a: 'hello',
  b: [ 1, 2, 3, 4, 5 ],
  c: 2024-11-11T10:11:00.000Z,
  d: 123345789n,
  e: true
}
*/

const s = stringify(obj);
console.log(s);
/*
{"a":{"t":"string","v":"hello"},"b":[{"t":"number","v":"1"},{"t":"number","v":"2"},{"t":"number","v":"3"},{"t":"number","v":"4"},{"t":"number","v":"5"}],"c":{"t":"Date","v":"2024-11-11T10:11:00.000Z"},"d":{"t":"bigint","v":"123345789"},"e":{"t":"boolean","v":"1"}}
*/

const d = parse(s);
console.log(d);
/*
{
  a: 'hello',
  b: [ 1, 2, 3, 4, 5 ],
  c: 2024-11-11T10:11:00.000Z,
  d: 123345789n,
  e: true
}
*/
```

Example which adds Buffer

```typescript
import { CustomParse, CustomStringify, parse, stringify, StringifyType, TypedValue } from '@softstack/typed-stringify';

type MyType = StringifyType | 'Buffer';

const customStringify: CustomStringify<MyType> = (obj) => {
	if (obj instanceof Buffer) {
		return { t: 'Buffer', v: obj.toString('base64') };
	}
	return undefined;
};

const customParse: CustomParse = (obj) => {
	const { t, v } = obj as TypedValue<MyType>;
	if (t === 'Buffer') {
		if (v === undefined) {
			throw new Error('No value');
		}
		return { useResult: true, result: Buffer.from(v, 'base64') };
	}
	return { useResult: false };
};

const obj = {
	a: 'hello',
	b: [
		Buffer.from('123456789a', 'hex'),
		Buffer.from('abcdefabcdef', 'hex'),
		Buffer.from('123456789abcdef123456789abcdef', 'hex'),
	],
};
console.log(obj);
/*
{
  a: 'hello',
  b: [
    <Buffer 12 34 56 78 9a>,
    <Buffer ab cd ef ab cd ef>,
    <Buffer 12 34 56 78 9a bc de f1 23 45 67 89 ab cd ef>
  ]
}
*/

const s = stringify(obj, { customStringify });
console.log(s);
/*
{"a":{"t":"string","v":"hello"},"b":[{"t":"Buffer","v":"EjRWeJo="},{"t":"Buffer","v":"q83vq83v"},{"t":"Buffer","v":"EjRWeJq83vEjRWeJq83v"}]}
*/

const d = parse(s, { customParse });
console.log(d);
/*
{
  a: 'hello',
  b: [
    <Buffer 12 34 56 78 9a>,
    <Buffer ab cd ef ab cd ef>,
    <Buffer 12 34 56 78 9a bc de f1 23 45 67 89 ab cd ef>
  ]
}
*/
```
