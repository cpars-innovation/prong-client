import { HttpMethods } from '../constants';
import { RandomObject } from './general.types';

export type ReqOptions = {
  body: object;
  method: HttpMethods;
  headers: {
    'Content-Type': string;
    Authorization: string;
  };
  agentOptions: {
    rejectUnauthorized: boolean,
  },
  json: boolean;
};

export type Key = {
  [key: string]:  string | number;
}