"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const logger_1 = require("./logger");
const instagram_private_api_1 = require("instagram-private-api");
exports.default = () => {
    try {
        const igClient = new instagram_private_api_1.IgApiClient();
        typedi_1.Container.set('igClient', igClient);
        typedi_1.Container.set('logger', logger_1.LoggerInstance);
    }
    catch (e) {
        logger_1.LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
        throw e;
    }
};
