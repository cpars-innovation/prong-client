import {AuthenticationError, AuthenticatorError, CONTENT_TYPE, HttpMethods} from "../constants";
import {ClientConfig, RandomObject, ReqOptions} from "../types";
import {createError, isValidUrl} from "../utils";
import {Authenticator, IAuthenticator} from "../auth";
import requestPromise = require("request-promise-native");


export  class BaseClient {

    private authenticator: IAuthenticator;
    private _baseUrl: string;

    constructor(config: ClientConfig) {
        const {url, credentials} = config;
        if (credentials && credentials.client_id && credentials.username && credentials.client_secret && credentials.password && url && isValidUrl(url)) {
            this.authenticator = new Authenticator(url, credentials);
            this._baseUrl = url.endsWith('/') ? url :url + '/';
        } else {
            if (!url || !isValidUrl(url)) {
                throw createError(AuthenticationError.MISSING_MALFORMED_URL, 401);
            }
            throw createError(AuthenticationError.MISSING_CREDENTIALS, 401);
        }

    }


    protected async createOptions(httpMethod: HttpMethods, options: RandomObject = {headers: {}}, body: RandomObject = {}) {
        return {
            ...{
                agentOptions: {
                    rejectUnauthorized: false,
                },
             //   json: true,
            },
            ...options,
            ...{
                method: httpMethod,
                body: body,
                headers: {'Content-Type': CONTENT_TYPE.JSON, ...options.headers, Authorization: await this.authenticator.getAccessToken()},
            },
        };
    }

    protected async sendRequest(url: string, options: Partial<ReqOptions>, params?: {urlParams?: RandomObject; queryParams?: RandomObject}) {
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
        if (params.urlParams) {
            url += this.paramsToString(params.urlParams, ',');
        }
        if (params.queryParams) {
            url += '?' + this.paramsToString(params.queryParams, '&');
        }
        return url;
    }

    private paramsToString(params: RandomObject, splitter: string): string {
        const paramList: Array<string> = [];
        for (let [key, value] of Object.entries(params)) {
            paramList.push(`${key}=${value}`);
        }
        return paramList.join(splitter);
    }

    protected createUrl(...args: Array<string>) {
      }

    protected get baseUrl(){
        return this._baseUrl;
    }

    protected set baseUrl(baseUrl: string){
        this._baseUrl = baseUrl;
    }

}
