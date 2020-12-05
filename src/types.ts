/*
*                 return {chain, idx: i - 1, syntaxErr: `Empty name not allowed`};
            case 'this':
                if (i) {
                    return {chain, idx: i - 1, syntaxErr: `Keyword 'this' can only be at the start`};

* */

export enum ParseError {
    /**
     * Empty name encountered.
     */
    emptyName = 1,

    /**
     * Keyword 'this' encountered after the start.
     */
    invalidThis = 2,

    /**
     * Parsing stopped, after encountering undefined or null value.
     */
    stopped = 3
}

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
     * When failed to resolve, it is set to the error code.
     */
    error?: ParseError;

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
