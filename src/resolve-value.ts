import {resolvePath} from './resolve-path';
import {validatePathResult} from './validate';

/**
 * High-level path-to-value resolution function, to either return the resolved value or throw a detailed error.
 *
 * @param target
 * Default scope to resolve against.
 *
 * @param path
 * Resolution path, either as an array of property names, or a dot-separated string.
 * If the path starts with `this`, resolution is against the calling context.
 */
export function resolveValue(this: any, target: any, path: string | string[]): any {
    const res = resolvePath.call(this, target, path);
    validatePathResult(res);
    return res.value;
}
