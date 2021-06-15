const tokenService = require("./tokenService");
const cookieOptions = require("./cookieOptions");

module.exports = function setResponseCredentials(user, res) {
  const accessToken = tokenService.createAccessToken(user);
  const refreshToken = tokenService.createRefreshToken(user);

  res.set("Access-Control-Expose-Headers", "x-access-token");
  res.set("x-access-token", accessToken);
  res.cookie("refresh-token", refreshToken, cookieOptions());
  return res;
};
