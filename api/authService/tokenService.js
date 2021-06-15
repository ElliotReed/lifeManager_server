const jwt = require("jsonwebtoken");

async function authenticateRefreshToken(refreshToken, getUserById) {
  const payload = await jwt.decode(refreshToken);

  if (!payload) {
    throw new Error("What's up JWT!");
  }

  const user = await getUserById(payload.user.id);
  const verifiedPayload = await verifyRefreshToken(refreshToken, user.password);
  verifiedPayload.user.password = user.password;
  return verifiedPayload;
}

function createAccessToken(user) {
  return jwt.sign({ user: { id: user.id } }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 60 * 15, // 60 seconds * 15 (15 minutes)
  });
}

function createRefreshToken(user) {
  return jwt.sign(
    { user: { id: user.id } },
    process.env.REFRESH_TOKEN_SECRET + user.password
  );
}

function verifyAccessToken(accessToken) {
  return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
}

function verifyRefreshToken(refreshToken, password) {
  return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET + password);
}

module.exports = {
  authenticateRefreshToken,
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
