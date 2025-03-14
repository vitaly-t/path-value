import {resolveValue, resolveIfExists} from '../src';

describe('resolveValue', () => {
    describe('for valid path', () => {
        it('must return value', () => {
            const obj = {first: {second: 123}};
            expect(resolveValue(obj, 'first.second')).toEqual(123);
        });
    });

    describe('negative', () => {
        describe('target = null/undefined', () => {
            it('must throw standard error', () => {
                const err = 'Cannot resolve "first" from null/undefined.';
                expect(() => {
                    resolveValue(null, 'first');
                }).toThrow(err);
                expect(() => {
                    resolveValue(undefined, 'first');
                }).toThrow(err);
            });
        });
        describe('this = null/undefined', () => {
            it('must throw standard error', () => {
                const err = 'Cannot resolve "first" from null/undefined.';
                expect(() => {
                    resolveValue.call(null, null, 'this.first');
                }).toThrow(err);
                expect(() => {
                    resolveValue.call(undefined, null, 'this.first');
                }).toThrow(err);
            });
        });
    });
});

describe('resolveIfExists', () => {
    describe('one value', () => {
        describe('with invalid this', () => {
            it('must resolve', () => {
                expect(resolveIfExists.call(null, {}, 'this')).toBeNull();
                expect(resolveIfExists.call(undefined, {}, 'this')).toBeUndefined();
            });
        });
        describe('with regular values', () => {
            it('must resolve', () => {
                expect(resolveIfExists({one: 1}, 'one')).toEqual(1);
                expect(resolveIfExists.call({one: {two: 2}}, null, 'this.one.two')).toEqual(2);
            });
        });
    });

    describe('negative', () => {
        const err = `Property "first" doesn't exist.`;
        describe('target is empty', () => {
            it('must throw error', () => {
                expect(() => {
                    resolveIfExists({}, 'first');
                }).toThrow(err);
            });
        });
        describe('this is not specified', () => {
            it('must throw error', () => {
                expect(() => {
                    resolveIfExists(null, 'this.first');
                }).toThrow(`Cannot resolve "first" from null/undefined.`);
                expect(() => {
                    resolveIfExists.call({}, null, 'this.first');
                }).toThrow(err);
            });
        });
    });

    describe('for an empty array', () => {
        it('must return undefined', () => {
            expect(resolveIfExists(null, [])).toBeUndefined();
        });
    });
});
