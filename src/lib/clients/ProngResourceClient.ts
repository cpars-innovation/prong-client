import {HttpMethods} from '../constants';
import {ClientConfig, IProngResourceClient, Key, ProngEndpoints, RandomObject} from '../types';
import {BaseClient} from "./BaseClient";


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

    // GET METHOD
    public async get(businessObjectName: string, dataSourceName: string, urlParams?: RandomObject, queryParams?: RandomObject, options?: RandomObject) {
        const url = this.createUrl(businessObjectName, dataSourceName);
        const optionsInternal = await this.createOptions(HttpMethods.GET, options);
        return await this.sendRequest(url, optionsInternal, {urlParams, queryParams});
    }

    // POST METHOD
    public async post(businessObjectName: string, dataSourceName: string, body: RandomObject, queryParams?: RandomObject, options?: RandomObject) {
        const url = this.createUrl(businessObjectName, dataSourceName);
        const optionsInternal = await this.createOptions(HttpMethods.POST, options, body);
        return await this.sendRequest(url, optionsInternal, {queryParams});
    }

    // DELETE METHOD
    public async delete(businessObjectName: string, dataSourceName: string, key: Key, queryParams?: RandomObject, options?: RandomObject) {
        const url = this.createUrl(businessObjectName, dataSourceName);
        const optionsInternal = await this.createOptions(HttpMethods.DELETE, options);
        return await this.sendRequest(url, optionsInternal, {urlParams: key, queryParams});
    }

    // PUT METHOD
    public async put(businessObjectName: string, dataSourceName: string, key: Key, body: RandomObject, queryParams?: RandomObject, options?: RandomObject) {
        const url = this.createUrl(businessObjectName, dataSourceName);
        const optionsInternal = await this.createOptions(HttpMethods.PUT, options, body);
        return await this.sendRequest(url, optionsInternal, {urlParams: key, queryParams});
    }

    // PATCH METHOD
    public async patch(businessObjectName: string, dataSourceName: string, key: Key, body: RandomObject, queryParams?: RandomObject, options?: RandomObject) {
        const url = this.createUrl(businessObjectName, dataSourceName);
        const optionsInternal = await this.createOptions(HttpMethods.PATCH, options, body);
        return await this.sendRequest(url, optionsInternal, {urlParams: key, queryParams});
    }

    protected createUrl(...args: Array<string>) {
        return [
            this.baseUrl,
            args[0],
            '/BusinessObjects/',
            args[1]
        ].join('');
    }


}
