import {expect} from './header';
import {resolveIfExists as resolve} from '../src';

describe('one value', () => {
    describe('with invalid this', () => {
        it('must resolve', () => {
            expect(resolve.call(null, {}, 'this')).to.be.null;
            expect(resolve.call(undefined, {}, 'this')).to.be.undefined;
        });
    });
    describe('with regular values', () => {
        it('must resolve', () => {
            expect(resolve({one: 1}, 'one')).to.eq(1);
            expect(resolve.call({one: {two: 2}}, null, 'this.one.two')).to.eq(2);
        });
    });
});

describe('negative', () => {
    const err = `Property "first" doesn't exist.`;
    describe('target is empty', () => {
        it('must throw error', () => {
            expect(() => {
                resolve({}, 'first');
            }).to.throw(err);
        });
    });
    describe('this is not specified', () => {
        it('must throw error', () => {
            expect(() => {
                resolve(null, 'this.first');
            }).to.throw(err);
            expect(() => {
                resolve.call({}, null, 'this.first');
            }).to.throw(err);
        });
    });
});

describe('for an empty array', () => {
    it('must return undefined', () => {
        expect(resolve(null, [])).to.be.undefined;
    });
});
