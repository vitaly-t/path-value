import {expect} from './header';
import {resolveProp as resolve} from '../src';

describe('for empty string', () => {
    it('must fail correctly', () => {
        expect(resolve({}, '')).to.eql({chain: [''], idx: -1});
    });
});

describe('one property', () => {
    describe('this', () => {
        it('must resolve any value', () => {
            expect(resolve.call(undefined, null, 'this')).to.eql({
                chain: ['this'],
                idx: 0,
                target: undefined,
                value: undefined
            });
            expect(resolve.call(null, null, 'this')).to.eql({chain: ['this'], idx: 0, target: null, value: null});
            expect(resolve.call(123, null, 'this')).to.eql({chain: ['this'], idx: 0, target: 123, value: 123});
        });
    });
    describe('for primitive types', () => {
        it('must call functions with context', () => {
            expect(resolve(123, 'toExponential')).to.eql({
                chain: ['toExponential'],
                idx: 0,
                target: 123,
                value: '1.23e+2'
            });
            expect(resolve('test', 'length')).to.eql({chain: ['length'], idx: 0, target: 'test', value: 4});
        });
    });
    describe('for missing properties', () => {
        it('must resolve with undefined', () => {
            expect(resolve({}, 'one')).to.eql({chain: ['one'], idx: 0, target: {}, value: undefined});
        });
    });
});

describe('multiple properties', () => {
    describe('for simple names', () => {
        it('must resolve', () => {
            const obj1 = {one: {two: 12}};
            expect(resolve(obj1, 'one.two')).to.eql({chain: ['one', 'two'], idx: 1, target: obj1.one, value: 12});
            const obj2 = {one: {two: {three: 123}}};
            expect(resolve(obj2, 'one.two.three')).to.eql({
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
            expect(resolve.call(obj1, obj1, 'this.one')).to.eql({
                chain: ['this', 'one'],
                idx: 1,
                target: obj1,
                value: 1
            });
            expect(resolve.call(obj1, null, 'this.one')).to.eql({
                chain: ['this', 'one'],
                idx: 1,
                target: obj1,
                value: 1
            });
        });
        it('must resolve any chain', () => {
            const obj1 = {one: {two: 12}};
            expect(resolve.call(obj1, obj1, 'this.one.two')).to.eql({
                chain: ['this', 'one', 'two'],
                idx: 2,
                target: obj1.one,
                value: 12
            });
        });

    });

});
