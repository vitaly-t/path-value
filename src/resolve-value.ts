import {resolvePath} from './resolve-path';
import {ParsePropError} from './error';
import {ParseErrorCode} from './types';

/**
 * High-level path-to-value resolution function, to either return the resolved value or throw a detailed error.
 *
 * @param target
 * Default scope to resolve against.
 *
 * @param path
 * Resolution path. If the path starts with `this`, resolution is against the call context.
 */
export function resolveValue(this: any, target: any, path: string): any {
    const res = resolvePath.call(this, target, path);
    switch (res.errorCode) {
        case ParseErrorCode.emptyName:
            throw new ParsePropError('Empty names are not allowed.', res);
        case ParseErrorCode.invalidThis:
            throw new ParsePropError(`Keyword 'this' can only be at the start.`, res);
        case ParseErrorCode.asyncValue:
            throw new ParsePropError(`Cannot resolve '${res.chain[res.lastIdx + 1]}': async functions and values are not supported.`, res);
        case ParseErrorCode.genValue:
            throw new ParsePropError(`Cannot resolve '${res.chain[res.lastIdx + 1]}': iterators and generators are not supported.`, res);
        case ParseErrorCode.stopped:
            throw new ParsePropError(`Cannot resolve '${res.chain[res.lastIdx + 1]}' from null/undefined.`, res);
        default:
            return res.value;
    }
}
