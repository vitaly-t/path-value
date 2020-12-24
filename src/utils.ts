/**
 * Verifies that 'function'-type parameter represents a class.
 *
 * It determines an ES6 class with 100% accuracy, while an ES5 class is only
 * determined when its name starts with a capital letter.
 *
 * @param func
 * Value of type 'function'
 */
export function isClass(func: Function): boolean {
    return !!Function.prototype.toString.call(func).match(/^class\s+|function\s+[A-Z]/);
}
