import {resolvePath} from './resolve-path';
import {validatePathResult} from './validate';

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
 * Resolution path, either as an array of names, or a dot-separated string.
 * If the path starts with `this`, resolution is against the call context.
 */
export function resolveIfExists(this: any, target: any, path: string | string[]): any {
    const res = resolvePath.call(this, target, path);
    validatePathResult(res);
    if (!res.exists) {
        const lastName = JSON.stringify(res.chain[res.chain.length - 1]);
        throw new Error(`Property ${lastName} doesn't exist.`);
    }
    return res.value;
}
