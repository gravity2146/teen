import { Logger } from "winston";
import { Container } from "typedi";
import { Router, Request, Response, NextFunction } from "express";
import { MediaService } from "../../services/MediaService";
import { celebrate, Joi } from "celebrate";

const route = Router();

export default (app: Router) => {
  app.use("/media", route);

  // API route to get a post
  route.get(
    "/post",
    celebrate({
      body: Joi.object({
        Id: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const mediaService = Container.get(MediaService);
      const logger = Container.get("logger") as Logger;
      logger.debug("GET /get-post");

      try {
        // Attempts to fetch the post
        const Id = req.body.Id;
        var post = await mediaService.getPost(Id);

        // Respond with success
        return res.json(post);
      } catch (e) {
        // Handle specific error types

        logger.error("🔥 Error: %o", e);
        return next(e);
      }
    }
  );

 

  // API route to like a single post
  route.post(
    "/likePost",
    celebrate({
      body: Joi.object({
        Id: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const mediaService = Container.get(MediaService);
      const logger = Container.get("logger") as Logger;
      logger.debug("POST /post-likePost");

      try {
        // Attempts to like the post
        const postId = req.body.Id;
        var likePost = await mediaService.likePost(postId);

        //Respond with sucees
        return res.json(likePost);
      } catch (e) {
        // handle specific error types

        logger.error("Error:%o", e);
        return next(e);
      }
    }
  );

  // API route to get all posts of user
  route.get(
    "/posts",
    celebrate({
      body: Joi.object({
        Id: Joi.string().required(),
        No: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const mediaService = Container.get(MediaService);
      const logger = Container.get("logger") as Logger;
      logger.debug("GET /get-posts");

      try {
        // Attempts to fetch the post
        const Id = req.body.Id;
        const No = req.body.No;
        var posts = await mediaService.getPosts(Id, No);

        // Respond with success
        return res.json(posts);
      } catch (e) {
        // Handle specific error types

        logger.error("🔥 Error: %o", e);
        return next(e);
      }
    }
  );
};
