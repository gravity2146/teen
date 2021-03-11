// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = "production";

export default {
  /**
   * Your favorite port
   */
  port: 3000,
  /**
   * Used by winston logger
   */
  logs: {
    level: "debug",
  },
  /**
   * API configs
   */
  api: {
    prefix: "/api",
  },
};
