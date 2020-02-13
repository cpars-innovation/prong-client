import {CustomError} from '../types';

export class ProngError implements CustomError {
  constructor(public error: string | object, public statusCode?: number) {}

  toString() {
    if (this.statusCode) {
      return JSON.stringify(`{statuscode: ${this.statusCode}, 
            error:${typeof this.error === 'string' ? this.error : JSON.stringify(this.error)}`);
    } else {
      return JSON.stringify(this.error);
    }
  }
}
