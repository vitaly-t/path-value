import {expect} from './header';
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
            expect(err.message).to.eq(errMsg);
            expect(err.chain).to.eql(['this', 'value']);
            expect(err.code).to.eq(5);
            expect(err.codeName).to.eq('PathErrorCode.stopped');
            expect(err.scope).to.eq(123);
            expect(err.options).to.eql({ignoreFunctions: true});
            expect(err.idx).to.eq(1);
        });
    });

    describe('PathExistError', () => {
        const err = new PathExistError(errMsg, res, 'value');
        it('must correctly set all details', () => {
            expect(err.message).to.eq(errMsg);
            expect(err.chain).to.eql(['this', 'value']);
            expect(err.propName).to.eq('value');
            expect(err.options).to.eql({ignoreFunctions: true});
            expect(err.scope).to.eq(123);
        });
    });
});
