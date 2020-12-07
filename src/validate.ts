import {IPathResult, PathErrorCode} from './types';
import {PathError} from './error';

/**
 * Validates IPathResult to throw an error, if one is present.
 *
 * @param res
 * Result to validate.
 */
export function validatePathResult(res: IPathResult): void {
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
