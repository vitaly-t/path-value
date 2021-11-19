/**
 * Path Input Type.
 */
export type PathInput = string | (string | number)[];

/**
 * Path-parsing options that can be passed into resolvePath function.
 */
export interface IPathOptions {
    /**
     * By default, when the parser encounters a function, it will try to figure out
     * what kind of function it is. If it is an ES6 or ES5 class, it will be treated
     * as a value, to make it possible to access static methods. And if it is a regular
     * function, it will be called with `this` set to the containing object. The latter
     * resolution is recursive, to handle any function that returns another function.
     *
     * This option overrides the above behaviour, and forces every function to be treated
     * as just a value. This will naturally work when referencing static class members.
     *
     * Reasons why this option may be wanted:
     *
     *  - Determining an ES5 class at run-time isn't 100% accurate; it works only when
     *    the class has a name that starts with a capital letter.
     *  - Function verification is the slowest part of the parser, and disabling it can
     *    boost the parser performance significantly.
     *  - Invoking functions by the parser may be considered unsafe in certain context.
     */
    ignoreFunctions?: boolean;

    /**
     * By default, the parser will access inherited properties.
     * This option overrides the default behaviour to disallow accessing inherited properties.
     */
    ownProperties?: boolean;
}

/**
 * Error code that's used within type IPathResult.
 */
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
     * When resolving against a local scope, the first element is `this`.
     */
    chain: Array<string | number>;

    /**
     * Resolution scope/target for the path. When the path starts with `this`,
     * it is the value of `this` that was passed in, or else it is the value
     * of parameter `target`.
     */
    scope: any;

    /**
     * Index of the last property/function in the chain that was successfully resolved.
     *
     * When successful, idx = chain.length - 1
     *
     * It is -1, when even the first name failed to resolve.
     */
    idx: number;

    /**
     * Path-parsing options that were passed into resolvePath function.
     */
    options?: IPathOptions;

    /**
     * When failed to resolve, it is set to the error code.
     */
    errorCode?: PathErrorCode;

    /**
     * It is set only after a successful resolution, to indicate whether the
     * final property in the chain exists on the source object or its prototype.
     */
    exists?: boolean;

    /**
     * Final resolved value, if successful, or else the property is not set.
     */
    value?: any;
}
