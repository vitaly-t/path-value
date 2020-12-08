import {IPathResult, PathErrorCode} from './types';

/**
 * Custom error used inside IPathResult.
 */
export class PathError extends Error {
    readonly code: number;
    readonly codeName: string;
    readonly chain: string[];
    readonly idx: number;

    constructor(msg: string, res: IPathResult) {
        super(msg);
        this.code = <PathErrorCode>res.errorCode;
        this.codeName = `PathErrorCode.${PathErrorCode[this.code]}`;
        this.chain = res.chain;
        this.idx = res.idx;
        Object.setPrototypeOf(this, PathError.prototype);
    }
}
