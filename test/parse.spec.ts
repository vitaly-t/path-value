import {expect} from './header';
import {parseProp as parse, ParseErrorCode} from '../src';

describe('for empty string', () => {
    it('must fail correctly', () => {
        expect(parse({}, '')).to.eql({chain: [''], idx: -1, errorCode: ParseErrorCode.emptyName});
    });
});

describe('one property', () => {
    describe('this', () => {
        it('must resolve any value', () => {
            expect(parse.call(undefined, null, 'this')).to.eql({
                chain: ['this'],
                idx: 0,
                target: undefined,
                value: undefined
            });
            expect(parse.call(null, null, 'this')).to.eql({chain: ['this'], idx: 0, target: null, value: null});
            expect(parse.call(123, null, 'this')).to.eql({chain: ['this'], idx: 0, target: 123, value: 123});
        });
    });
    describe('for primitive types', () => {
        it('must call functions with context', () => {
            expect(parse(123, 'toExponential')).to.eql({
                chain: ['toExponential'],
                idx: 0,
                target: 123,
                value: '1.23e+2'
            });
            expect(parse('test', 'length')).to.eql({chain: ['length'], idx: 0, target: 'test', value: 4});
        });
    });
    describe('for missing properties', () => {
        it('must resolve with undefined', () => {
            expect(parse({}, 'one')).to.eql({chain: ['one'], idx: 0, target: {}, value: undefined});
        });
    });
    describe('for functions', () => {
        it('must invoke correctly', () => {
            const obj1 = {one: () => 123};
            expect(parse(obj1, 'one')).to.eql({chain: ['one'], idx: 0, target: obj1, value: 123});
            const obj2 = {
                one: 123, getValue() {
                    return this.one;
                }
            };
            expect(parse(obj2, 'getValue')).to.eql({chain: ['getValue'], idx: 0, target: obj2, value: 123});
        });
    });
});

describe('multiple properties', () => {
    describe('for simple names', () => {
        it('must resolve', () => {
            const obj1 = {one: {two: 12}};
            expect(parse(obj1, 'one.two')).to.eql({chain: ['one', 'two'], idx: 1, target: obj1.one, value: 12});
            const obj2 = {one: {two: {three: 123}}};
            expect(parse(obj2, 'one.two.three')).to.eql({
                chain: ['one', 'two', 'three'],
                idx: 2,
                target: obj2.one.two,
                value: 123
            });
        });
    });
    describe('for context names', () => {
        it('must resolve one property', () => {
            const obj1 = {one: 1};
            expect(parse.call(obj1, obj1, 'this.one')).to.eql({
                chain: ['this', 'one'],
                idx: 1,
                target: obj1,
                value: 1
            });
            expect(parse.call(obj1, null, 'this.one')).to.eql({
                chain: ['this', 'one'],
                idx: 1,
                target: obj1,
                value: 1
            });
        });
        it('must resolve any chain', () => {
            const obj1 = {one: {two: 12}};
            expect(parse.call(obj1, obj1, 'this.one.two')).to.eql({
                chain: ['this', 'one', 'two'],
                idx: 2,
                target: obj1.one,
                value: 12
            });
        });
    });
    describe('for this in the wrong place', () => {
        it('must be reported', () => {
            const obj = {one: 1};
            expect(parse(obj, 'one.this')).to.eql({
                chain: ['one', 'this'],
                idx: 0,
                errorCode: ParseErrorCode.invalidThis
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
        expect(parse.call(obj, null, 'this.getThis.getValue')).to.eql({
            chain: ['this', 'getThis', 'getValue'],
            idx: 2,
            target: obj,
            value: 123
        });
    });
});
