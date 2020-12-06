import {IParseResult, ParseErrorCode} from './types';

export class ParsePropError extends Error {
    readonly code: number;
    readonly codeName: string;
    readonly chain: string[];
    readonly lastIdx: number;

    constructor(msg: string, res: IParseResult) {
        super(msg);
        this.code = <ParseErrorCode>res.errorCode;
        this.codeName = `ParseErrorCode.${ParseErrorCode[this.code]}`;
        this.chain = res.chain;
        this.lastIdx = res.lastIdx;
        Object.setPrototypeOf(this, ParsePropError.prototype);
    }
}
