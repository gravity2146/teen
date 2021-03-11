"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const express_1 = require("express");
const UserProfileService_1 = require("../../services/UserProfileService");
const route = express_1.Router();
exports.default = (app) => {
    app.use('/users', route);
    route.get('/followers', async (_req, res, next) => {
        const userProfileService = typedi_1.Container.get(UserProfileService_1.UserProfileService);
        const logger = typedi_1.Container.get('logger');
        logger.debug('GET /get-followers');
        try {
            var followers = await userProfileService.getFollowers();
            return res.json(followers);
        }
        catch (e) {
            logger.error('🔥 Error: %o', e);
            return next(e);
        }
    });
    route.get('/following', async (_req, res, next) => {
        const userProfileService = typedi_1.Container.get(UserProfileService_1.UserProfileService);
        const logger = typedi_1.Container.get('logger');
        logger.debug('GET /get-following');
        try {
            var following = await userProfileService.getFollowing();
            return res.json(following);
        }
        catch (e) {
            logger.error('🔥 Error: %o', e);
            return next(e);
        }
    });
};
