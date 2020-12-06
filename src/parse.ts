import {IParseResult, ParseErrorCode} from './types';

/**
 *
 * @param target
 * Default resolution scope. When the chain starts with 'this', the current call context
 * is used instead as the alternative resolution scope.
 *
 * @param path
 */
export function parseProp(this: any, target: any, path: string): IParseResult {
    const chain = path.split(`.`);
    const len = chain.length;
    let value, i = 0;
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
        const v = target[name];
        value = typeof v === 'function' ? v.call(target) : v;
        if (value === undefined || value === null) {
            i++;
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
        return {chain, idx: i - 1, value};
    }
    return {chain, idx: i - 1, errorCode: ParseErrorCode.stopped};
}
