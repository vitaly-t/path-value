import {IPathOptions, IPathResult, PathErrorCode} from './types';

/**
 * Custom error type, thrown by `validateErrorCode`.
 */
export class PathError extends Error {

    readonly chain: (string | number)[];
    readonly code: number;
    readonly codeName: string;
    readonly options?: IPathOptions;
    readonly idx: number;
    readonly scope: any;

    constructor(msg: string, res: IPathResult) {
        super(msg);
        this.chain = res.chain;
        this.code = <PathErrorCode>res.errorCode;
        this.codeName = `PathErrorCode.${PathErrorCode[this.code]}`;
        if (res.options) {
            this.options = res.options;
        }
        this.idx = res.idx;
        this.scope = res.scope;
        Object.setPrototypeOf(this, PathError.prototype);
    }
}

/**
 * Custom error type, thrown by `validateExists`.
 */
export class PathExistError extends Error {

    readonly chain: (string | number)[];
    readonly propName: string;
    readonly options?: IPathOptions;
    readonly scope: any;

    constructor(msg: string, res: IPathResult, propName: string) {
        super(msg);
        this.chain = res.chain;
        this.propName = propName;
        if (res.options) {
            this.options = res.options;
        }
        this.scope = res.scope;
        Object.setPrototypeOf(this, PathExistError.prototype);
    }
}
