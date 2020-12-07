import {expect} from './header';
import {resolveValue as resolve} from '../src';

describe('negative', () => {
    describe('target = null/undefined', () => {
        it('must throw standard error', () => {
            const err = 'Cannot resolve "first" from null/undefined.';
            expect(() => {
                resolve(null, 'first');
            }).to.throw(err);
            expect(() => {
                resolve(undefined, 'first');
            }).to.throw(err);
        });
    });
    describe('this = null/undefined', () => {
        it('must throw standard error', () => {
            const err = 'Cannot resolve "first" from null/undefined.';
            expect(() => {
                resolve.call(null, null, 'this.first');
            }).to.throw(err);
            expect(() => {
                resolve.call(undefined, null, 'this.first');
            }).to.throw(err);
        });
    });
});
