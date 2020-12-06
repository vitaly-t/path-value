import {expect} from './header';
import {resolveValue} from '../src';

describe('negative', () => {
    describe('target = null/undefined', () => {
        it('must throw standard error', () => {
            const err = 'Cannot resolve "first" from null/undefined.';
            expect(() => {
                resolveValue(null, 'first');
            }).to.throw(err);
            expect(() => {
                resolveValue(undefined, 'first');
            }).to.throw(err);
        });
    });
    describe('this = null/undefined', () => {
        it('must throw standard error', () => {
            const err = 'Cannot resolve "first" from null/undefined.';
            expect(() => {
                resolveValue.call(null, null, 'this.first');
            }).to.throw(err);
            expect(() => {
                resolveValue.call(undefined, null, 'this.first');
            }).to.throw(err);
        });
    });
});
