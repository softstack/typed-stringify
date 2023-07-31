"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.isTypedValue = void 0;
const isTypedValue = (obj) => {
    const tmpObj = obj;
    if (tmpObj && typeof tmpObj === 'object') {
        const keys = Object.keys(tmpObj);
        return (keys.includes('t') &&
            typeof tmpObj.t === 'string' &&
            (keys.length === 1 || (keys.length === 2 && keys.includes('v') && typeof tmpObj.v === 'string')));
    }
    return false;
};
exports.isTypedValue = isTypedValue;
const convertType = ({ t, v }) => {
    switch (t) {
        case 'function':
            return undefined;
        case 'null':
            return null;
        case 'symbol':
            return v === undefined ? Symbol() : Symbol.for(v);
        case 'undefined':
            return undefined;
    }
    if (v === undefined) {
        throw new Error('No value');
    }
    switch (t) {
        case 'bigint':
            return BigInt(v);
        case 'boolean':
            return v === '1';
        case 'Date':
            return new Date(v);
        case 'number':
            return Number(v);
        case 'string':
            return v;
        default:
            throw new Error(`Unknown type: ${t}`);
    }
};
const decent = (obj, customParse) => {
    if (customParse) {
        const { useResult, result } = customParse(obj);
        if (useResult) {
            return result;
        }
    }
    if (Array.isArray(obj)) {
        return obj.map((obj) => decent(obj, customParse));
    }
    else if (obj && typeof obj === 'object') {
        if ((0, exports.isTypedValue)(obj)) {
            return convertType(obj);
        }
        const tmpObj = {};
        for (const [key, value] of Object.entries(obj)) {
            tmpObj[key] = decent(value, customParse);
        }
        return tmpObj;
    }
    throw new Error('Invalid structure');
};
const parse = (s, customParse) => {
    return decent(JSON.parse(s), customParse);
};
exports.parse = parse;
