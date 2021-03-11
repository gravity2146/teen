"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthError = exports.AuthErrorReason = void 0;
var AuthErrorReason;
(function (AuthErrorReason) {
    AuthErrorReason["AuthRequired"] = "auth_required";
    AuthErrorReason["InvalidCredentials"] = "invalid_credentials";
    AuthErrorReason["ChallengeRequired"] = "challenge_required";
    AuthErrorReason["ChallengeWrongCode"] = "challenge_wrong_code";
})(AuthErrorReason = exports.AuthErrorReason || (exports.AuthErrorReason = {}));
class AuthError {
    constructor(success, error) {
        this.success = success;
        this.error = error;
    }
}
exports.AuthError = AuthError;
