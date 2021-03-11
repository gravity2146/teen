import { Router } from "express";
import { MediaCommentsFeed } from "instagram-private-api";
import auth from "./routes/auth";
import users from "./routes/users";
import media from "./routes/media";

export default () => {
  const app = Router();
  auth(app);
  users(app);
  media(app);
  return app;
};
