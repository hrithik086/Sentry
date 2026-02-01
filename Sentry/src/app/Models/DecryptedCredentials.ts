import { Credentials } from "./Credentials";
import { DecryptedOtherCredentialDetails } from "./DecryptedOtherCredentialDetails";

export class DecryptedCredentials extends Credentials {
    public dencryptedPassword: string;
    public decryptedPin: string;
    public dencryptedSecurityKeys: string;
    public decryptedOtherDetails: DecryptedOtherCredentialDetails[];
}