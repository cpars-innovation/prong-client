import {BaseClient} from "./BaseClient";
import {ClientConfig, IProngProxyClient, RandomObject} from "../types";
import {HttpMethods} from "../constants";


export class ProngProxyClient extends BaseClient implements IProngProxyClient{

    constructor(config: ClientConfig) {
        super(config);
    }

   public async get(url: string, options: RandomObject): Promise<any> {
        const optionsInternal = await this.createOptions(HttpMethods.GET, options);
        return await this.sendRequest(this.createUrl(url), optionsInternal);
    }

    public async delete(url: string, options?: RandomObject): Promise<any> {
        const optionsInternal = await this.createOptions(HttpMethods.DELETE, options);
        return await this.sendRequest(this.createUrl(url), optionsInternal);

    }

    public async patch(url: string, body: RandomObject, options?: RandomObject): Promise<any> {
        const optionsInternal = await this.createOptions(HttpMethods.PATCH, options, body);
        return await this.sendRequest(this.createUrl(url), optionsInternal);

    }

    public async post(url: string, body: RandomObject, options?: RandomObject): Promise<any> {
        const optionsInternal = await this.createOptions(HttpMethods.POST, options, body);
        return await this.sendRequest(this.createUrl(url), optionsInternal);
    }

    public async put(url: string, body: RandomObject, options?: RandomObject): Promise<any> {
        const optionsInternal = await this.createOptions(HttpMethods.PUT, options, body);
        return await this.sendRequest(this.createUrl(url), optionsInternal);
    }

    protected createUrl(...args: Array<string>) {
        return [this.baseUrl,...args].join('');
    }

}
