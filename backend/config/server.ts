export default ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  app: {
    keys: env.array("APP_KEYS"),
  },
  // cors: {
  //   origin: ["https://fullstack-todo-app-gamma.vercel.app"],
  //   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  //   headers: ["Content-Type", "Authorization", "Origin", "Accept"],
  // },
});
