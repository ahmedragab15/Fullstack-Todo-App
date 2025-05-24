const middlewares = [
  "strapi::logger",
  "strapi::errors",
  "strapi::security",
  // {
  //   name: "strapi::cors",
  //   config: {
  //     origin: ["https://fullstack-todo-app-gamma.vercel.app"],
  //     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
  //     headers: ["Content-Type", "Authorization", "Origin", "Accept"],
  //     keepHeadersOnError: true,
  //   },
  // },
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];

console.log("🛠 CORS middleware is being loaded...");
export default middlewares;