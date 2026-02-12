import { Injectable } from '@angular/core';
import { BCryptHash } from './HashHelpers/BCryptHash';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class EncryptDecryptService extends BCryptHash {
  private _symmetricKey : string;
  private readonly saltForEncryptionKey : string = 've5ACCSzfFBwUGm3';
  private readonly _iv : string = '1%MfjAf70G9ABCD';

  public calculateAndSetSymmetricKey(userId: string, password: string) : void {
    this._symmetricKey = userId + this.saltForEncryptionKey + password;
  }

  public encryptString(plainText : string) : string {
    const key = CryptoJS.SHA256(this._symmetricKey);
    const iv = CryptoJS.enc.Utf8.parse(this._iv);
    return CryptoJS.AES.encrypt(plainText, key, {
      iv,
      mode : CryptoJS.mode.CBC,
      padding : CryptoJS.pad.Pkcs7
    }).toString();
  }

  public decryptString(encryptedText : string) : string {
    const key = CryptoJS.SHA256(this._symmetricKey);
    const iv = CryptoJS.enc.Utf8.parse(this._iv);
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
      iv,
      mode : CryptoJS.mode.CBC,
      padding : CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  public verifyPassword(passwordToVerify : string, hashedPassword : string) : Promise<boolean> {
    return this.verifyPlainTextAgainstHash(passwordToVerify, hashedPassword)
  }
}
