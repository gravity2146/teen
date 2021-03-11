/**
 * Defines a user's Following whom users don't follow back.
 */

export class NotFollowingBack {
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
