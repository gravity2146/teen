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
exports.AuthService = void 0;
const typedi_1 = require("typedi");
const UserProfile_1 = require("../models/UserProfile");
const instagram_private_api_1 = require("instagram-private-api");
let AuthService = class AuthService {
    constructor(igClient) {
        this.igClient = igClient;
    }
    async signIn(credentials) {
        this.igClient.state.generateDevice(credentials.username);
        await this.igClient.simulate.preLoginFlow();
        const result = await this.igClient.account.login(credentials.username, credentials.password);
        return this.createUserProfile(result);
    }
    async sendCheckpoint() {
        await this.igClient.challenge.auto(true);
    }
    async verifyCheckpoint(code) {
        await this.igClient.challenge.auto(true);
        const result = await this.igClient.challenge.sendSecurityCode(code);
        return this.createUserProfile(result.logged_in_user);
    }
    async getCurrentUser() {
        const result = await this.igClient.account.currentUser();
        return this.createUserProfile(result);
    }
    createUserProfile(user) {
        const userProfile = new UserProfile_1.UserProfile();
        userProfile.userId = String(user.pk);
        userProfile.username = user.username;
        userProfile.setName(user.full_name);
        userProfile.photoUrl = user.profile_pic_url;
        return userProfile;
    }
};
AuthService = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.Inject('igClient')),
    __metadata("design:paramtypes", [instagram_private_api_1.IgApiClient])
], AuthService);
exports.AuthService = AuthService;
