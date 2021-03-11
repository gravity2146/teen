import { Service, Inject } from "typedi";
import { ICredentials } from "../interfaces/ICredentials";
import { Followers } from "../models/Followers";
import {
  IgApiClient,
  AccountRepositoryLoginResponseLogged_in_user,
  AccountRepositoryCurrentUserResponseUser,
  AccountFollowersFeedResponse,
  AccountFollowersFeed,
  AccountFollowersFeedResponseUsersItem,
} from "instagram-private-api";
import { UserProfile } from "../models/UserProfile";
import { Following } from "../models/Following";
import { NotFollowingMeBack } from "../models/NotFollowingMeBack";
import { NotFollowingBack } from "../models/NotFollowingBack";
import { MutualFollowing } from "../models/MutualFollowing";
import { uniqBy, differenceBy, intersectionBy } from "lodash";
@Service()
export class UserProfileService {
  constructor(@Inject("igClient") protected igClient: IgApiClient) {}
  userFollower = [];
  userFollowing = [];

  /**
   * Gets an array of Followers
   */
  public async getFollowers(): Promise<Followers> {
    // Attempt to fetch current IG user
    const result = await this.igClient.account.currentUser();

    const followersFeed = this.igClient.feed.accountFollowers(result.pk);

    console.log(followersFeed);

    const feedState = followersFeed.serialize();
    let wholeResponse1 = await followersFeed.request();

    console.log(feedState);

    var wholeResponse;

    var i;
    var users = [];

    for (i = 0; i < 2; i++) {
      wholeResponse = await followersFeed.items();
      wholeResponse.forEach((item) =>
        users.push({
          pk: item.pk,
          username: item.username,
          full_name: item.full_name,
          is_private: item.is_private,
          profile_pic_url: item.profile_pic_url,
        })
      );
      console.log(wholeResponse.length);
    }

    //Removing duplicate id's
    users = uniqBy(users, "pk");
    this.userFollower = users;
    // Create user profile response object
    return this.createFollowers(Array.from(users));
  }

  /**
   * Creates and returns a {Followers} Object
   */
  private createFollowers(FollowersFeed?): Followers {
    const followers = new Followers();

    // storing followers users in class property
    followers.users = FollowersFeed;

    return followers;
  }

  /**
   * Gets an array of Following
   */
  public async getFollowing(): Promise<Following> {
    // Attempt to fetch current IG user
    const result = await this.igClient.account.currentUser();

    const followingFeed = this.igClient.feed.accountFollowing(result.pk);

    console.log(followingFeed);

    const feedState = followingFeed.serialize();

    console.log(feedState);

    // const wholeResponse = await followingFeed.items();
    // const secondResponse = await followingFeed.items();
    var wholeResponse;

    var i;
    var users = [];

    for (i = 0; i < 2; i++) {
      wholeResponse = await followingFeed.items();
      wholeResponse.forEach((item) =>
        users.push({
          pk: item.pk,
          username: item.username,
          full_name: item.full_name,
          is_private: item.is_private,
          profile_pic_url: item.profile_pic_url,
        })
      );
      console.log(wholeResponse.length);
    }

    //Removing duplicate id's
    users = uniqBy(users, "pk");

    // storing the following users in class property
    this.userFollowing = users;

    //console.log(this.createFollowers(secondResponse));

    // Create user profile response object
    return this.createFollowers(users);
  }

  /**
   * Creates and returns a {Following} object.
   */
  private createFollowing(
    FollowingFeed: AccountFollowersFeedResponseUsersItem[]
  ): Following {
    const followers = new Following();

    followers.users = FollowingFeed;

    return followers;
  }

  public async getNotFollowingMeBack(): Promise<any> {
    await this.getFollowers();
    await this.getFollowing();
    var i;
    var users = [];

    //removing userFollwer from userFollowing to find who don't follow me back
    users = differenceBy(this.userFollowing, this.userFollower, "pk");
    const getWaitTime = () => 30000 + Math.random() * 5 * 6000;
    async function unfollow() {
      if (users.length > 1) {
        let id = users[users.length - 1].pk;
        await this.UnFollow(id);
        users.pop();
      }
    }
    setInterval(unfollow, getWaitTime());
  }

  public async UnFollow(userId): Promise<any> {
    await this.igClient.friendship.destroy(userId);
    return console.log("unfollowed" + userId);
  }

  public async Follow(userId): Promise<any> {
    await this.igClient.friendship.create(userId);
    return console.log("followed" + userId);
  }
}
