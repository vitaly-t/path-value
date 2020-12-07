import {IPathResult, ParseErrorCode} from './types';

export class ParsePropError extends Error {
    readonly code: number;
    readonly codeName: string;
    readonly chain: string[];
    readonly idx: number;

    constructor(msg: string, res: IPathResult) {
        super(msg);
        this.code = <ParseErrorCode>res.errorCode;
        this.codeName = `ParseErrorCode.${ParseErrorCode[this.code]}`;
        this.chain = res.chain;
        this.idx = res.idx;
        Object.setPrototypeOf(this, ParsePropError.prototype);
    }
}
