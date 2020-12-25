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

/**
 * Converts a path into array of names.
 * Automatically handles `[]` indexes + `.` as separator.
 *
 * @param path
 * Path input string, which can contain `[]` indexes, plus `.` separators.
 */
export function pathToNames(path: string): string[] {
    const r = /([\w\d\s$-]+)|\[([0-9]+)]/ig;
    const res = [];
    let m;
    while (m = r.exec(path)) {
        res.push(m[1] === undefined ? m[2] : m[1]);
    }
    return res;
}
