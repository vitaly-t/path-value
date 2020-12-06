export enum ParseErrorCode {
    /**
     * Empty name encountered.
     */
    emptyName = 1,

    /**
     * Keyword `this` encountered after the start.
     */
    invalidThis = 2,

    /**
     * Encountered an asynchronous value or function.
     */
    asyncValue = 3,

    /**
     * Encountered a generator function or iterator.
     */
    genValue = 4,

    /**
     * Parsing stopped, after encountering `undefined` or `null` value.
     */
    stopped = 5
}

export interface IParseResult {
    /**
     * Parsed names of all properties/functions in the chain.
     *
     * When resolving against an alternative scope, the first element is `this`.
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
    errorCode?: ParseErrorCode;

    /**
     * In case of a successful resolution, indicates when the last property was
     * missing both on the target object and its prototype.
     */
    missing?: boolean;

    /**
     * Final resolved value, if successful, or else the property is not set.
     */
    value?: any;
}
