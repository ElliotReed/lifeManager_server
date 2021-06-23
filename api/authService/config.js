function getRefreshCookieKey() {
  const refreshCookieKey = process.env.REFRESH_COOKIE_KEY;
  return refreshCookieKey;
}

module.exports = { getRefreshCookieKey };
