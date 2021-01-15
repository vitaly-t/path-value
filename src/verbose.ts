// Based on (mostly, copy of):
// https://github.com/mike-marcacci/objectpath/blob/master/lib/ObjectPath.js#L10

export function verboseParse(str: string) {
    const regex = {'\'': /\\\'/g, '"': /\\\"/g};
    const parts = [];
    let dot, bracket, quote, closing, i = 0;
    while (i < str.length) {
        dot = str.indexOf('.', i);
        bracket = str.indexOf('[', i);
        // we've reached the end
        if (dot === -1 && bracket === -1) {
            parts.push(str.slice(i, str.length));
            i = str.length;
        }
        // dots
        else if (bracket === -1 || (dot !== -1 && dot < bracket)) {
            parts.push(str.slice(i, dot));
            i = dot + 1;
        }
        // brackets
        else {
            if (bracket > i) {
                parts.push(str.slice(i, bracket));
                i = bracket;
            }
            quote = str.slice(bracket + 1, bracket + 2);
            if (quote !== '"' && quote !== '\'') {
                closing = str.indexOf(']', bracket);
                if (closing === -1) {
                    closing = str.length;
                }
                parts.push(str.slice(i + 1, closing));
                i = (str.slice(closing + 1, closing + 2) === '.') ? closing + 2 : closing + 1;
            } else {
                closing = str.indexOf(quote + ']', bracket);
                if (closing === -1) {
                    closing = str.length;
                }
                while (str.slice(closing - 1, closing) === '\\' && bracket < str.length) {
                    bracket++;
                    closing = str.indexOf(quote + ']', bracket);
                }
                parts
                    .push(str.slice(i + 2, closing)
                        .replace(regex[quote], quote)
                        .replace(/\\+/g, backslash => new Array(Math.ceil(backslash.length / 2) + 1).join('\\')
                        ));
                i = (str.slice(closing + 2, closing + 3) === '.') ? closing + 3 : closing + 2;
            }
        }
    }
    return parts;
}

/**
 * Doesn't check syntax for validity, but if it is valid,
 * then the conversion is 100% accurate.
 *
 * @param path
 */
export function flattenPath(path: string): (string | number)[] {
    const res = [], reg = /\[\s*(\d+)|["|']([\w\s]+)["|']\s*]|[a-z_$0-9]+/gi;
    let a;
    while (a = reg.exec(path)) {
        res.push(a[1] ? parseInt(a[1]) : a[3] || a[2] || a[0]);
    }
    return res;
}
