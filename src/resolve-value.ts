import {resolvePath} from './resolve-path';
import {IPathResult, PathErrorCode} from './types';
import {PathError} from './error';

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
    const res = resolvePath.call(this, target, path);
    validateResult(res);
    return res.value;
}

/**
 * Validates IPathResult to throw an error, if one is present.
 *
 * @param res
 * Result to validate.
 */
export function validateResult(res: IPathResult): void {
    switch (res.errorCode) {
        case PathErrorCode.emptyName:
            throw new PathError('Empty names are not allowed.', res);
        case PathErrorCode.invalidThis:
            throw new PathError(`Keyword 'this' can only be at the start.`, res);
        case PathErrorCode.asyncValue:
            const asyncName = JSON.stringify(res.chain[res.idx + 1]);
            throw new PathError(`Cannot resolve ${asyncName}: async functions and values are not supported.`, res);
        case PathErrorCode.genValue:
            const genName = JSON.stringify(res.chain[res.idx + 1]);
            throw new PathError(`Cannot resolve ${genName}: iterators and generators are not supported.`, res);
        case PathErrorCode.stopped:
            const stoppedName = JSON.stringify(res.chain[res.idx + 1]);
            throw new PathError(`Cannot resolve ${stoppedName} from null/undefined.`, res);
        default:
            break;
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
    validateResult(res);
    if (!res.exists) {
        const lastName = JSON.stringify(res.chain[res.chain.length - 1]);
        throw new Error(`Property ${lastName} doesn't exist.`);
    }
    return res.value;
}
