export default function cookieOptions() {
  const options = {
    httpOnly: true,
    SameSite: "none",
    secure: true,
    domain:
      process.env.NODE_ENV === "production"
        ? process.env.PRODUCTION_DOMAIN
        : process.env.DEVELOPMENT_DOMAIN,
    // milliseconds, 1000 = 1 second, * seconds * minutes * hours * days
    // = 180 days ~ 6 months
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180),
  };
  return options;
};
