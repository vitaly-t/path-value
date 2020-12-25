import {IPathOptions, IPathResult, PathErrorCode} from './types';

/**
 * Custom error type that's used inside IPathResult.
 */
export class PathError extends Error {
    readonly code: number;
    readonly codeName: string;
    readonly chain: Array<string | number>;
    readonly options?: IPathOptions;
    readonly idx: number;

    constructor(msg: string, res: IPathResult) {
        super(msg);
        this.code = <PathErrorCode>res.errorCode;
        this.codeName = `PathErrorCode.${PathErrorCode[this.code]}`;
        this.chain = res.chain;
        this.options = res.options;
        this.idx = res.idx;
        Object.setPrototypeOf(this, PathError.prototype);
    }
}
