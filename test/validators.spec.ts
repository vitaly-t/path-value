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
            expect(validateErrorCode(res)).toBeUndefined();
        });
    });

    describe('negative', () => {
        describe('empty mame', () => {
            it('must throw error', () => {
                const res = resolve(null, '');
                expect(() => {
                    validateErrorCode(res);
                }).toThrow('Empty names are not allowed.');
            });
            it('must throw PathError', () => {
                const res = resolve(null, '');
                expect(() => {
                    validateErrorCode(res);
                }).toThrow(PathError);
            });
            it('must throw valid error', () => {
                let err: PathError | undefined;
                try {
                    validateErrorCode(resolve(null, ''));
                } catch (e) {
                    err = e as any;
                }
                expect(err).toBeDefined();
                expect(err?.name).toEqual('Error');
                expect(err?.options).toBeUndefined();
                expect(err?.code).toEqual(1);
                expect(err?.codeName).toEqual('PathErrorCode.emptyName');
                expect(err?.chain).toEqual(['']);
                expect(err?.idx).toEqual(-1);
            });
        });
        describe('trailing this', () => {
            it('must throw error', () => {
                const errMsg = `Keyword 'this' can only be at the start.`;
                expect(() => {
                    validateErrorCode(resolve({first: 123}, 'first.this'));
                }).toThrow(errMsg);
                expect(() => {
                    validateErrorCode(resolve.call({}, {first: 123}, 'this.this'));
                }).toThrow(errMsg);
            });
        });
        describe('async value', () => {
            const errMsg = (name: string) => `Cannot resolve "${name}": async functions and values are not supported.`;
            it('must throw on context', () => {
                const res1 = resolve.call(async () => {
                }, null, 'this');
                expect(() => {
                    validateErrorCode(res1);
                }).toThrow(errMsg('this'));
                const res2 = resolve.call({
                    first: async () => {
                    }
                }, null, 'this.first');
                expect(() => {
                    validateErrorCode(res2);
                }).toThrow(errMsg('first'));
            });
            it('must throw on value', () => {
                const obj = {
                    first: async () => {
                    }
                };
                const res = resolve(obj, 'first');
                expect(() => {
                    validateErrorCode(res);
                }).toThrow(errMsg('first'));
            });
        });
        describe('generator value', () => {
            const errMsg = (name: string) => `Cannot resolve "${name}": iterators and generators are not supported.`;
            it('must throw on context', () => {
                const res1 = resolve.call(function* () {
                }, null, 'this');
                expect(() => {
                    validateErrorCode(res1);
                }).toThrow(errMsg('this'));
                const res2 = resolve.call({
                    first: function* () {
                    }
                }, null, 'this.first');
                expect(() => {
                    validateErrorCode(res2);
                }).toThrow(errMsg('first'));
            });
            it('must throw on value', () => {
                const obj = {
                    first: function* () {
                    }
                };
                const res = resolve(obj, 'first');
                expect(() => {
                    validateErrorCode(res);
                }).toThrow(errMsg('first'));
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
        expect(validateExists(res)).toBeUndefined();
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
            expect(err.message).toEqual(`Property "first" doesn't exist.`);
            expect(err.chain).toEqual(['first']);
            expect(err.propName).toEqual('first');
            expect(err.scope).toEqual(123);
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
            expect(err.message).toEqual(`Property 222 doesn't exist.`); // NOTE: no double-quotes for numbers
            expect(err.chain).toEqual(['first', 222]);
            expect(err.propName).toEqual(222);
            expect(err.scope).toEqual({first: []});
        });
    });

});
