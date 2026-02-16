import { OtherCredentialDetails } from "./OtherCredentialDetails";

export interface Credentials{
    domainName: string;
    userId: string;
    password: string;
    pin: string;
    securityKeys: string;
    otherDetails: OtherCredentialDetails[];

    // initializeCredentials(credentials : Credentials){
    //     this.domainName = credentials.domainName;
    //     this.userId = credentials.userId;
    //     this.password = credentials.password;
    //     this.pin = credentials.pin;
    //     this.securityKeys = credentials.securityKeys;
    //     this.otherDetails = credentials.otherDetails;
    // }
}