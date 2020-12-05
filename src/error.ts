import {IPropResolution} from './types';

export class ParsePropError extends Error {

    private res: IPropResolution;

    constructor(msg: string, res: IPropResolution) {
        super(msg);
        this.res = res;
        Object.setPrototypeOf(this, ParsePropError.prototype);
    }

    get chain() {
        return this.res.chain;
    }

    get idx() {
        return this.res.idx;
    }

    get code() {
        return this.res.errorCode;
    }
}
