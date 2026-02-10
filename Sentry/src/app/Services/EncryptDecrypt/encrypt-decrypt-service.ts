import { Injectable } from '@angular/core';
import { BCryptHash } from './HashHelpers/BCryptHash';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class EncryptDecryptService extends BCryptHash {
  private _symmetricKey : string;
  private readonly saltForEncryptionKey : string = 've5ACCSzfFBwUGm3';
  private readonly _iv : string = '1%M£fjAf70G9';

  public calculateAndSetSymmetricKey(userId: string, password: string) : void {
    this._symmetricKey = userId + this.saltForEncryptionKey + password;
  }

  public encryptString(plainText : string) : string {
    return CryptoJS.AES.encrypt(plainText, this._symmetricKey, {
      iv : CryptoJS.enc.Utf8.parse(this._iv),
      mode : CryptoJS.mode.CBC,
      padding : CryptoJS.pad.Pkcs7
    }).toString();
  }

  public decryptString(encryptedText : string) : string {
    return CryptoJS.AES.decrypt(encryptedText, this._symmetricKey, {
      iv : CryptoJS.enc.Utf8.parse(this._iv),
      mode : CryptoJS.mode.CBC,
      padding : CryptoJS.pad.Pkcs7
    }).toString();
  }

  public verifyPassword(passwordToVerify : string, hashedPassword : string) : boolean {
    this.verifyPlainTextAgainstHash(passwordToVerify, hashedPassword)
    return false;
  }
}
