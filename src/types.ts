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
     * When there is a syntax-related error, it is set to the error message.
     */
    syntaxErr?: string;

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
