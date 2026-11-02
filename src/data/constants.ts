export const API_PREFIX = '/api';

export const MESSAGES = {
  loginError: 'Your email or password is incorrect!',
  userCreated: 'User created!',
  userExists: 'User exists!',
  userNotFound: 'User not found!',
  accountDeleted: 'Account deleted!',
  methodNotSupported: 'This request method is not supported.',
  searchParamMissing: 'Bad request, search_product parameter is missing in POST request.',
  loginParamMissing: 'Bad request, email or password parameter is missing in POST request.',
} as const;

export const RESPONSE_CODE = { ok: 200, created: 201, badRequest: 400, notFound: 404, methodNotAllowed: 405 } as const;
