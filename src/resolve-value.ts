import {resolvePath} from './resolve-path';
import {IParseResult, ParseErrorCode} from './types';
import {ParsePropError} from './error';

/**
 * High-level path-to-value resolution function, to either return the resolved value or throw a detailed error.
 *
 * @param target
 * Default scope to resolve against.
 *
 * @param path
 * Resolution path, either as an array of names, or a dot-separated string.
 * If the path starts with `this`, resolution is against the call context.
 */
export function resolveValue(this: any, target: any, path: string | string[]): any {
    return validateResult(resolvePath.call(this, target, path));
}

/**
 * Validates IParseResult to either return the value or throw an error.
 *
 * @param res
 * Result to validate.
 */
export function validateResult(res: IParseResult): any {
    switch (res.errorCode) {
        case ParseErrorCode.emptyName:
            throw new ParsePropError('Empty names are not allowed.', res);
        case ParseErrorCode.invalidThis:
            throw new ParsePropError(`Keyword 'this' can only be at the start.`, res);
        case ParseErrorCode.asyncValue:
            const asyncName = JSON.stringify(res.chain[res.idx + 1]);
            throw new ParsePropError(`Cannot resolve ${asyncName}: async functions and values are not supported.`, res);
        case ParseErrorCode.genValue:
            const genName = JSON.stringify(res.chain[res.idx + 1]);
            throw new ParsePropError(`Cannot resolve ${genName}: iterators and generators are not supported.`, res);
        case ParseErrorCode.stopped:
            const stoppedName = JSON.stringify(res.chain[res.idx + 1]);
            throw new ParsePropError(`Cannot resolve ${stoppedName} from null/undefined.`, res);
        default:
            return res.value;
    }
}

/**
 * Extends validation for missing last property, to throw an error.
 *
 * This is primarily an example of how you can implement your own validation,
 * and not part of the official API.
 *
 * @param target
 * Default scope to resolve against.
 *
 * @param path
 * Resolution path, either as an array of names, or a dot-separated string.
 * If the path starts with `this`, resolution is against the call context.
 */
export function resolveIfExists(this: any, target: any, path: string | string[]): any {
    const res = resolvePath.call(this, target, path);
    if (res.missing) {
        const lastName = JSON.stringify(res.chain[res.chain.length - 1]);
        throw new Error(`Property ${lastName} doesn't exist.`);
    }
    return validateResult(res);
}
