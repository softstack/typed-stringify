import { CustomParse, CustomStringify, parse, stringify, StringifyType } from '../src/index';

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
