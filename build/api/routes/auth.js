"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const celebrate_1 = require("celebrate");
const AuthService_1 = require("../../services/AuthService");
const express_1 = require("express");
const instagram_private_api_1 = require("instagram-private-api");
const AuthError_1 = require("../../models/AuthError");
const route = express_1.Router();
exports.default = (app) => {
    app.use('/auth', route);
    route.post('/login', celebrate_1.celebrate({
        body: celebrate_1.Joi.object({
            username: celebrate_1.Joi.string().required(),
            password: celebrate_1.Joi.string().required()
        })
    }), async (req, res, next) => {
        const authService = typedi_1.Container.get(AuthService_1.AuthService);
        const logger = typedi_1.Container.get('logger');
        logger.debug('POST /login %o', req.body);
        try {
            const credentials = req.body;
            var userProfile = await authService.signIn(credentials);
            return res.json(userProfile);
        }
        catch (e) {
            if (e instanceof instagram_private_api_1.IgLoginInvalidUserError ||
                e instanceof instagram_private_api_1.IgLoginBadPasswordError) {
                return res.status(401).json(new AuthError_1.AuthError(false, AuthError_1.AuthErrorReason.InvalidCredentials));
            }
            else if (e instanceof instagram_private_api_1.IgLoginTwoFactorRequiredError) {
                return res.status(403).json(new AuthError_1.AuthError(true, AuthError_1.AuthErrorReason.ChallengeRequired));
            }
            else if (e instanceof instagram_private_api_1.IgCheckpointError) {
                await authService.sendCheckpoint();
                return res.status(403).json(new AuthError_1.AuthError(true, AuthError_1.AuthErrorReason.ChallengeRequired));
            }
            logger.error('🔥 Error: %o', e);
            return next(e);
        }
    });
    route.post('/checkpoint/code/verify', celebrate_1.celebrate({
        body: celebrate_1.Joi.object({
            code: celebrate_1.Joi.string().required()
        })
    }), async (req, res, next) => {
        const authService = typedi_1.Container.get(AuthService_1.AuthService);
        const logger = typedi_1.Container.get('logger');
        logger.debug('POST /checkpoint/code/verify %o', req.body);
        try {
            const code = req.body.code;
            var userProfile = await authService.verifyCheckpoint(code);
            return res.json(userProfile);
        }
        catch (e) {
            if (e instanceof instagram_private_api_1.IgChallengeWrongCodeError) {
                return res.status(403).json(new AuthError_1.AuthError(true, AuthError_1.AuthErrorReason.ChallengeWrongCode));
            }
            logger.error('🔥 Error: %o', e);
            return next(e);
        }
    });
    route.get('/current-user', async (_req, res, next) => {
        const authService = typedi_1.Container.get(AuthService_1.AuthService);
        const logger = typedi_1.Container.get('logger');
        logger.debug('GET /current-user');
        try {
            var userProfile = await authService.getCurrentUser();
            return res.json(userProfile);
        }
        catch (e) {
            if (e instanceof instagram_private_api_1.IgLoginRequiredError) {
                return res.status(401).json(new AuthError_1.AuthError(false, AuthError_1.AuthErrorReason.AuthRequired));
            }
            logger.error('🔥 Error: %o', e);
            return next(e);
        }
    });
};
