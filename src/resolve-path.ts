import {IParseResult, ParseErrorCode} from './types';

/**
 * Low-level path-to-descriptor resolution function.
 *
 * @param target
 * Default scope to resolve against.
 *
 * @param path
 * Resolution path, either as an array of names, or a dot-separated string.
 * If the path starts with `this`, resolution is against the call context.
 */
export function resolvePath(this: any, target: any, path: string | string[]): IParseResult {
    const chain = Array.isArray(path) ? path : path.indexOf('.') === -1 ? [path] : path.split('.');
    const len = chain.length;
    let value, i = 0, exists = true;
    for (i; i < len; i++) {
        const name = chain[i];
        switch (name) {
            case '':
                return {chain, idx: i - 1, errorCode: ParseErrorCode.emptyName};
            case 'this':
                if (i) {
                    return {chain, idx: i - 1, errorCode: ParseErrorCode.invalidThis};
                }
                target = this;
                value = this;
                continue;
            default:
                break;
        }
        if (target === null || target === undefined) {
            break;
        }
        const v = target[name];
        value = typeof v === 'function' ? v.call(target) : v;
        if (value === undefined || value === null) {
            i++;
            if (value === undefined && i === len) {
                const obj = typeof target === 'object' ? target : target.constructor.prototype;
                exists = name in obj;
            }
            break;
        }
        if (typeof value.then === 'function') {
            return {chain, idx: i - 1, errorCode: ParseErrorCode.asyncValue};
        }
        if (typeof value.next === 'function') {
            return {chain, idx: i - 1, errorCode: ParseErrorCode.genValue};
        }
        target = value;
    }
    if (i === len) {
        return {chain, idx: i - 1, exists, value};
    }
    return {chain, idx: i - 1, errorCode: ParseErrorCode.stopped};
}
