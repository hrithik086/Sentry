import { OtherCredentialDetails } from "./OtherCredentialDetails";

export interface Credentials{
    domainName: string;
    userId: string;
    password: string;
    pin?: string;
    securityKeys?: string;
    otherDetails?: OtherCredentialDetails[];
}