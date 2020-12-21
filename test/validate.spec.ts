import {expect} from './header';
import {resolvePath, validatePathResult as validate} from '../src';

describe('for valid path', () => {
    it('must do nothing', () => {
        const obj = {first: {second: 123}};
        const res = resolvePath(obj, 'first.second');
        expect(validate(res)).to.be.undefined;
    });
});

describe('negative', () => {
    describe('empty mame', () => {
        it('must throw error', () => {
            const res = resolvePath(null, '');
            expect(() => {
                validate(res);
            }).to.throw('Empty names are not allowed.');
        });
    });
    describe('trailing this', () => {
        it('must throw error', () => {
            const res = resolvePath({first: 123}, 'first.this');
            expect(() => {
                validate(res);
            }).to.throw(`Keyword 'this' can only be at the start.`);
        });
    });
    describe('async value', () => {
        /*
        it('must throw on context', () => {
            const res = resolvePath.call(async () => {
            }, null, 'this');
            expect(() => {
                validate(res);
            }).to.throw(`bla`);
        });*/
        it('must throw on value', () => {
            const obj = {
                first: async () => {
                }
            };
            const res = resolvePath(obj, 'first');
            expect(() => {
                validate(res);
            }).to.throw(`Cannot resolve "first": async functions and values are not supported.`);
        });
    });
});
