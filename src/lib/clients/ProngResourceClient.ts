import {HttpMethods} from '../constants';
import {ClientConfig, IProngResourceClient, Key, ProngEndpoints, RandomObject} from '../types';
import {BaseClient} from './BaseClient';

/**
 * @class ProngClient
 * Class acting as a Prong Client
 * @Property
 * */
export class ProngResourceClient extends BaseClient implements IProngResourceClient {
  /**
   * Create a client for easy use of the Prong service
   * @constructor
   * @param
   * @property
   * @returns {ProngClient}
   */
  constructor(config: ClientConfig) {
    super(config);
    this.baseUrl = this.baseUrl + ProngEndpoints.RESOURCE_ENDPOINT;
  }

  /**********************************************/
  /** ProngResourceClient Public Methods (GET/POST...) **/
  /**********************************************/

  /**
   * Get Resource 
   * @param businessObjectName 
   * @param dataSourceName 
   * @param urlParams 
   * @param queryParams 
   * @param options 
   */
  public async get(businessObjectName: string, dataSourceName: string, urlParams?: RandomObject, queryParams?: RandomObject, options?: RandomObject) {
    const url = this.createUrl(businessObjectName, dataSourceName);
    const optionsInternal = await this.createOptions(HttpMethods.GET, options);
    return await this.sendRequest(url, optionsInternal, {urlParams, queryParams});
  }

  /**
   * 
   * @param businessObjectName 
   * @param dataSourceName 
   * @param body 
   * @param queryParams 
   * @param options 
   */
  public async post(businessObjectName: string, dataSourceName: string, body: RandomObject, queryParams?: RandomObject, options?: RandomObject) {
    const url = this.createUrl(businessObjectName, dataSourceName);
    const optionsInternal = await this.createOptions(HttpMethods.POST, options, body);
    return await this.sendRequest(url, optionsInternal, {queryParams});
  }

  /**
   * 
   * @param businessObjectName 
   * @param dataSourceName 
   * @param key 
   * @param queryParams 
   * @param options 
   */
  public async delete(businessObjectName: string, dataSourceName: string, key: Key, queryParams?: RandomObject, options?: RandomObject) {
    const url = this.createUrl(businessObjectName, dataSourceName);
    const optionsInternal = await this.createOptions(HttpMethods.DELETE, options);
    return await this.sendRequest(url, optionsInternal, {urlParams: key, queryParams});
  }

  /**
   * 
   * @param businessObjectName 
   * @param dataSourceName 
   * @param key 
   * @param body 
   * @param queryParams 
   * @param options 
   */
  public async put(businessObjectName: string, dataSourceName: string, key: Key, body: RandomObject, queryParams?: RandomObject, options?: RandomObject) {
    const url = this.createUrl(businessObjectName, dataSourceName);
    const optionsInternal = await this.createOptions(HttpMethods.PUT, options, body);
    return await this.sendRequest(url, optionsInternal, {urlParams: key, queryParams});
  }

  /**
   * 
   * @param businessObjectName 
   * @param dataSourceName 
   * @param key 
   * @param body 
   * @param queryParams 
   * @param options 
   */
  public async patch(businessObjectName: string, dataSourceName: string, key: Key, body: RandomObject, queryParams?: RandomObject, options?: RandomObject) {
    const url = this.createUrl(businessObjectName, dataSourceName);
    const optionsInternal = await this.createOptions(HttpMethods.PATCH, options, body);
    return await this.sendRequest(url, optionsInternal, {urlParams: key, queryParams});
  }

  /**
   * Combines args into string 
   * @param args 
   */
  protected createUrl(...args: string[]) {
    return [this.baseUrl, args[0], '/BusinessObjects/', args[1]].join('');
  }
}
