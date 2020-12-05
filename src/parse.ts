import {IPropResolution} from './types';

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
                return {chain, idx: i - 1, syntaxErr: `Empty name not allowed`};
            case 'this':
                if (i) {
                    return {chain, idx: i - 1, syntaxErr: `Keyword 'this' can only be at the start`};
                }
                target = this;
                value = this;
                continue;
            default:
                break;
        }
        const v = target[name];
        value = typeof v === 'function' ? v.call(target) : v;
        if (value === undefined) {
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
        idx: i - 1
    };
}
