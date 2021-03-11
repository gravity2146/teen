/**
 * Defines a user's Following who don't follow back.
 */

export class NotFollowingMeBack {
  users: User[];
}

export declare class User {
  pk: number;
  username: string;
  full_name: string;
  is_private: boolean;
  profile_pic_url: string;
  // profile_pic_id?: string;
  // is_verified: boolean;
  // has_anonymous_profile_picture: boolean;
  // latest_reel_media?: number;
}
