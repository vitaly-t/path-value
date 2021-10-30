import {expect} from './header';
import {
    resolvePath as resolve,
    PathError,
    PathExistError,
    validateErrorCode,
    validateExists,
    IPathResult
} from '../src';

describe('validateErrorCode', () => {
    describe('for valid path', () => {
        it('must do nothing', () => {
            const obj = {first: {second: 123}};
            const res = resolve(obj, 'first.second');
            expect(validateErrorCode(res)).to.be.undefined;
        });
    });

    describe('negative', () => {
        describe('empty mame', () => {
            it('must throw error', () => {
                const res = resolve(null, '');
                expect(() => {
                    validateErrorCode(res);
                }).to.throw('Empty names are not allowed.');
            });
            it('must throw PathError', () => {
                const res = resolve(null, '');
                expect(() => {
                    validateErrorCode(res);
                }).to.throw(PathError);
            });
            it('must throw valid error', () => {
                let err: PathError | undefined;
                try {
                    validateErrorCode(resolve(null, ''));
                } catch (e) {
                    err = e as any;
                }
                expect(err).to.not.be.undefined;
                expect(err?.name).to.eq('Error');
                expect(err?.options).to.be.undefined;
                expect(err?.code).to.eq(1);
                expect(err?.codeName).to.eq('PathErrorCode.emptyName');
                expect(err?.chain).to.eql(['']);
                expect(err?.idx).to.eq(-1);
            });
        });
        describe('trailing this', () => {
            it('must throw error', () => {
                const errMsg = `Keyword 'this' can only be at the start.`;
                expect(() => {
                    validateErrorCode(resolve({first: 123}, 'first.this'));
                }).to.throw(errMsg);
                expect(() => {
                    validateErrorCode(resolve.call({}, {first: 123}, 'this.this'));
                }).to.throw(errMsg);
            });
        });
        describe('async value', () => {
            const errMsg = (name: string) => `Cannot resolve "${name}": async functions and values are not supported.`;
            it('must throw on context', () => {
                const res1 = resolve.call(async () => {
                }, null, 'this');
                expect(() => {
                    validateErrorCode(res1);
                }).to.throw(errMsg('this'));
                const res2 = resolve.call({
                    first: async () => {
                    }
                }, null, 'this.first');
                expect(() => {
                    validateErrorCode(res2);
                }).to.throw(errMsg('first'));
            });
            it('must throw on value', () => {
                const obj = {
                    first: async () => {
                    }
                };
                const res = resolve(obj, 'first');
                expect(() => {
                    validateErrorCode(res);
                }).to.throw(errMsg('first'));
            });
        });
        describe('generator value', () => {
            const errMsg = (name: string) => `Cannot resolve "${name}": iterators and generators are not supported.`;
            it('must throw on context', () => {
                const res1 = resolve.call(function* () {
                }, null, 'this');
                expect(() => {
                    validateErrorCode(res1);
                }).to.throw(errMsg('this'));
                const res2 = resolve.call({
                    first: function* () {
                    }
                }, null, 'this.first');
                expect(() => {
                    validateErrorCode(res2);
                }).to.throw(errMsg('first'));
            });
            it('must throw on value', () => {
                const obj = {
                    first: function* () {
                    }
                };
                const res = resolve(obj, 'first');
                expect(() => {
                    validateErrorCode(res);
                }).to.throw(errMsg('first'));
            });
        });
    });
});

describe('validateExists', () => {
    it('must do nothing when flag is true', () => {
        const res: IPathResult = {
            chain: [],
            scope: null,
            idx: 0,
            exists: true
        };
        expect(validateExists(res)).to.be.undefined;
    });
    describe('for a string', () => {
        it('must throw when flag is not set', () => {
            const res: IPathResult = {
                chain: ['first'],
                scope: 123,
                idx: 0,
                exists: false
            };
            let err: PathExistError = {} as any;
            try {
                validateExists(res);
            } catch (e) {
                err = e as any;
            }
            expect(err.message).to.eq(`Property "first" doesn't exist.`);
            expect(err.chain).to.eql(['first']);
            expect(err.propName).to.eq('first');
            expect(err.scope).to.eq(123);
        });
    });
    describe('for a number', () => {
        it('must throw when flag is not set', () => {
            const res: IPathResult = {
                chain: ['first', 222],
                scope: {first: []},
                idx: 1,
                exists: false
            };
            let err: PathExistError = {} as any;
            try {
                validateExists(res);
            } catch (e) {
                err = e as any;
            }
            expect(err.message).to.eq(`Property 222 doesn't exist.`); // NOTE: no double-quotes for numbers
            expect(err.chain).to.eql(['first', 222]);
            expect(err.propName).to.eq(222);
            expect(err.scope).to.eql({first: []});
        });
    });

});
