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
    const s = Function.prototype.toString.call(func);
    return s.startsWith('class ') || (s.startsWith('function ') && s[9] <= 'Z' && s[9] >= 'A');
}