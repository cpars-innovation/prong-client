export enum AuthenticationError {
  MISSING_CREDENTIALS = 'Missing Credentials! Please provide all necessary details to retrieve a Login code!',
  WRONG_CREDENTIALS = 'Wrong credentials! Please check your input.',
  MISSING_MALFORMED_URL = 'Missing or Malformed URL for the Service! Please check your input.',
  WRONG_URL = 'Wrong URL for the Service! Could not connect.',
}

export enum AuthenticatorError {
  CODE_ERROR = 'Could not get access code! Please check your input. If this error persists ask your system admin for help.',
  ACCESS_TOKEN_ERROR = 'Could not get access token! Please check your input. If this error persists ask your system admin for help.',
  REFRESH_TOKEN_ERROR = 'Could not get new access token with refresh token! Please check your input. If this error persists ask your system admin for help.',
}