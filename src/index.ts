export interface IPropResolution {
    /**
     * Parsed names of all properties/functions in the chain.
     *
     * When resolving against an alternative scope, the first element is 'this'.
     */
    chain: string[];

    /**
     * Index of the last property/function in the chain that was successfully resolved.
     *
     * When successful, idx = chain.length - 1
     *
     * It is -1, when even the first name failed to resolve.
     */
    idx: number;

    /**
     * Error message when failed.
     */
    errMsg?: string;

    /**
     * Final resolved value, if successful, or else the property is not set.
     */
    value?: any;

    /**
     * Last but one object in the chain, which is the target context for the final property's resolution.
     *
     * It is not set when even the first target is unknown.
     */
    target?: any;
}

/**
 *
 * @param obj
 * Default resolution scope. When the chain starts with 'this', the current call context
 * is used instead as the alternative resolution scope.
 *
 * @param props
 */
export function resolveProp(this: any, obj: any, props: string): IPropResolution {
    const chain = props.split(`.`);
    const len = chain.length;
    let target = obj, value, i;
    for (i = 0; i < len; i++) {
        const name = chain[i];
        switch (name) {
            case '':
                // name cannot be empty:
                return {chain, idx: i - 1, errMsg: `empty name not allowed`};
            case 'this':
                if (i) {
                    // 'this' can only be in the beginning:
                    return {chain, idx: i - 1, errMsg: `'this' can only be at start`};
                }
                target = this;
                value = this;
                continue;
            default:
                break;
        }
        const v = target[name];
        value = typeof v === 'function' ? v.call(obj) : v;
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

export function verboseParse() {
    // to parse against regex, with support for '?', '[]' and 'this', 'function(values)'
}
