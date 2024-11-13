# @softstack/typed-stringify

@softstack/typed-stringify is a powerful TypeScript library designed to serialize and deserialize JavaScript objects while preserving their original types. This library ensures that complex data structures, including custom types, are accurately represented in JSON format and can be restored to their original form upon parsing. With a focus on type safety, modularity, and performance, @softstack/typed-stringify is an ideal solution for applications that require reliable and efficient data serialization.

## Built-in Types

- Primitive Types:
  - bigint
  - boolean
  - null
  - number
  - string
  - symbol
  - undefined
- Complex Types:
  - Array
  - Date
  - Object

## API

### stringify()

The `stringify` function converts a JavaScript object into a JSON string while preserving the types of the values. It accepts an object and an optional configuration object as parameters.

#### Parameters

- `obj` (unknown): The object to be stringified.
- `options` (StringifyOptions<T>): An optional configuration object that can include:
  - `bigintRadix` (number): The radix to use for bigint serialization (default is 10).
  - `customStringify` (CustomStringify<T>): A custom stringify function for handling additional types.
  - `dateFormat` ('iso' | 'number'): The format to use for Date serialization (default is 'iso').
  - `ignoreFunctions` (boolean): Whether to ignore functions during serialization (default is false).
  - `skipNull` (boolean): Whether to skip null values during serialization (default is false).
  - `skipUndefined` (boolean): Whether to skip undefined values during serialization (default is false).

#### Returns

- (string): The JSON string representation of the object.

### parse()

The `parse` function converts a JSON string back into a JavaScript object while restoring the types of the values. It accepts a JSON string and an optional configuration object as parameters.

#### Parameters

- `json` (string): The JSON string to be parsed.
- `options` (ParseOptions<T>): An optional configuration object that can include:
  - `customParse` (CustomParse<T>): A custom parse function for handling additional types.

#### Returns

- (unknown): The JavaScript object representation of the JSON string.

## Custom Functions

### customStringify()

The `customStringify` function allows you to define custom serialization logic for additional types that are not handled by the default `stringify` function. This function can be provided as part of the `options` parameter when calling `stringify`.

#### Parameters

- `obj` (unknown): The object to be stringified.
- `options` (CustomStringifyOptions): An optional configuration object that can include:
  - `bigintRadix` (number): The radix to use for bigint serialization.
  - `dateFormat` ('iso' | 'number'): The format to use for Date serialization.
  - `ignoreFunctions` (boolean): Whether to ignore functions during serialization.
  - `skipNull` (boolean): Whether to skip null values during serialization.
  - `skipUndefined` (boolean): Whether to skip undefined values during serialization.

#### Returns

- (CustomStringifyResult<T>): An object containing:
  - `useResult` (boolean): Indicates whether the custom serialization result should be used.
  - `result` (object | undefined): The custom serialized representation of the object if `useResult` is `true`.

### customParse()

The `customParse` function provides custom deserialization logic for additional types that are not handled by the default `parse` function. This function can be provided as part of the `options` parameter when calling `parse`.

#### Parameters

- `obj` (TypedValue<T>): The object to be parsed.

#### Returns

- (CustomParseResult): An object containing:
  - `useResult` (boolean): Indicates whether the custom deserialization result should be used.
  - `result` (unknown | undefined): The custom deserialized representation of the object if `useResult` is `true`.

## Usage

### A basic example

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

### An example which adds Buffer

```typescript
import { CustomParse, CustomStringify, parse, stringify, StringifyType } from '@softstack/typed-stringify';

type MyType = StringifyType | 'Buffer';

const customStringify: CustomStringify<MyType> = (obj) => {
	if (obj instanceof Buffer) {
		return { useResult: true, result: { t: 'Buffer', v: obj.toString('base64') } };
	}
	return { useResult: false };
};

const customParse: CustomParse<MyType> = (obj) => {
	const { t, v } = obj;
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
