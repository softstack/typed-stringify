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
    const { customStringify, currentDepth, maxDepth } = options;
    if (currentDepth > maxDepth) {
        throw new Error('Max depth exceeded');
    }
    if (customStringify) {
        const { useResult, result } = customStringify(obj, {
            ...options,
            currentDepth: currentDepth + 1,
        });
        if (useResult) {
            return result;
        }
    }
    if (Array.isArray(obj)) {
        return obj.map((obj) => decent(obj, { ...options, currentDepth: currentDepth + 1 }));
    }
    else if (obj &&
        typeof obj === 'object' &&
        !(obj instanceof Date) &&
        !(obj instanceof Error) &&
        !(obj instanceof Map) &&
        !(obj instanceof Set)) {
        const tmpObj = {};
        for (const [key, value] of Object.entries(obj)) {
            tmpObj[key] = decent(value, { ...options, currentDepth: currentDepth + 1 });
        }
        return tmpObj;
    }
    return convertType(obj, { ...options, currentDepth: currentDepth + 1 });
};
const stringify = (obj, options = {}) => {
    var _a, _b, _c, _d, _e, _f, _g;
    return JSON.stringify(decent(obj, {
        bigintRadix: (_a = options.bigintRadix) !== null && _a !== void 0 ? _a : 10,
        currentDepth: (_b = options.currentDepth) !== null && _b !== void 0 ? _b : 0,
        customStringify: options.customStringify,
        dateFormat: (_c = options.dateFormat) !== null && _c !== void 0 ? _c : 'iso',
        ignoreFunctions: (_d = options.ignoreFunctions) !== null && _d !== void 0 ? _d : false,
        maxDepth: (_e = options.maxDepth) !== null && _e !== void 0 ? _e : 20,
        skipNull: (_f = options.skipNull) !== null && _f !== void 0 ? _f : false,
        skipUndefined: (_g = options.skipUndefined) !== null && _g !== void 0 ? _g : false,
    }));
};
exports.stringify = stringify;
//# sourceMappingURL=stringify.js.map