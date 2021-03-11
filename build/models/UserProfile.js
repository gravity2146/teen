"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfile = void 0;
class UserProfile {
    setName(fullName) {
        const parts = fullName.split(/\s+/);
        this.firstName = parts.length > 0 ? parts[0] : "";
        this.lastName = parts.length > 1 ? parts[1] : "";
        this.fullName = fullName;
    }
}
exports.UserProfile = UserProfile;
