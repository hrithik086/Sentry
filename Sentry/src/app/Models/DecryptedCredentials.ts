import { Credentials } from "./Credentials";
import { DecryptedOtherCredentialDetails } from "./DecryptedOtherCredentialDetails";

export class DecryptedCredentials extends Credentials {
    public decryptedPassword: string;
    public decryptedPin: string;
    public decryptedSecurityKeys: string;
    public decryptedOtherDetails: DecryptedOtherCredentialDetails[];
}