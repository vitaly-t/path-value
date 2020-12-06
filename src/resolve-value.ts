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
 * Resolution path. If the path starts with `this`, resolution is against the call context.
 */
export function resolveValue(this: any, target: any, path: string): any {
    return validateResult(resolvePath.call(this, target, path));
}

/**
 * Validates IParseResult to either return the value or throw an error.
 *
 * @param res
 * Result to validate.
 */
export function validateResult(res: IParseResult): any {
    const failedName = JSON.stringify(res.chain[res.idx + 1]);
    switch (res.errorCode) {
        case ParseErrorCode.emptyName:
            throw new ParsePropError('Empty names are not allowed.', res);
        case ParseErrorCode.invalidThis:
            throw new ParsePropError(`Keyword 'this' can only be at the start.`, res);
        case ParseErrorCode.asyncValue:
            throw new ParsePropError(`Cannot resolve ${failedName}: async functions and values are not supported.`, res);
        case ParseErrorCode.genValue:
            throw new ParsePropError(`Cannot resolve ${failedName}: iterators and generators are not supported.`, res);
        case ParseErrorCode.stopped:
            throw new ParsePropError(`Cannot resolve ${failedName} from null/undefined.`, res);
        default:
            return res.value;
    }
}

/**
 * Extends validation for missing last property, to throw an error.
 *
 * This is primarily an example of how you can implement your own validation,
 * and not part of the official API, i.e. can be refactored out in the future.
 *
 * @param target
 * Default scope to resolve against.
 *
 * @param path
 * Resolution path. If the path starts with `this`, resolution is against the call context.
 */
export function resolveIfExists(this: any, target: any, path: string): any {
    const res = resolvePath.call(this, target, path);
    if (res.missing) {
        const lastName = JSON.stringify(res.chain[res.chain.length - 1]);
        throw new Error(`Property ${lastName} doesn't exist.`);
    }
    return validateResult(res);
}
