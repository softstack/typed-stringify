"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = void 0;
const convertType = (obj, options) => {
    const { bigintRadix, dateFormat, ignoreFunctions, skipNull, skipUndefined } = options;
    if (obj === null) {
        return skipNull ? undefined : { t: 'null' };
    }
    else if (obj === undefined) {
        return skipUndefined ? undefined : { t: 'undefined' };
    }
    else if (obj instanceof Date) {
        return { t: 'Date', v: dateFormat === 'iso' ? obj.toISOString() : obj.getTime().toString() };
    }
    else if (obj instanceof Error) {
        return {
            t: 'Error',
            v: (0, exports.stringify)({ name: obj.name, message: obj.message, stack: obj.stack }, options),
        };
    }
    else if (obj instanceof Map) {
        return { t: 'Map', v: (0, exports.stringify)([...obj], options) };
    }
    else if (obj instanceof Set) {
        return { t: 'Set', v: (0, exports.stringify)([...obj], options) };
    }
    switch (typeof obj) {
        case 'bigint': {
            if (!Number.isInteger(bigintRadix) || bigintRadix < 2 || bigintRadix > 36) {
                throw new RangeError('bigintRadix must be an integer between 2 and 36');
            }
            if (bigintRadix === 10) {
                return { t: 'bigint', v: obj.toString() };
            }
            return { t: 'bigint', v: 'r' + bigintRadix.toString(36).slice(-1) + obj.toString(bigintRadix) };
        }
        case 'boolean': {
            return { t: 'boolean', v: obj ? '1' : '0' };
        }
        case 'function': {
            if (!ignoreFunctions) {
                throw new Error('Functions can not be stringified');
            }
            return { t: 'function' };
        }
        case 'number': {
            return { t: 'number', v: obj.toString() };
        }
        case 'string': {
            return { t: 'string', v: obj };
        }
        case 'symbol': {
            return { t: 'symbol', v: Symbol.keyFor(obj) };
        }
    }
    throw new Error(`Unknown datatype: ${typeof obj}`);
};
const decent = (obj, options) => {
    const { customStringify } = options;
    if (customStringify) {
        const { useResult, result } = customStringify(obj, options);
        if (useResult) {
            return result;
        }
    }
    if (Array.isArray(obj)) {
        return obj.map((obj) => decent(obj, options));
    }
    else if (obj &&
        typeof obj === 'object' &&
        !(obj instanceof Date) &&
        !(obj instanceof Error) &&
        !(obj instanceof Map) &&
        !(obj instanceof Set)) {
        const tmpObj = {};
        for (const [key, value] of Object.entries(obj)) {
            tmpObj[key] = decent(value, options);
        }
        return tmpObj;
    }
    return convertType(obj, options);
};
const stringify = (obj, options = {}) => {
    var _a, _b, _c, _d, _e;
    return JSON.stringify(decent(obj, {
        bigintRadix: (_a = options.bigintRadix) !== null && _a !== void 0 ? _a : 10,
        customStringify: options.customStringify,
        dateFormat: (_b = options.dateFormat) !== null && _b !== void 0 ? _b : 'iso',
        ignoreFunctions: (_c = options.ignoreFunctions) !== null && _c !== void 0 ? _c : false,
        skipNull: (_d = options.skipNull) !== null && _d !== void 0 ? _d : false,
        skipUndefined: (_e = options.skipUndefined) !== null && _e !== void 0 ? _e : false,
    }));
};
exports.stringify = stringify;
//# sourceMappingURL=stringify.js.map