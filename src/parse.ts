import {IPropResolution, ParseErrorCode} from './types';

/**
 *
 * @param obj
 * Default resolution scope. When the chain starts with 'this', the current call context
 * is used instead as the alternative resolution scope.
 *
 * @param props
 */
export function parseProp(this: any, obj: any, props: string): IPropResolution {
    const chain = props.split(`.`);
    const len = chain.length;
    let target = obj, value, i;
    for (i = 0; i < len; i++) {
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
            continue;
        }
        if (i < len - 1) {
            target = value;
        }
    }
    if (i === len) {
        return {
            chain,
            idx: i - 1,
            target,
            value
        };
    }
    return {
        chain,
        idx: i - 1,
        errorCode: ParseErrorCode.stopped
    };
}
