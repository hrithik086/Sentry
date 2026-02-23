import { Credentials } from './Credentials';
import { DecryptedOtherCredentialDetails } from './DecryptedOtherCredentialDetails';

export interface DecryptedCredentials extends Credentials {
  decryptedPassword: string;
  decryptedPin?: string;
  decryptedSecurityKeys?: string;
  decryptedOtherDetails?: DecryptedOtherCredentialDetails[];
}
