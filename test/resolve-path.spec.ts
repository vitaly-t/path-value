import {expect} from './header';
import {resolvePath as resolve, PathErrorCode} from '../src';

describe('for empty string', () => {
    it('must fail correctly', () => {
        expect(resolve({}, '')).to.eql({chain: [''], idx: -1, errorCode: PathErrorCode.emptyName});
    });
});

describe('one property', () => {
    describe('this', () => {
        it('must resolve any value', () => {
            expect(resolve.call(undefined, null, 'this')).to.eql({
                chain: ['this'],
                idx: 0,
                exists: true,
                value: undefined
            });
            expect(resolve.call(null, null, 'this')).to.eql({chain: ['this'], idx: 0, exists: true, value: null});
            expect(resolve.call(123, null, 'this')).to.eql({chain: ['this'], idx: 0, exists: true, value: 123});
        });
    });
    describe('for primitive types', () => {
        it('must call functions with context', () => {
            expect(resolve(123, 'toExponential')).to.eql({
                chain: ['toExponential'],
                idx: 0,
                exists: true,
                value: '1.23e+2'
            });
            expect(resolve('test', 'length')).to.eql({chain: ['length'], idx: 0, exists: true, value: 4});
        });
    });
    describe('for missing properties', () => {
        it('must resolve with undefined', () => {
            expect(resolve({}, 'one')).to.eql({chain: ['one'], idx: 0, exists: false, value: undefined});
        });
    });
    describe('for functions', () => {
        it('must invoke correctly', () => {
            const obj1 = {one: () => 123};
            expect(resolve(obj1, 'one')).to.eql({chain: ['one'], idx: 0, exists: true, value: 123});
            const obj2 = {
                one: 123, getValue() {
                    return this.one;
                }
            };
            expect(resolve(obj2, 'getValue')).to.eql({chain: ['getValue'], idx: 0, exists: true, value: 123});
        });
    });
});

describe('multiple properties', () => {
    describe('for valid simple names', () => {
        it('must resolve', () => {
            const obj1 = {one: {two: 12}};
            expect(resolve(obj1, 'one.two')).to.eql({chain: ['one', 'two'], idx: 1, exists: true, value: 12});
            const obj2 = {one: {two: {three: 123}}};
            expect(resolve(obj2, 'one.two.three')).to.eql({
                chain: ['one', 'two', 'three'],
                idx: 2,
                exists: true,
                value: 123
            });
        });
    });
    describe('for invalid simple names', () => {
        it('must resolve', () => {
            const obj1 = {};
            expect(resolve(obj1, 'one.two')).to.eql({
                chain: ['one', 'two'],
                idx: 0,
                errorCode: PathErrorCode.stopped
            });
            const obj2 = {one: {}};
            expect(resolve(obj2, 'one.two.three.four')).to.eql({
                chain: ['one', 'two', 'three', 'four'],
                idx: 1,
                errorCode: PathErrorCode.stopped
            });
        });
    });
    describe('for context names', () => {
        it('must resolve one property', () => {
            const obj1 = {one: 1};
            expect(resolve.call(obj1, obj1, 'this.one')).to.eql({
                chain: ['this', 'one'],
                idx: 1,
                exists: true,
                value: 1
            });
            expect(resolve.call(obj1, null, 'this.one')).to.eql({
                chain: ['this', 'one'],
                idx: 1,
                exists: true,
                value: 1
            });
        });
        it('must resolve any chain', () => {
            const obj1 = {one: {two: 12}};
            expect(resolve.call(obj1, obj1, 'this.one.two')).to.eql({
                chain: ['this', 'one', 'two'],
                idx: 2,
                exists: true,
                value: 12
            });
        });
    });
    describe('for this in the wrong place', () => {
        it('must be reported', () => {
            const obj = {one: 1};
            expect(resolve(obj, 'one.this')).to.eql({
                chain: ['one', 'this'],
                idx: 0,
                errorCode: PathErrorCode.invalidThis
            });
        });
    });

});

describe('complex', () => {
    it('must resolve everything', () => {
        const obj = {
            value: 123,
            getThis() {
                return this;
            },
            getValue() {
                return this.value;
            }
        };
        expect(resolve.call(obj, null, 'this.getThis.getValue')).to.eql({
            chain: ['this', 'getThis', 'getValue'],
            idx: 2,
            exists: true,
            value: 123
        });
    });
});
