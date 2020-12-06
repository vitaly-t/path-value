import {parseProp} from './parse';
import {ParsePropError} from './error';
import {ParseErrorCode} from './types';

export function resolveProp(this: any, target: any, path: string): any {
    const res = parseProp.call(this, target, path);
    switch (res.errorCode) {
        case ParseErrorCode.emptyName:
            throw new ParsePropError('Empty names are not allowed.', res);
        case ParseErrorCode.invalidThis:
            throw new ParsePropError(`Keyword 'this' can only be at the start.`, res);
        case ParseErrorCode.asyncValue:
            throw new ParsePropError(`Cannot resolve '${res.chain[res.idx + 1]}': async functions and values are not supported.`, res);
        case ParseErrorCode.genValue:
            throw new ParsePropError(`Cannot resolve '${res.chain[res.idx + 1]}': iterators and generators are not supported.`, res);
        case ParseErrorCode.stopped:
            throw new ParsePropError(`Cannot resolve '${res.chain[res.idx + 1]}' from null/undefined.`, res);
        default:
            return res.value;
    }
}
