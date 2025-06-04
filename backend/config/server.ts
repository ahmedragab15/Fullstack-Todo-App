export default ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
  // إضافة URL للـ production
  url: env("PUBLIC_URL", env("NODE_ENV") === "production" ? undefined : "http://localhost:1337"),
});
