import { Logger } from "winston";
import { Container } from "typedi";
import { Router, Request, Response, NextFunction } from "express";
import { UserProfileService } from "../../services/UserProfileService";
import { celebrate, Joi } from "celebrate";

const route = Router();

export default (app: Router) => {
  app.use("/users", route);
  route.get(
    "/UnFollow",

    async (req: Request, res: Response, next: NextFunction) => {
      const userProfileService = Container.get(UserProfileService);
      const logger = Container.get("logger") as Logger;
      logger.debug("POST /post-UnFollow");

      try {
        // Attempts to fetch the current user profile

        var UnFollow = await userProfileService.getNotFollowingMeBack();

        //Respond with sucees
        return res.json(UnFollow);
      } catch (e) {
        // handle specific error types

        logger.error("Error:%o", e);
        return next(e);
      }
    }
  );

  route.post(
    "/Follow",
    celebrate({
      body: Joi.object({
        Id: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const userProfileService = Container.get(UserProfileService);
      const logger = Container.get("logger") as Logger;
      logger.debug("POST /post-Follow");

      try {
        // Attempts to fetch the current user profile
        const Id = req.body.Id;
        var Follow = await userProfileService.Follow(Id);

        //Respond with sucees
        return res.json(Follow);
      } catch (e) {
        // handle specific error types

        logger.error("Error:%o", e);
        return next(e);
      }
    }
  );
};
