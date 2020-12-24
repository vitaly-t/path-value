import {expect} from './header';
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
        expect(isClass(c1)).to.be.false; // name = "c1", starts with small letter
        expect(isClass(C2)).to.be.true; // name = "C2", starts with capital
        expect(isClass(c3)).to.be.false; // name = "a", starts with small letter
        expect(isClass(c4)).to.be.true; // name = "A", starts with capital
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
        expect(isClass(c1)).to.be.false; // name = "c1", starts with small letter
        expect(isClass(C2)).to.be.false; // name = ""
        expect(isClass(c3)).to.be.false; // name = "a", starts with small letter
        expect(isClass(c4)).to.be.true; // name = "A", starts with capital
    });
    it('must detect standard types', () => {
        expect(isClass(Date)).to.be.true;
        expect(isClass(String)).to.be.true;
        expect(isClass(Boolean)).to.be.true;
        expect(isClass(Number)).to.be.true;
        expect(isClass(Function)).to.be.true;
    });
});
