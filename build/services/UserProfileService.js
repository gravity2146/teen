"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfileService = void 0;
const typedi_1 = require("typedi");
const Followers_1 = require("../models/Followers");
const instagram_private_api_1 = require("instagram-private-api");
const Following_1 = require("../models/Following");
let UserProfileService = class UserProfileService {
    constructor(igClient) {
        this.igClient = igClient;
    }
    async getFollowers() {
        const result = await this.igClient.account.currentUser();
        const followersFeed = this.igClient.feed.accountFollowers(result.pk);
        console.log(followersFeed);
        const feedState = followersFeed.serialize();
        console.log(feedState);
        var wholeResponse;
        var i;
        var users = new Set();
        for (i = 0; i < 20; i++) {
            wholeResponse = await followersFeed.items();
            wholeResponse.forEach(item => users.add(item));
            console.log(wholeResponse.length);
        }
        return this.createFollowers(Array.from(users));
    }
    createFollowers(FollowersFeed) {
        const followers = new Followers_1.Followers();
        followers.users = FollowersFeed;
        return followers;
    }
    async getFollowing() {
        const result = await this.igClient.account.currentUser();
        const followingFeed = this.igClient.feed.accountFollowing(result.pk);
        console.log(followingFeed);
        const feedState = followingFeed.serialize();
        console.log(feedState);
        const wholeResponse = await followingFeed.items();
        const secondResponse = await followingFeed.items();
        return this.createFollowers(secondResponse);
    }
    createFollowing(FollowingFeed) {
        const followers = new Following_1.Following();
        followers.users = FollowingFeed;
        return followers;
    }
};
UserProfileService = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.Inject('igClient')),
    __metadata("design:paramtypes", [instagram_private_api_1.IgApiClient])
], UserProfileService);
exports.UserProfileService = UserProfileService;
