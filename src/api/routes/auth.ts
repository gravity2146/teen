import { Logger } from 'winston';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import { ICredentials } from '../../interfaces/ICredentials';
import { AuthService } from '../../services/AuthService';
import { Router, Request, Response, NextFunction } from 'express';
import { IgLoginBadPasswordError, IgLoginInvalidUserError, IgLoginRequiredError, IgLoginTwoFactorRequiredError, IgCheckpointError, IgChallengeWrongCodeError } from 'instagram-private-api';
import { AuthError, AuthErrorReason } from '../../models/AuthError';
import { UserProfileService } from '../../services/UserProfileService';

const route = Router();

export default (app: Router) => {

    app.use('/auth', route);

    // API route for user authentication
    route.post(
        '/login',
        celebrate({
            body: Joi.object({
                username: Joi.string().required(),
                password: Joi.string().required()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {

            const authService = Container.get(AuthService);
            const logger = Container.get('logger') as Logger;
            logger.debug('POST /login %o', req.body);

            try {
                
                // Attempt user login
                const credentials = req.body as ICredentials;
                var userProfile = await authService.signIn(credentials);

                // Respond with success
                return res.json(userProfile);
            }
            catch (e) {

                // Handle specific error types

                if (e instanceof IgLoginInvalidUserError ||
                    e instanceof IgLoginBadPasswordError) {

                    // Respond with bad credentials
                    return res.status(401).json(
                        new AuthError(false, AuthErrorReason.InvalidCredentials)
                    );
                }
                else if (e instanceof IgLoginTwoFactorRequiredError) {

                    // Respond with checkpoint challenge
                    return res.status(403).json(
                        new AuthError(true, AuthErrorReason.ChallengeRequired)
                    );
                }

                else if (e instanceof IgCheckpointError) {
                    // Send code
                    await authService.sendCheckpoint();

                    // Respond with checkpoint challenge
                    return res.status(403).json(
                        new AuthError(true, AuthErrorReason.ChallengeRequired)
                    );
                }

                logger.error('🔥 Error: %o', e);
                return next(e);
            }
        }
    );

    // API route for user authentication
    route.post(
        '/checkpoint/code/verify',
        celebrate({
            body: Joi.object({
                code: Joi.string().required()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {

            const authService = Container.get(AuthService);
            const logger = Container.get('logger') as Logger;
            logger.debug('POST /checkpoint/code/verify %o', req.body);

            try {
                
                // Attempt user login
                const code = req.body.code;
                var userProfile = await authService.verifyCheckpoint(code);

                // Respond with success
                return res.json(userProfile);
            }
            catch (e) {

                // Handle specific error types
                if(e instanceof IgChallengeWrongCodeError){
                    
                    // Respond with wrong code error
                    return res.status(403).json(
                        new AuthError(true, AuthErrorReason.ChallengeWrongCode)
                    );
                }

                logger.error('🔥 Error: %o', e);
                return next(e);
            }
        }
    );

    // API route to get the user profile
    route.get(
        '/current-user',
        async (_req: Request, res: Response, next: NextFunction) => {

            const authService = Container.get(AuthService);
            const logger = Container.get('logger') as Logger;
            logger.debug('GET /current-user');

            try {

                // Attempts to fetch the current user profile
                var userProfile = await authService.getCurrentUser();

                // Respond with success
                return res.json(userProfile);
            }
            catch (e) {

                // Handle specific error types

                if (e instanceof IgLoginRequiredError) {

                    // Respond with auth required
                    return res.status(401).json(
                        new AuthError(false, AuthErrorReason.AuthRequired)
                    );
                }

                logger.error('🔥 Error: %o', e);
                return next(e);
            }
        }
    );

};