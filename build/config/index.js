"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.env.NODE_ENV = "production";
exports.default = {
    port: 3000,
    logs: {
        level: "debug",
    },
    api: {
        prefix: "/api",
    },
};
