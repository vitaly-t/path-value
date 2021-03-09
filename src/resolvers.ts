import {resolvePath} from './parsers';
import {validateErrorCode, validateExists} from './validators';
import {IPathOptions, PathInput} from './types';

/**
 * High-level path-to-value resolution function, to either return the resolved value or throw a detailed error.
 *
 * @param target
 * Default resolution scope.
 *
 * @param path
 * Resolution path, either as an array of property names, or a dot-separated string.
 * If the path starts with `this`, resolution is against the calling context.
 *
 * @param options
 * Path-parsing options.
 */
export function resolveValue(this: any, target: any, path: PathInput, options?: IPathOptions): any {
    const res = resolvePath.call(this, target, path, options);
    validateErrorCode(res);
    return res.value;
}

/**
 * Extends validation for missing last property, to throw a detailed error.
 *
 * @param target
 * Default resolution scope.
 *
 * @param path
 * Resolution path, either as an array of property names, or a dot-separated string.
 * If the path starts with `this`, resolution is against the calling context.
 *
 * @param options
 * Path-parsing options.
 */
export function resolveIfExists(this: any, target: any, path: PathInput, options?: IPathOptions): any {
    const res = resolvePath.call(this, target, path, options);
    validateErrorCode(res);
    validateExists(res);
    return res.value;
}
