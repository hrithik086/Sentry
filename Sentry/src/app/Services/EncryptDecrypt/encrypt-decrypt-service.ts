import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EncryptDecryptService {
  private _symmetricKey : string;

  public calculateAndSetSymmetricKey(userId: string, password: string) : void {

  }

  private hashPlainText(plainText: string) : string{
    return ''
  }
}
