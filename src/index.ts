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
     * Final resolved value, if successful, or else the property is not set.
     */
    value?: any;

    /**
     * Last but one object/function in the chain, which is the target context for the final property's resolution.
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
    if (props.indexOf(`.`) === -1) {
        if (props === 'this') {
            return {
                chain: [props],
                idx: 0,
                value: this
            };
        }
        if (obj === undefined) {
            return {
                chain: [props],
                idx: -1
            };
        }
        const v = obj[props];
        const value = typeof v === 'function' ? v.call(obj) : v;
        return {
            chain: [props],
            idx: 0,
            target: obj,
            value
        };
    }
    const chain = props.split(`.`);
    let value = obj, target, i;
    for (i = 0; i < chain.length; i++) {
        const name = chain[i];
        if (!name) {
            return {
                chain,
                idx: i
            };
        }
        if (!i && name === 'this') {
            target = this;
            value = this;
            continue;
        }
        if (i < chain.length - 1) {
            target = value;
        }
        const v = target[name];
        value = typeof v === 'function' ? v.call(obj) : v;
        if (value === undefined) {
            break;
        }
    }
    if (i === chain.length) {
        return {
            chain,
            idx: i - 1,
            target,
            value
        };
    }
    return {
        chain,
        idx: i
    };
}
