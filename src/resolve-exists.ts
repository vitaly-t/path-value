import {resolvePath} from './resolve-path';
import {validatePathResult} from './validate';
import {IPathOptions, PathInput} from './types';

/**
 * Extends validation for missing last property, to throw an error.
 *
 * This is primarily an example of how you can implement your own validation,
 * and not part of the official API.
 *
 * @param target
 * Default scope to resolve against.
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
    validatePathResult(res);
    if (!res.exists) {
        const lastName = JSON.stringify(res.chain[res.chain.length - 1]);
        throw new Error(`Property ${lastName} doesn't exist.`);
    }
    return res.value;
}
