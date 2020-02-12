import {AuthenticationError, AuthenticatorError} from '../constants/ErrorMessages';
import {AccessTokenResponse, AuthEndpoints, CodeCredentials} from '../types';
import {createError, isValidUrl} from '../utils';
import {Token} from './Token';
import requestPromise = require("request-promise-native");

export interface IAuthenticator {
    getAccessToken(forceRenew?: boolean): Promise<string>;
}

/**
 * @class Authenticator
 * Class Authenticator for authentication with the Prong service.
 * @Property
 * */
export class Authenticator implements IAuthenticator {
    private _token: Token | undefined;
    private _credentials: CodeCredentials;
    private readonly _url: string;
    private readonly _options = {
        body: {},
        strictSSL: false,
        headers: {
            'Content-Type': 'application/json',
        },
        agentOptions: {
            rejectUnauthorized: false,
        },
        json: true,
    };

    constructor(url: string, credentials: Required<CodeCredentials>) {
        if (credentials && credentials.client_id && credentials.username && credentials.client_secret && credentials.password && url && isValidUrl(url)) {
            this._credentials = credentials;
            this._url = url.endsWith('/') ? url.slice(0, -1) : url;
        } else {
            throw createError(AuthenticationError.MISSING_CREDENTIALS, 401);
        }
    }

    /**********************************/
    /** Authenticator Public Methods **/

    /**********************************/

    /**
     * Retrieves a valid Access Token.
     */
    public async getAccessToken(forceRenew?: boolean): Promise<string> {
        if (!this._token || forceRenew) {
            this._token = await this._getNewCode();
            await this._getNewAccessToken(this._token);
        }
        if (this._token.isAccessTokenExpired()) {
            await this._refreshAccessToken(this._token);
        }
        return Authenticator._createBearerToken(this._token);
    }

    /****************************/
    /** Private Helper Methods **/

    /****************************/

    /**
     * Evaluate access token if existing. Else a new one will be fetched.
     * @param {String} [accessToken] - forwarded access token
     * @returns {Promise.<*>}
     * @private
     */
    private static _createBearerToken(token: Token) {
        return 'Bearer ' + token.accessToken;
    }

    /**
     * refresh access token using refresh token
     * @param token token object containing refresh token
     * @private
     */
    private async _refreshAccessToken(token: Token) {
        const options = {...this._options, body: {refreshToken: token.refreshToken}};
        try {
            const result = await requestPromise.post(this._url + AuthEndpoints.REFRESH_ENDPOINT, options);
            token.accessToken = result.accessToken;
            token.refreshToken = result.refreshToken;
            return token;
        } catch (e) {
            this._token = await this._getNewCode();
            await this._getNewAccessToken(this._token);
        }
    }

    private async _getNewCode() {
        const options = {...this._options, body: this._credentials};
        try {
            const result = await requestPromise.post(this._url + AuthEndpoints.LOGIN_ENDPOINT, options);
            if (!this._token) this._token = new Token(result.code);
            return this._token;
        } catch (e) {
            throw createError(AuthenticatorError.CODE_ERROR, 400)
        }
    }

    private async _getNewAccessToken(token: Token) {
        const options = {
            ...this._options, body: {
                clientId: this._credentials.client_id,
                username: this._credentials.username,
                code: token.code,
            }
        };
        try {
            const result = await requestPromise.post(this._url + AuthEndpoints.TOKEN_ENDPOINT, options) as AccessTokenResponse;
            token.accessToken = result.accessToken;
            token.refreshToken = result.refreshToken;
            return token;
        } catch (e) {
            throw createError(AuthenticatorError.ACCESS_TOKEN_ERROR, 400);
        }
    }
}
