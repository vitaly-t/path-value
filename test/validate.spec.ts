import {expect} from './header';
import {resolvePath, PathError, validatePathResult as validate} from '../src';

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
        it('must throw PathError', () => {
            const res = resolvePath(null, '');
            expect(() => {
                validate(res);
            }).to.throw(PathError);
        });
    });
    describe('trailing this', () => {
        it('must throw error', () => {
            const errMsg = `Keyword 'this' can only be at the start.`;
            expect(() => {
                validate(resolvePath({first: 123}, 'first.this'));
            }).to.throw(errMsg);
            expect(() => {
                validate(resolvePath({first: 123}, 'this.this'));
            }).to.throw(errMsg);
        });
    });
    describe('async value', () => {
        const errMsg = (name: string) => `Cannot resolve "${name}": async functions and values are not supported.`;
        it('must throw on context', () => {
            const res1 = resolvePath.call(async () => {
            }, null, 'this');
            expect(() => {
                validate(res1);
            }).to.throw(errMsg('this'));
            const res2 = resolvePath.call({
                first: async () => {
                }
            }, null, 'this.first');
            expect(() => {
                validate(res2);
            }).to.throw(errMsg('first'));
        });
        it('must throw on value', () => {
            const obj = {
                first: async () => {
                }
            };
            const res = resolvePath(obj, 'first');
            expect(() => {
                validate(res);
            }).to.throw(errMsg('first'));
        });
    });
    describe('generator value', () => {
        const errMsg = (name: string) => `Cannot resolve "${name}": iterators and generators are not supported.`;
        it('must throw on context', () => {
            const res1 = resolvePath.call(function* () {
            }, null, 'this');
            expect(() => {
                validate(res1);
            }).to.throw(errMsg('this'));
            const res2 = resolvePath.call({
                first: function* () {
                }
            }, null, 'this.first');
            expect(() => {
                validate(res2);
            }).to.throw(errMsg('first'));
        });
        it('must throw on value', () => {
            const obj = {
                first: function* () {
                }
            };
            const res = resolvePath(obj, 'first');
            expect(() => {
                validate(res);
            }).to.throw(errMsg('first'));
        });
    });
});
