import {AuthenticationError, AuthenticatorError} from '../constants/ErrorMessages';
import {AccessTokenResponse, CodeCredentials} from '../types';
import {createError, isValidUrl} from '../utils';
import {Token} from './Token';
import requestPromise = require('request-promise-native');

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
    private _url: string;
    private readonly _loginEndpoint = '/auth-api/v1/auth/login';
    private readonly _tokenEndpoint = '/auth-api/v1/auth/token';
    private readonly _refreshEndpoint = '/auth-api/v1/auth/token-refresh';
    private _options = {
        body: {},
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
            this._url = url.substr(url.length - 1) === '/' ? url.substring(0, url.length - 1) : url;
        } else {
            throw createError(AuthenticationError.MISSING_CREDENTIALS,401);
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
            const token = await this._getNewCode();
            await this._getNewAccessToken(token);
            return this._createBearerToken(token);
        }
        if (this._token.isAccessTokenExpired()) {
            const accessToken = await this._refreshAccessToken(this._token);
            return this._createBearerToken(this._token);
        }
        return this._createBearerToken(this._token);
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

    private async _createBearerToken(token: Token) {
        return 'Bearer ' + token.accessToken;
    }

    private async _refreshAccessToken(token: Token) {
        this._options.body = {refreshToken: token.refreshToken};
        try {
            const result = await requestPromise.post(this._url + this._refreshEndpoint, this._options);
            token.accessToken = result.accessToken;
            token.refreshToken = result.refreshToken;
            return token;
        } catch (e) {
            token = await this._getNewCode();
            await this._getNewAccessToken(token);
            return token;
        }
    }

    private async _getNewCode() {
        this._options.body = {
            client_id: this._credentials.client_id,
            client_secret: this._credentials.client_secret,
            username: this._credentials.username,
            password: this._credentials.password,
        };
        try {
            const result = await requestPromise.post(this._url + this._loginEndpoint, this._options);
            if (!this._token) {
              this._token = new Token(result.code);
            }
          this._token.code = result.code;
          return this._token;
        } catch (e) {
            throw createError(AuthenticatorError.CODE_ERROR,400)
        }
    }

    private async _getNewAccessToken(token: Token) {
        this._options.body = {
            clientId: this._credentials.client_id,
            username: this._credentials.username,
            code: token.code,
        };
        try{
         const result = await requestPromise.post(this._url + this._tokenEndpoint, this._options) as AccessTokenResponse;
          token.accessToken = result.accessToken;
          token.refreshToken = result.refreshToken;
          return token;
        }catch (e) {
            throw createError(AuthenticatorError.ACCESS_TOKEN_ERROR, 400);
        }
    }
}
