import { Credentials } from './Credentials';
import { DecryptedOtherCredentialDetails } from './DecryptedOtherCredentialDetails';

export class DecryptedCredentials extends Credentials {
  public decryptedPassword: string;
  public decryptedPin: string;
  public decryptedSecurityKeys: string;
  public decryptedOtherDetails: DecryptedOtherCredentialDetails[];

  public initializeDecryptedCredentials(
    credentials: Credentials,
    decryptedPassword: string,
    decryptedPin: string = '',
    decryptedSecurityKeys: string = '',
  ): void {
    super.initializeCredentials(credentials);
    this.decryptedPassword = decryptedPassword;
    this.decryptedPin = decryptedPin;
    this.decryptedSecurityKeys = decryptedSecurityKeys;
  }
}
