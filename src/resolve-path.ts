import {IParseResult, ParseErrorCode} from './types';

/**
 * Low-level path-to-descriptor resolution function.
 *
 * @param target
 * Default scope to resolve against.
 *
 * @param path
 * Resolution path. If the path starts with `this`, resolution is against the call context.
 */
export function resolvePath(this: any, target: any, path: string): IParseResult {
    const chain = path.split(`.`);
    const len = chain.length;
    let value, i = 0, missingIdx = -1;
    for (i; i < len; i++) {
        const name = chain[i];
        switch (name) {
            case '':
                return {chain, lastIdx: i - 1, errorCode: ParseErrorCode.emptyName};
            case 'this':
                if (i) {
                    return {chain, lastIdx: i - 1, errorCode: ParseErrorCode.invalidThis};
                }
                target = this;
                value = this;
                continue;
            default:
                break;
        }
        const v = target[name];
        value = typeof v === 'function' ? v.call(target) : v;
        if (value === undefined || value === null) {
            i++;
            break;
        }
        if (typeof value.then === 'function') {
            return {chain, lastIdx: i - 1, errorCode: ParseErrorCode.asyncValue};
        }
        if (typeof value.next === 'function') {
            return {chain, lastIdx: i - 1, errorCode: ParseErrorCode.genValue};
        }
        missingIdx = (missingIdx < 0 && !(typeof target === 'object' && name in target)) ? i : missingIdx;
        target = value;
    }
    if (i === len) {
        return {chain, lastIdx: i - 1, missingIdx, value};
    }
    return {chain, lastIdx: i - 1, errorCode: ParseErrorCode.stopped};
}
