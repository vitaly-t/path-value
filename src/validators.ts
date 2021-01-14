import {IPathResult, PathErrorCode} from './types';
import {PathError, PathExistError} from './errors';

/**
 * Validates `errorCode` within IPathResult to throw a detailed error when it is set.
 *
 * @param res
 * Result to validate.
 */
export function validateErrorCode(res: IPathResult): void {
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
 * Validates `exists` within IPathResult to throw a detailed error when it is `false`.
 *
 * @param res
 * Result to validate.
 */
export function validateExists(res: IPathResult): void {
    if (!res.exists) {
        const lastName = res.chain[res.chain.length - 1];
        throw new PathExistError(`Property ${JSON.stringify(lastName)} doesn't exist.`, res, lastName);
    }
}
