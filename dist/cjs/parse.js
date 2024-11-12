"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.isTypedValue = void 0;
const hasOwnProperty = (object, property) => Object.prototype.hasOwnProperty.call(object, property);
const isTypedValue = (obj) => {
    if (typeof obj === 'object' && hasOwnProperty(obj, 't') && typeof obj.t === 'string') {
        const keys = Object.keys(obj);
        return keys.length === 1 || (keys.length === 2 && hasOwnProperty(obj, 'v') && typeof obj.v === 'string');
    }
    return false;
};
exports.isTypedValue = isTypedValue;
const convertType = ({ t, v }) => {
    switch (t) {
        case 'function': {
            return undefined;
        }
        case 'null': {
            return null; // eslint-disable-line unicorn/no-null
        }
        case 'symbol': {
            return v === undefined ? Symbol() : Symbol.for(v);
        }
        case 'undefined': {
            return undefined;
        }
    }
    if (v === undefined) {
        throw new Error('No value');
    }
    switch (t) {
        case 'bigint': {
            return BigInt(v);
        }
        case 'boolean': {
            return v === '1';
        }
        case 'Date': {
            return new Date(v);
        }
        case 'number': {
            return Number(v);
        }
        case 'string': {
            return v;
        }
        default: {
            throw new Error(`Unknown type: ${t}`);
        }
    }
};
const decent = (obj, options) => {
    if (Array.isArray(obj)) {
        return obj.map((obj) => decent(obj, options));
    }
    else if (obj && typeof obj === 'object') {
        if ((0, exports.isTypedValue)(obj)) {
            const { customParse } = options;
            if (customParse) {
                const { useResult, result } = customParse(obj);
                if (useResult) {
                    return result;
                }
            }
            return convertType(obj);
        }
        const tmpObj = {};
        for (const [key, value] of Object.entries(obj)) {
            tmpObj[key] = decent(value, options);
        }
        return tmpObj;
    }
    throw new Error('Invalid structure');
};
const parse = (s, options = {}) => {
    return decent(JSON.parse(s), options);
};
exports.parse = parse;
//# sourceMappingURL=parse.js.map