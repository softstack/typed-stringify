import { parse, stringify } from '../index';

const obj = { a: 'hello', b: [1, 2, 3, 4, 5] };
console.log(obj);
/*
{ a: 'hello', b: [ 1, 2, 3, 4, 5 ] }
*/

const s = stringify(obj);
console.log(s);
/*
{"a":{"t":"string","v":"hello"},"b":[{"t":"number","v":"1"},{"t":"number","v":"2"},{"t":"number","v":"3"},{"t":"number","v":"4"},{"t":"number","v":"5"}]}
*/

const d = parse(s);
console.log(d);
/*
{ a: 'hello', b: [ 1, 2, 3, 4, 5 ] }
*/
