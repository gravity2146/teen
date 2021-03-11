"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("./express"));
const dependencyInjector_1 = __importDefault(require("./dependencyInjector"));
const logger_1 = require("./logger");
exports.default = async ({ expressApp }) => {
    await dependencyInjector_1.default();
    logger_1.LoggerInstance.info('✌️ Dependency Injector loaded');
    await express_1.default({ app: expressApp });
    logger_1.LoggerInstance.info('✌️ Express loaded');
};
