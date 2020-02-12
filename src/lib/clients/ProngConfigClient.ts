import {ClientConfig, IProngConfigClient, Key, ProngEndpoints, RandomObject} from "../types";
import {BaseClient} from "./BaseClient";
import {HttpMethods} from "../constants";


export class ProngConfigClient extends BaseClient implements IProngConfigClient {


    constructor(config: ClientConfig) {
        super(config);
        this.baseUrl = this.baseUrl + ProngEndpoints.CONFIG_ENDPOINT;
    }


    public async get(url: string, urlParams?: RandomObject, queryParams?: RandomObject, options?: RandomObject): Promise<any> {
        const requestUrl = this.createUrl(url);
        const optionsInternal = await this.createOptions(HttpMethods.GET, options);
        return await this.sendRequest(requestUrl, optionsInternal, {urlParams, queryParams});
    }

    public async post(url: string, body: RandomObject, queryParams?: RandomObject, options?: RandomObject): Promise<any> {
        const optionsInternal = await this.createOptions(HttpMethods.POST, options, body);
        return await this.sendRequest(this.createUrl(url), optionsInternal, {queryParams});
    }

    public async delete(url: string, key: Key, queryParams?: RandomObject, options?: RandomObject): Promise<void> {
        const optionsInternal = await this.createOptions(HttpMethods.DELETE, options);
        await this.sendRequest(this.createUrl(url), optionsInternal, {urlParams: key, queryParams});
    }

    public async put(url: string, key: Key, body: RandomObject, queryParams?: RandomObject, options?: RandomObject): Promise<any> {
        const optionsInternal = await this.createOptions(HttpMethods.PUT, options, body);
        return await this.sendRequest(this.createUrl(url), optionsInternal, {urlParams: key, queryParams});
    }

    public async patch(url: string, key: Key, body: RandomObject, queryParams?: RandomObject, options?: RandomObject): Promise<any> {
        const optionsInternal = await this.createOptions(HttpMethods.PATCH, options, body);
        return await this.sendRequest(this.createUrl(url), optionsInternal, {urlParams: key, queryParams});
    }


    protected createUrl(...args: Array<string>) {
        return [this.baseUrl, ...args, '/'].join('');
    }

}
