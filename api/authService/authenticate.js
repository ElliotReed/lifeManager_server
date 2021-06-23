const User = require("../../models").user;
const { Op } = require("sequelize");

const { getRefreshCookieKey } = require("./config")
const tokenService = require("./tokenService");
const setResponseCredentials = require("./setResponseCredentials.js");

const getUserById = async (id) => {
  return (user = await User.findByPk(id));
};

function getAccessTokenFromRequest(req) {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) return;
  return authorizationHeader.split(" ")[1];
}

module.exports = async function authenticate(req, res, next) {
  const accessToken = getAccessTokenFromRequest(req);

  if (accessToken) {
    try {
      const payload = await tokenService.verifyAccessToken(accessToken);
      req.user = payload.user;
      return next();
    } catch (error) {
      console.error(error);
    }
  }

  const refreshToken = req.cookies[getRefreshCookieKey()];
  if (!refreshToken) {
    const error = new Error("You must be signed in for access.");
    error.statusCode = 403;
    return next(error);
  }

  try {
    const { user } = await tokenService.authenticateRefreshToken(
      refreshToken,
      getUserById
    );
    req.user = user;
    setResponseCredentials(user, res);
    return next();
  } catch (error) {
    return next(error);
  }
};
