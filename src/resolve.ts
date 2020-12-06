import {parseProp} from './parse';
import {ParsePropError} from './error';
import {ParseErrorCode} from './types';

export function resolveProp(this: any, obj: any, props: string): any {
    const res = parseProp.call(this, obj, props);
    switch (res.errorCode) {
        case ParseErrorCode.emptyName:
            throw new ParsePropError('Empty name not allowed', res);
        case ParseErrorCode.invalidThis:
            throw new ParsePropError(`Keyword 'this' can only be at the start`, res);
        case ParseErrorCode.stopped:
            throw new ParsePropError(`Could not resolve`, res);
        default:
            return res.value;
    }
}
