
/**
 * Defined auth error reasons.
 */
export enum AuthErrorReason {
    AuthRequired = "auth_required",
    InvalidCredentials = "invalid_credentials",
    ChallengeRequired = "challenge_required",
    ChallengeWrongCode = "challenge_wrong_code"   
}

/**
 * An auth error response object.
 */
export class AuthError {
    constructor(public success: boolean, public error: AuthErrorReason) { }
}
