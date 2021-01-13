import {IPathOptions, IPathResult, PathErrorCode, PathInput} from './types';
import {isClass} from './utils';

/**
 * Path-to-descriptor core resolution function.
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
export function resolvePath(this: any, target: any, path: PathInput, options?: IPathOptions): IPathResult {
    const chain = typeof path === 'string' ? path.indexOf('.') === -1 ? [path] : path.split('.') : path;
    const len = chain.length, ignoreFunctions = options && options.ignoreFunctions;
    let value, isThis, i = 0, exists = true, scope = target;
    for (i; i < len; i++) {
        const name = chain[i];
        if (name === '') {
            return {chain, scope, options, idx: i - 1, errorCode: PathErrorCode.emptyName};
        }
        isThis = name === 'this';
        if (isThis) {
            if (i) {
                return {chain, scope, options, idx: i - 1, errorCode: PathErrorCode.invalidThis};
            }
            target = scope = this;
        }
        if (target === null || target === undefined) {
            if (isThis) {
                value = target;
                i++;
            }
            break;
        }
        value = isThis ? target : target[name];
        while (!ignoreFunctions && typeof value === 'function' && !isClass(value)) {
            value = value.call(target);
        }
        if (value === undefined || value === null) {
            i++;
            if (value === undefined && i === len) {
                const obj = typeof target === 'object' ? target : target.constructor.prototype;
                exists = name in obj;
            }
            break;
        }
        if (typeof value.then === 'function') {
            return {chain, scope, options, idx: i - 1, errorCode: PathErrorCode.asyncValue};
        }
        if (typeof value.next === 'function') {
            return {chain, scope, options, idx: i - 1, errorCode: PathErrorCode.genValue};
        }
        target = value;
    }
    if (i === len) {
        return {chain, scope, options, idx: i - 1, exists, value};
    }
    return {chain, scope, options, idx: i - 1, errorCode: PathErrorCode.stopped};
}
