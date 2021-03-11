/**
 * Defines a user's Post.
 */

export class Post {
  users: Details[];
}

export declare class Details {
  pk: number;
  id: number;
  likers: [];
  info: [];
  url: string;
}
