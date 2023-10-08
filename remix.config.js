const baseConfig =
  process.env.NODE_ENV === "production"
    ? {
        server: "./server.js",
        serverBuildPath: ".netlify/functions-internal/server.js",
      }
    : undefined;
/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ...baseConfig,
  ignoredRouteFiles: ["**/.*"],
  // future: {},
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
};
