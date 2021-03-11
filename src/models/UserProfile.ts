/**
 * Defines a user profile.
 */
export class UserProfile {

    userId: string;
    username: string;
    firstName: string;
    lastName: string;
    fullName: string;
    photoUrl: string;
    pk: string;

    /**
     * Sets the name of the user.
     * @param fullName The full name of the user.
     */
    public setName(fullName: string) {
        const parts = fullName.split(/\s+/);
        this.firstName = parts.length > 0 ? parts[0] : "";
        this.lastName  = parts.length > 1 ? parts[1] : "";
        this.fullName = fullName;
    }
}
