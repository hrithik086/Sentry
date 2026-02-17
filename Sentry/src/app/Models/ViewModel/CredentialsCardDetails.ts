import { Credentials } from "../Credentials"

export interface CredentialsCardDetails extends Credentials {
    id: string;
    expanded: boolean;
    showPassword: boolean;
}