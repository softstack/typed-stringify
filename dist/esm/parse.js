import { ERROR_CONSTRUCTORS } from './constants';
const hasOwnProperty = (object, property) => Object.prototype.hasOwnProperty.call(object, property);
const isTypedValue = (obj) => {
    if (typeof obj === 'object' && hasOwnProperty(obj, 't') && typeof obj.t === 'string') {
        const keys = Object.keys(obj);
        return keys.length === 1 || (keys.length === 2 && hasOwnProperty(obj, 'v') && typeof obj.v === 'string');
    }
    return false;
};
const convertType = ({ t, v }, options) => {
    var _a;
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
            if (v.startsWith('r')) {
                let radix = Number.parseInt(v[1], 36);
                if (radix === 0) {
                    radix = 36;
                }
                const negative = v[2] === '-';
                const startIndex = negative ? 3 : 2;
                const value = [v.slice(startIndex)].reduce((r, v) => r * BigInt(radix) + BigInt(Number.parseInt(v, radix)), BigInt(0));
                return negative ? -value : value;
            }
            return BigInt(v);
        }
        case 'boolean': {
            return v === '1';
        }
        case 'Date': {
            return v.includes('T') ? new Date(v) : new Date(Number(v));
        }
        case 'Error': {
            const { name, message, stack } = parse(v, options);
            const ErrorConstructor = (_a = ERROR_CONSTRUCTORS.get(name)) !== null && _a !== void 0 ? _a : Error;
            const error = new ErrorConstructor(message);
            error.stack = stack;
            return error;
        }
        case 'Map': {
            return new Map(parse(v, options));
        }
        case 'number': {
            return Number(v);
        }
        case 'Set': {
            return new Set(parse(v, options));
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
    const { currentDepth, maxDepth } = options;
    if (currentDepth > maxDepth) {
        throw new Error('Max depth exceeded');
    }
    if (Array.isArray(obj)) {
        return obj.map((obj) => decent(obj, { ...options, currentDepth: currentDepth + 1 }));
    }
    else if (obj && typeof obj === 'object') {
        if (isTypedValue(obj)) {
            const { customParse } = options;
            if (customParse) {
                const { useResult, result } = customParse(obj, { ...options, currentDepth: currentDepth + 1 });
                if (useResult) {
                    return result;
                }
            }
            return convertType(obj, { ...options, currentDepth: currentDepth + 1 });
        }
        const tmpObj = {};
        for (const [key, value] of Object.entries(obj)) {
            tmpObj[key] = decent(value, { ...options, currentDepth: currentDepth + 1 });
        }
        return tmpObj;
    }
    throw new Error('Invalid structure');
};
export const parse = (json, options = {}) => {
    var _a, _b;
    return decent(JSON.parse(json), {
        currentDepth: (_a = options.currentDepth) !== null && _a !== void 0 ? _a : 0,
        customParse: options.customParse,
        maxDepth: (_b = options.maxDepth) !== null && _b !== void 0 ? _b : 20,
    });
};
//# sourceMappingURL=parse.js.map