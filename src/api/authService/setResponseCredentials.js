import * as tokenService from './tokenService.js';
import cookieOptions from './cookieOptions.js';
import { getRefreshCookieKey } from './config.js';

export default function setResponseCredentials(user, res) {
  const accessToken = tokenService.createAccessToken(user);
  const refreshToken = tokenService.createRefreshToken(user);

  res.set('Access-Control-Expose-Headers', 'x-access-token');
  res.set('x-access-token', accessToken);
  res.cookie(getRefreshCookieKey(), refreshToken, cookieOptions());

  return res;
}

