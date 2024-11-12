const convertType = (obj, ignoreDataLoss) => {
    if (obj === null) {
        return { t: 'null' };
    }
    if (obj === undefined) {
        return { t: 'undefined' };
    }
    if (obj instanceof Date) {
        return { t: 'Date', v: obj.toISOString() };
    }
    switch (typeof obj) {
        case 'bigint': {
            return { t: 'bigint', v: obj.toString() };
        }
        case 'boolean': {
            return { t: 'boolean', v: obj ? '1' : '0' };
        }
        case 'function': {
            if (!ignoreDataLoss) {
                throw new Error('Function can not be stringified without data loss');
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
    const { customStringify, ignoreDataLoss = false } = options;
    if (customStringify) {
        const tmpObj = customStringify(obj, { ignoreDataLoss });
        if (tmpObj) {
            return tmpObj;
        }
    }
    if (Array.isArray(obj)) {
        return obj.map((obj) => decent(obj, options));
    }
    else if (obj && typeof obj === 'object' && !(obj instanceof Date)) {
        const tmpObj = {};
        for (const [key, value] of Object.entries(obj)) {
            tmpObj[key] = decent(value, options);
        }
        return tmpObj;
    }
    return convertType(obj, ignoreDataLoss);
};
export const stringify = (obj, options = {}) => JSON.stringify(decent(obj, options));
//# sourceMappingURL=stringify.js.map