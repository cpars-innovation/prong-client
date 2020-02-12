export type CodeCredentials = {
  client_id: string;
  client_secret: string;
  username: string;
  password: string;
};

export type TokenAuthType = {
  code: string;
} & AccessTokenResponse;

export type  AccessTokenResponse = {
  accessToken: string;
  refreshToken: string;
}

export type JWTAccess = {
  active: null | boolean;
  clientId: string | undefined;
  createdBy: null | string;
  createdOn: Date;
  deleted: boolean;
  email: string;
  exp: number;
  firstName: string;
  iat: number;
  id: string;
  iss: string;
  lastLogin: null | Date;
  lastName: null | string;
  middleName: null | string;
  modifiedBy: null | string;
  modifiedOn: Date;
  password: null | string;
  permissions: Array<string>;
};

export type JWTCode = {
  clientId: string;
  userId: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
  sub: string;
};
