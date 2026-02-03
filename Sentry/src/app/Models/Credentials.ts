import { OtherCredentialDetails } from "./OtherCredentialDetails";

export class Credentials{
    public domainName: string;
    public userId: string;
    public password: string;
    public pin: string;
    public securityKeys: string;
    public otherDetails: OtherCredentialDetails[];

    public initializeCredentials(credentials : Credentials){
        this.domainName = credentials.domainName;
        this.userId = credentials.userId;
        this.password = credentials.password;
        this.pin = credentials.pin;
        this.securityKeys = credentials.securityKeys;
        this.otherDetails = credentials.otherDetails;
    }
}