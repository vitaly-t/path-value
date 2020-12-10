export enum PathErrorCode {
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

/**
 * Result of parsing a property path (from resolvePath function).
 *
 * When successful:
 *  - `idx` = chain.length - 1
 *  - `exists` is set to true/false
 *  - `value` is set to the final property value
 *
 *  When unsuccessful:
 *  - `idx` = index of the last resolved property within chain,
 *    which also can be -1 when none were resolved;
 *  - `errorCode` is set to the error code
 */
export interface IPathResult {
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
    errorCode?: PathErrorCode;

    /**
     * It is set only after a successful resolution, to indicate whether the
     * final property in the chain exists on the object or its prototype.
     */
    exists?: boolean;

    /**
     * Final resolved value, if successful, or else the property is not set.
     */
    value?: any;
}
