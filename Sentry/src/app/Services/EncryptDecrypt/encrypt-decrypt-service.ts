import { Injectable } from '@angular/core';
import { BCryptHash } from './HashHelpers/BCryptHash';

@Injectable({
  providedIn: 'root',
})
export class EncryptDecryptService extends BCryptHash {
  private readonly uInt8ArrayEncoder : TextEncoder = new TextEncoder();
  // private readonly uInt8ArrayDecoder : TextEncoder = new TextDecoder();
  private _symmetricKey : Uint8Array;
  private readonly randomString : string = 've5ACCSzfFBwUGm3';
  private readonly _iv : Uint8Array 

  public calculateAndSetSymmetricKey(userId: string, password: string) : void {
    this._symmetricKey = this.uInt8ArrayEncoder.encode(userId + this.randomString + password)
  }

  public encrypt(plainText : string) : void {
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const ciphertext = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      this._symmetricKey,
      encode(plaintext)
    );

    // return { ciphertext, iv };
  }

  private encode = (plainText : string) : Uint8Array =>{
    return new Uint8Array(this.uInt8ArrayEncoder.encode(plainText));
  }

  private async convertStringToCryptoKey(plainText : string, syymetricKey : string): Promise<{ciphertext: Uint8Array, iv: Uint8Array}>{
    const keyData = this.uInt8ArrayEncoder.encode(syymetricKey);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = this.encode(plainText);

    const ciphertextBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encoded
    );

    return { ciphertext: new Uint8Array(ciphertextBuffer), iv };
  }
}
