import { Service, Inject } from "typedi";
import { ICredentials } from "../interfaces/ICredentials";
import { UserProfile } from "../models/UserProfile";
import {
  AccountRepositoryCurrentUserResponseUser,
  AccountRepositoryLoginResponseLogged_in_user,
  IgApiClient,
  IgLoginTwoFactorRequiredError,
  IgCheckpointError,
} from "instagram-private-api";

@Service()
export class AuthService {
  constructor(@Inject("igClient") protected igClient: IgApiClient) {}
  credentials = { username: "hp2146@gmail.con", password: "H1thakursingh" };

  /**
   * Signs in a user.
   *
   * @param credentials The user's credentials.
   * @throws {IgLoginInvalidUserError} If the username is invalid.
   * @throws {IgLoginBadPasswordError} If the password is invalid.
   * @throws {IgLoginTwoFactorRequiredError} If two-factor auth is required to proceed.
   * @throws {IgCheckpointError} If checkpoint is required to proceed.
   */
  public async signIn(credentials: ICredentials): Promise<UserProfile> {
    // Prepare IG client for user auth
    this.igClient.state.generateDevice(credentials.username);
    await this.igClient.simulate.preLoginFlow();

    // Attempt to auth IG user
    const result = await this.igClient.account.login(
      credentials.username,
      credentials.password
    );
    console.log("logged");
    // Create user profile response object
    return this.createUserProfile(result);
  }

  /**
   * Send IgCheckpointError Code.
   */
  public async sendCheckpoint() {
    // Requesting sms/email code or click "It was me" button (we can't support "It was me" I dont think)
    await this.igClient.challenge.auto(true);
  }

  /**
   * Verifies IgCheckpointError Code.
   *
   * @param code The user's 2FA code for checkpoint.
   *
   */
  public async verifyCheckpoint(code: string): Promise<UserProfile> {
    // Requesting sms/email code or click "It was me" button (we can't support "It was me" I dont think)
    await this.igClient.challenge.auto(true);

    // Attempt to verify security code
    const result = await this.igClient.challenge.sendSecurityCode(code);

    // Create user profile response object
    return this.createUserProfile(result.logged_in_user);
  }

  /**
   * Returns the current signed in user.
   * @throws {IgLoginRequiredError} If authentication is first required.
   */
  public async getCurrentUser(): Promise<UserProfile> {
    // Attempt to fetch current IG user
    const result = await this.igClient.account.currentUser();

    // Create user profile response object
    return this.createUserProfile(result);
  }

  /**
   * Creates and returns a {UserProfile} object.
   * @param user The user response object.
   */
  private createUserProfile(
    user:
      | AccountRepositoryLoginResponseLogged_in_user
      | AccountRepositoryCurrentUserResponseUser
  ): UserProfile {
    const userProfile = new UserProfile();

    userProfile.userId = String(user.pk);
    userProfile.username = user.username;
    userProfile.setName(user.full_name);
    userProfile.photoUrl = user.profile_pic_url;

    return userProfile;
  }
}
