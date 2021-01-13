import {IPathOptions, IPathResult, PathErrorCode} from './types';

/**
 * Custom error type used by validators.
 */
export class PathError extends Error {
    readonly code?: number;
    readonly codeName?: string;
    readonly exists?: boolean;
    readonly options?: IPathOptions;
    readonly chain: (string | number)[];
    readonly scope: any;
    readonly idx: number;

    constructor(msg: string, res: IPathResult) {
        super(msg);
        if (res.errorCode) {
            this.code = res.errorCode;
            this.codeName = `PathErrorCode.${PathErrorCode[this.code]}`;
        }
        this.chain = res.chain;
        if (res.exists !== undefined) {
            this.exists = res.exists;
        }
        if (res.options) {
            this.options = res.options;
        }
        this.idx = res.idx;
        this.scope = res.scope;
        Object.setPrototypeOf(this, PathError.prototype);
    }
}
