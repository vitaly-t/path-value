import {IPathResult, PathError, PathExistError} from '../src';

describe('error', () => {
    const res: IPathResult = {
        chain: ['this', 'value'],
        errorCode: 5,
        exists: false,
        options: {ignoreFunctions: true},
        scope: 123,
        idx: 1
    };

    const errMsg = 'Ops!';

    describe('PathError', () => {
        const err = new PathError(errMsg, res);
        it('must correctly set all details', () => {
            expect(err.message).toEqual(errMsg);
            expect(err.chain).toEqual(['this', 'value']);
            expect(err.code).toEqual(5);
            expect(err.codeName).toEqual('PathErrorCode.stopped');
            expect(err.scope).toEqual(123);
            expect(err.options).toEqual({ignoreFunctions: true});
            expect(err.idx).toEqual(1);
        });
    });

    describe('PathExistError', () => {
        const err = new PathExistError(errMsg, res, 'value');
        it('must correctly set all details', () => {
            expect(err.message).toEqual(errMsg);
            expect(err.chain).toEqual(['this', 'value']);
            expect(err.propName).toEqual('value');
            expect(err.options).toEqual({ignoreFunctions: true});
            expect(err.scope).toEqual(123);
        });
    });
});
