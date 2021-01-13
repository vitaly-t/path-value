import {expect} from './header';
import {IPathResult, PathError} from '../src';

describe('PathError', () => {
    const res: IPathResult = {
        chain: ['this', 'value'],
        errorCode: 5,
        exists: false,
        options: {ignoreFunctions: true},
        scope: 123,
        idx: 1
    };
    const msg = 'ops!';
    const err = new PathError(msg, res);
    it('must set correctly all details', () => {
        expect(err.chain).to.eq(res.chain);
        expect(err.code).to.eq(res.errorCode);
        expect(err.codeName).to.eq('PathErrorCode.stopped');
        expect(err.scope).to.eq(res.scope);
        expect(err.options).to.eq(res.options);
        expect(err.idx).to.eq(res.idx);
    });
});
