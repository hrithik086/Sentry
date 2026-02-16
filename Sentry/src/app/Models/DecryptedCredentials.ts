import { Credentials } from './Credentials';
import { DecryptedOtherCredentialDetails } from './DecryptedOtherCredentialDetails';

export interface DecryptedCredentials extends Credentials {
  decryptedPassword: string;
  decryptedPin?: string;
  decryptedSecurityKeys?: string;
  decryptedOtherDetails?: DecryptedOtherCredentialDetails[];

  // public initializeDecryptedCredentials(
  //   credentials: Credentials,
  //   decryptedPassword: string,
  //   decryptedPin: string = '',
  //   decryptedSecurityKeys: string = '',
  // ): void {
  //   super.initializeCredentials(credentials);
  //   this.decryptedPassword = decryptedPassword;
  //   this.decryptedPin = decryptedPin;
  //   this.decryptedSecurityKeys = decryptedSecurityKeys;
  // }
}
