import {isClass} from '../src/utils';

describe('isClass', () => {
    it('must detect ES6 classes', () => {
        const c1 = class {
        };
        const C2 = class {
        };
        const c3 = class a { // tslint:disable-line:class-name
        };
        const c4 = class A {
        };
        expect(isClass(c1)).toBeTruthy(); // name = "c1", starts with small letter
        expect(isClass(C2)).toBeTruthy(); // name = "C2", starts with capital
        expect(isClass(c3)).toBeTruthy(); // name = "a", starts with small letter
        expect(isClass(c4)).toBeTruthy(); // name = "A", starts with capital
    });
    it('must detect ES5 classes', () => {
        const c1 = function () {
        };
        const C2 = function () {
        };
        const c3 = function a() {
        };
        const c4 = function A() {
        };
        expect(isClass(c1)).toBeFalsy(); // name = "c1", starts with small letter
        expect(isClass(C2)).toBeFalsy(); // name = ""
        expect(isClass(c3)).toBeFalsy(); // name = "a", starts with small letter
        expect(isClass(c4)).toBeTruthy(); // name = "A", starts with capital
    });
    it('must detect standard types', () => {
        expect(isClass(Date)).toBeTruthy();
        expect(isClass(String)).toBeTruthy();
        expect(isClass(Boolean)).toBeTruthy();
        expect(isClass(Number)).toBeTruthy();
        expect(isClass(Function)).toBeTruthy();
    });
});
