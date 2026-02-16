import { OtherCredentialDetails } from "./OtherCredentialDetails";

export interface DecryptedOtherCredentialDetails extends OtherCredentialDetails {
    decryptedValue: string;
}