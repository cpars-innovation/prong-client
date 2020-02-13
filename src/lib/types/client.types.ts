import {RandomObject} from './general.types';
import {Key} from './Request.types';
import {CodeCredentials} from './auth.types';

export type ClientConfig = {
  url: string;
  credentials: Required<CodeCredentials>;
};

export interface IProngResourceClient {
  get(businessObjectName: string, dataSourceName: string, urlParams?: RandomObject, queryParams?: RandomObject, options?: RandomObject): Promise<any>;
  post(businessObjectName: string, dataSourceName: string, body: RandomObject, queryParams?: RandomObject, options?: RandomObject): Promise<any>;
  delete(businessObjectName: string, dataSourceName: string, key: Key, queryParams?: RandomObject, options?: RandomObject): Promise<any>;
  put(businessObjectName: string, dataSourceName: string, key: Key, body: RandomObject, queryParams?: RandomObject, options?: RandomObject): Promise<any>;
  patch(businessObjectName: string, dataSourceName: string, key: Key, body: RandomObject, queryParams?: RandomObject, options?: RandomObject): Promise<any>;
}

export interface IProngConfigClient {
  get(url: string, urlParams?: RandomObject, queryParams?: RandomObject, options?: RandomObject): Promise<any>;
  post(url: string, body: RandomObject, queryParams?: RandomObject, options?: RandomObject): Promise<any>;
  delete(url: string, key: Key, queryParams?: RandomObject, options?: RandomObject): Promise<void>;
  put(url: string, key: Key, body: RandomObject, queryParams?: RandomObject, options?: RandomObject): Promise<any>;
  patch(url: string, key: Key, body: RandomObject, queryParams?: RandomObject, options?: RandomObject): Promise<any>;
}

export interface IProngProxyClient {
  get(url: string, options?: RandomObject): Promise<any>;
  post(url: string, body: RandomObject, options?: RandomObject): Promise<any>;
  delete(url: string, options?: RandomObject): Promise<any>;
  put(url: string, body: RandomObject, options?: RandomObject): Promise<any>;
  patch(url: string, body: RandomObject, options?: RandomObject): Promise<any>;
}

export type Clients = IProngProxyClient | IProngConfigClient | IProngResourceClient;

export enum ProngEndpoints {
  CONFIG_ENDPOINT = 'config-api/v1/',
  RESOURCE_ENDPOINT = 'resource-api/v1/',
}

export enum ProngClientType {
  RESOURCE,
  CONFIG,
  PROXY,
}
