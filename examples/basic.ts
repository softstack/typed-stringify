import { parse, stringify } from '../src/index';

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
