import { Service, Inject } from "typedi";
import { Container } from "typedi";
const rp = require("request-promise");
const cheerio = require("cheerio");
import { uniqBy, differenceBy, intersectionBy, orderBy } from "lodash";
const ref = require("instagram-id-to-url-segment");
import {
  IgApiClient,
  MediaInfoResponseRootObject,
} from "instagram-private-api";
import { UserProfileService } from "../services/UserProfileService";

@Service()
export class MediaService {
  constructor(
    @Inject("igClient") protected igClient: IgApiClient,
    protected info: MediaInfoResponseRootObject
  ) {}

  public async likePost(postId): Promise<any> {
    // getting the post first
    const post = await this.igClient.media.info(postId);

    //getting the user who is logged in
    const loggedInUser = await this.igClient.account.currentUser();

    //getiing the id of logged in user
    const loggedInUserId = loggedInUser.pk;

    //getting the name of logged in user
    const loggedInUserName = loggedInUser.username;

    // attempt to like a post
    await this.igClient.media.like({
      mediaId: postId,
      moduleInfo: {
        module_name: "profile",
        user_id: loggedInUserId,
        username: loggedInUserName,
      },

      // chosing the option as double tap
      // we can choose d:0 for direct like
      d: 1,
    });

    return post;
  }
  public async getPosts(userName: string, No: string): Promise<any> {
    // getting the information about user's page
    const id = await this.igClient.user.getIdByUsername(userName);
    console.log(id);
    const userInfo = await this.igClient.user.info(id);

    console.log(userInfo);
    //getting the number of total posts
    const numberOfPost = userInfo.media_count;
    console.log(numberOfPost);

    //declaring a posts array which will contain all posts
    let posts = [];

    //getting user feed for a specific user
    const userFeed = await this.igClient.feed.user(id);

    //recieving all the post and pushing all in posts array
    if (No === "All" || Number(No) >= numberOfPost) {
      while (posts.length <= numberOfPost) {
        let pageItems = await userFeed.items();
        pageItems.forEach((post) => {
          posts.push({
            postId: post.pk,
            likes: post.like_count,
          });
        });
      }
    } else {
      while (posts.length <= Number(No)) {
        let pageItems = await userFeed.items();
        pageItems.forEach((post) => {
          // const likers = await this.igClient.media.likers(post.pk);
          posts.push({
            postId: post.pk,
            likes: post.like_count,
          });
        });
      }
    }
    console.log(posts);
    let shouldFollow = [];

    //removing duplicate posts
    let likers;
    posts = uniqBy(posts, "postId");
    console.log(posts.length);
    const lenOf = Math.trunc(posts.length / 4) + 1;
    posts = orderBy(posts, "likes");
    for (let i = 0; i < lenOf; i++) {
      let post = posts[i];
      likers = await this.igClient.media.likers(post.postId);
      for (let j = 0; j < likers.users.length; j++) {
        let a = likers.users[j];
        let id = a.pk;
        console.log(id);
        const b = await this.igClient.user.info(id);
        const follower = b.follower_count;
        const following = b.following_count;
        if (follower < following) {
          shouldFollow.push(id);
          console.log(shouldFollow.length);
        }
        if (shouldFollow.length > 5) {
          break;
        }
      }
      if (shouldFollow.length > 5) {
        break;
      }
    }
    const getWaitTime = () => 30000 + Math.random() * 5 * 6000;
    const userProfileService = Container.get(UserProfileService);
    async function follow() {
      if (shouldFollow.length > 1) {
        let id = shouldFollow[shouldFollow.length - 1];
        await userProfileService.Follow(id);
        shouldFollow.pop();
      }
    }
    setInterval(follow, getWaitTime());
    return shouldFollow;
  }
}
