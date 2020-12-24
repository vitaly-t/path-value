import {expect} from './header';
import {resolvePath as resolve, PathErrorCode} from '../src';

describe('for an empty string', () => {
    it('must fail correctly', () => {
        expect(resolve({}, '')).to.eql({chain: [''], options: undefined, idx: -1, errorCode: PathErrorCode.emptyName});
    });
});

describe('for an empty array', () => {
    it('must report correctly', () => {
        // this is to ensure that an advanced result validator can handle such case correctly:
        expect(resolve(null, [])).to.eql({chain: [], options: undefined, idx: -1, exists: true, value: undefined});
    });
});

describe('one property', () => {
    describe('this', () => {
        it('must resolve any value', () => {
            expect(resolve.call(undefined, null, 'this')).to.eql({
                chain: ['this'],
                options: undefined,
                idx: 0,
                exists: true,
                value: undefined
            });
            expect(resolve.call(null, null, 'this')).to.eql({
                chain: ['this'],
                options: undefined,
                idx: 0,
                exists: true,
                value: null
            });
            expect(resolve.call(123, null, 'this')).to.eql({
                chain: ['this'],
                options: undefined,
                idx: 0,
                exists: true,
                value: 123
            });
        });
    });
    describe('for primitive types', () => {
        it('must call functions with context', () => {
            expect(resolve(123, 'toExponential')).to.eql({
                chain: ['toExponential'],
                options: undefined,
                idx: 0,
                exists: true,
                value: '1.23e+2'
            });
            expect(resolve('test', 'length')).to.eql({
                chain: ['length'],
                options: undefined,
                idx: 0,
                exists: true,
                value: 4
            });
        });
    });
    describe('for missing object properties', () => {
        it('must resolve with undefined', () => {
            expect(resolve({}, 'one')).to.eql({
                chain: ['one'],
                options: undefined,
                idx: 0,
                exists: false,
                value: undefined
            });
        });
    });
    describe('for missing primitive properties', () => {
        it('must resolve with undefined', () => {
            expect(resolve(123, 'one')).to.eql({
                chain: ['one'],
                options: undefined,
                idx: 0,
                exists: false,
                value: undefined
            });
        });
    });
    describe('for functions', () => {
        it('must invoke correctly', () => {
            const obj1 = {one: () => 123};
            expect(resolve(obj1, 'one')).to.eql({chain: ['one'], options: undefined, idx: 0, exists: true, value: 123});
            const obj2 = {
                one: 123, getValue() {
                    return this.one;
                }
            };
            expect(resolve(obj2, 'getValue')).to.eql({
                chain: ['getValue'],
                options: undefined,
                idx: 0,
                exists: true,
                value: 123
            });
        });
    });
});

describe('multiple properties', () => {
    describe('for valid simple names', () => {
        it('must resolve', () => {
            const obj1 = {one: {two: 12}};
            expect(resolve(obj1, 'one.two')).to.eql({
                chain: ['one', 'two'],
                options: undefined,
                idx: 1,
                exists: true,
                value: 12
            });
            const obj2 = {one: {two: {three: 123}}};
            expect(resolve(obj2, 'one.two.three')).to.eql({
                chain: ['one', 'two', 'three'],
                options: undefined,
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
                options: undefined,
                idx: 0,
                errorCode: PathErrorCode.stopped
            });
            const obj2 = {one: {}};
            expect(resolve(obj2, 'one.two.three.four')).to.eql({
                chain: ['one', 'two', 'three', 'four'],
                options: undefined,
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
                options: undefined,
                idx: 1,
                exists: true,
                value: 1
            });
            expect(resolve.call(obj1, null, 'this.one')).to.eql({
                chain: ['this', 'one'],
                options: undefined,
                idx: 1,
                exists: true,
                value: 1
            });
        });
        it('must resolve any chain', () => {
            const obj1 = {one: {two: 12}};
            expect(resolve.call(obj1, obj1, 'this.one.two')).to.eql({
                chain: ['this', 'one', 'two'],
                options: undefined,
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
                options: undefined,
                idx: 0,
                errorCode: PathErrorCode.invalidThis
            });
        });
    });
});

describe('for special function', () => {
    it('must fail for async', () => {
        const obj = {value: async () => ({one: 123})};
        expect(resolve(obj, ['value', 'one'])).to.eql({
            chain: ['value', 'one'],
            options: undefined,
            idx: -1,
            errorCode: PathErrorCode.asyncValue
        });
    });
    it('must fail for generators', () => {
        const obj = {
            value: function* () {
                return {one: 123};
            }
        };
        expect(resolve(obj, ['value', 'one'])).to.eql({
            chain: ['value', 'one'],
            options: undefined,
            idx: -1,
            errorCode: PathErrorCode.genValue
        });
    });
});

describe('nested functions', () => {
    it('must resolve recursively', () => {
        const obj = {
            scope: {
                value: 123
            },
            first() {
                return this.second;
            },
            second() {
                return this.third.bind(this.scope);
            },
            third() {
                return (this as any).value;
            }
        };
        expect(resolve(obj, 'first')).to.eql({chain: ['first'], options: undefined, idx: 0, exists: true, value: 123});
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
            options: undefined,
            idx: 2,
            exists: true,
            value: 123
        });
    });
});
