import JwtDecode from 'jwt-decode';
import {JWTAccess, JWTCode} from '../types';

/**
 * @class Token
 * Class Token for managing Auth Token related Stuff.
 * @Property
 * */
export class Token {
  private _code: string;
  private _accessToken: string;
  private _refreshToken: string;
  private _decodedCode: Partial<JWTCode>;
  private _decodedAccessToken: Partial<JWTAccess>;

  constructor(code: string) {
    this._code = code ? code : '';
    this._accessToken = '';
    this._refreshToken = '';
    this._decodedCode = JwtDecode(code);
    this._decodedAccessToken = {};
  }

  /**************************/
  /** Token Public Methods **/
  /**************************/

  public isCodeExpired() {
    return this._isExpired(this._decodedCode.exp);
  }
  public isAccessTokenExpired() {
    return this._isExpired(this._decodedAccessToken.exp);
  }

  /****************************/
  /** Private Helper Methods **/
  /****************************/

  /**
   * Checks if Token is expired.
   * @param token - A jwt compliant object.
   */
  private _isExpired(expiryDate: number| undefined) {
    const currentTime = new Date().getTime() / 1000;
    return !expiryDate || expiryDate < currentTime;
  }

  /*********************/
  /** GETTER / SETTER **/
  /*********************/

  set code(code: string) {
    this._decodedCode = JwtDecode(code);
    this._code = code;
  }
  get code() {
    return this._code;
  }
  set refreshToken(refreshToken: string) {
    this._refreshToken = refreshToken;
  }
  get refreshToken() {
    return this._refreshToken;
  }
  set accessToken(accessToken: string) {
    this._decodedAccessToken = JwtDecode(accessToken);
    this._accessToken = accessToken;
  }
  get accessToken() {
    return this._accessToken;
  }
}
