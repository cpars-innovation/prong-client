import {Authenticator, IAuthenticator} from '../auth';
import {CONTENT_TYPE, HttpMethods} from '../constants';
import {AuthenticationError, AuthenticatorError} from '../constants/ErrorMessages';
import {CodeCredentials, Key, RandomObject, ReqOptions} from '../types';
import {createError, isValidUrl} from '../utils';

import requestPromise = require('request-promise-native');

export interface IProngClient {
  get(businessObjectName: string, dataSourceName: string, urlParams?: RandomObject, queryParams?: RandomObject, options?: RandomObject): Promise<any>;
  post(businessObjectName: string, dataSourceName: string, body: RandomObject, queryParams?: RandomObject, options?: RandomObject): Promise<any>;
  delete(businessObjectName: string, dataSourceName: string, key: Key, queryParams?: RandomObject, options?: RandomObject): Promise<any>;
  put(businessObjectName: string, dataSourceName: string, key: Key, body: RandomObject, queryParams?: RandomObject, options?: RandomObject): Promise<any>;
  patch(businessObjectName: string, dataSourceName: string, key: Key, body: RandomObject, queryParams?: RandomObject, options?: RandomObject): Promise<any>;
}

/**
 * @class ProngClient
 * Class acting as a Prong Client
 * @Property
 * */
export class ProngClient implements IProngClient {
  private authenticator: IAuthenticator;
  private _baseUrl: string;

  /**
   * Create a client for easy use of the Prong service
   * @constructor
   * @param
   * @property
   * @returns {ProngClient}
   */
  constructor(config: {url: string; credentials: Required<CodeCredentials>}) {
    const {url, credentials} = config;
    if (credentials && credentials.client_id && credentials.username && credentials.client_secret && credentials.password && url && isValidUrl(url)) {
      this.authenticator = new Authenticator(url, credentials);
      this._baseUrl = url.substr(url.length - 1) !== '/' ? url + '/' : url;
    } else {
      if (!url || !isValidUrl(url)) {
        throw createError(AuthenticationError.MISSING_MALFORMED_URL, 401);
      }
      throw createError(AuthenticationError.MISSING_CREDENTIALS, 401);
    }
  }

  /**********************************************/
  /** ProngClient Public Methods (GET/POST...) **/
  /**********************************************/

  // GET METHOD
  public async get(businessObjectName: string, dataSourceName: string, urlParams?: RandomObject, queryParams?: RandomObject, options?: RandomObject) {
    const url = this.createUrl(this._baseUrl, businessObjectName, dataSourceName);
    const optionsInternal = await this.createOptions(HttpMethods.GET, options);
    const result = await this.sendRequest(url, optionsInternal, {urlParams, queryParams});
    return result;
  }

  // POST METHOD
  public async post(businessObjectName: string, dataSourceName: string, body: RandomObject, queryParams?: RandomObject, options?: RandomObject) {
    const url = this.createUrl(this._baseUrl, businessObjectName, dataSourceName);
    const optionsInternal = await this.createOptions(HttpMethods.POST, options, body);
    return await this.sendRequest(url, optionsInternal, {queryParams});
  }

  // DELETE METHOD
  public async delete(businessObjectName: string, dataSourceName: string, key: Key, queryParams?: RandomObject, options?: RandomObject) {
    const url = this.createUrl(this._baseUrl, businessObjectName, dataSourceName);
    const optionsInternal = await this.createOptions(HttpMethods.DELETE, options);
    return await this.sendRequest(url, optionsInternal, {urlParams: key, queryParams});
  }

  // PUT METHOD
  public async put(businessObjectName: string, dataSourceName: string, key: Key, body: RandomObject, queryParams?: RandomObject, options?: RandomObject) {
    const url = this.createUrl(this._baseUrl, businessObjectName, dataSourceName);
    const optionsInternal = await this.createOptions(HttpMethods.PUT, options, body);
    return await this.sendRequest(url, optionsInternal, {urlParams: key, queryParams});
  }

  // PATCH METHOD
  public async patch(businessObjectName: string, dataSourceName: string, key: Key, body: RandomObject, queryParams?: RandomObject, options?: RandomObject) {
    const url = this.createUrl(this._baseUrl, businessObjectName, dataSourceName);
    const optionsInternal = await this.createOptions(HttpMethods.PATCH, options, body);
    return await this.sendRequest(url, optionsInternal, {urlParams: key, queryParams});
  }

  /****************************************/
  /** ProngClient Private Helper Methods **/
  /****************************************/

  private async createOptions(httpMethod: HttpMethods, options: RandomObject = {headers: {}}, body: RandomObject = {}) {
    return {
      ...{
        agentOptions: {
          rejectUnauthorized: false,
        },
        json: true,
      },
      ...options,
      ...{
        method: httpMethod,
        body: body,
        headers: {'Content-Type': CONTENT_TYPE.JSON, ...options.headers, Authorization: await this.authenticator.getAccessToken()},
      },
    };
  }

  private async sendRequest(url: string, options: Partial<ReqOptions>, params?: {urlParams?: RandomObject; queryParams?: RandomObject}) {
    if (params) {
      url = this.formatUrl(url, params);
    }
    let result: object = {};
    try {
      result = await requestPromise(url, options);
    } catch (error) {
      if (error.statusCode == '401') {
        const token = await this.authenticator.getAccessToken(true);
        try{
         return  await requestPromise(url, {...options, headers: {...options.headers, Authorization: token}});
        }catch(e){
          throw createError(AuthenticatorError.ACCESS_TOKEN_ERROR, 401);
        }
      }
      throw createError(JSON.parse(error.message.substring(5)).error, error.statusCode);
    }
    return result;
  }

  private formatUrl(url: string, params: {urlParams?: RandomObject; queryParams?: RandomObject}) {
    //url = url.substr(url.length - 1) !== '/' ? url + '/' : url;

    if (params.urlParams) {
      for (let [key, value] of Object.entries(params.urlParams)) {
        url = url + key + '=' + value + ',';
      }
      url = url.slice(0, -1);
    }
    if (params.queryParams) {
      url = url + '?';
      for (let [key, value] of Object.entries(params.queryParams)) {
        url = url + key + '=' + value + '&';
      }
      url = url.slice(0, -1);
    }
    return url;
  }

  private createUrl(baseUrl: string, businessObjectName: string, dataSourceName: string) {
    baseUrl = baseUrl.substr(baseUrl.length - 1) !== '/' ? baseUrl + '/' : baseUrl;
    return baseUrl + 'resource-api/v1/' + dataSourceName + '/BusinessObjects/' + businessObjectName + '/';
  }
}
