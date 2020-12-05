import {expect} from './header';
import {resolveProp as resolve} from '../src';

describe('for empty string', () => {
    it('must fail correctly', () => {
        // expect(resolve({}, '')).to.eql({chain: [''], idx: -1});
    });
});

describe('one property', () => {
    describe('this', () => {
        it('must resolve any value', () => {
            expect(resolve.call(undefined, null, 'this')).to.eql({chain: ['this'], idx: 0, value: undefined});
            expect(resolve.call(null, null, 'this')).to.eql({chain: ['this'], idx: 0, value: null});
            expect(resolve.call(123, null, 'this')).to.eql({chain: ['this'], idx: 0, value: 123});
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
