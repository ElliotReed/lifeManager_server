export default function cookieOptions() {
  const isProductionEnv = process.env.NODE_ENV === "production";

  const options = {
    httpOnly: true,
    sameSite: isProductionEnv ? "none" : "lax",
    secure: isProductionEnv,
    domain:
      isProductionEnv
        ? process.env.PRODUCTION_DOMAIN
        : process.env.DEVELOPMENT_DOMAIN,
    // milliseconds, 1000 = 1 second, * seconds * minutes * hours * days
    // = 180 days ~ 6 months
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180),
  };
  return options;
};
