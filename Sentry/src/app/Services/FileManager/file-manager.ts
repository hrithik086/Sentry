import { Injectable } from '@angular/core';
import { LoginDetailsAndCredentials } from '../../Models/DTO/LoginDetaiilsAndCredentials';
import { DecryptedCredentials } from '../../Models/DecryptedCredentials';
import { cloneDeep } from 'lodash';
import { Credentials } from '../../Models/Credentials';


@Injectable({
  providedIn: 'root',
})
export class FileManager {
  private _allCredentialDetails: LoginDetailsAndCredentials;
  private _decryptedCredentials: DecryptedCredentials[];
  private _encryptedCredentials: Credentials[];

  public readJsonFile(file: File): void {
    let reader = new FileReader();
    reader.onload = (event: any) => {
      try {
        const json = JSON.parse(event.target.result);
        this._allCredentialDetails = json as LoginDetailsAndCredentials;
        console.log('JSON content:', json);
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }
    };
    reader.readAsText(file);
  }

  public get allCredentialDetails(): Credentials[] {
    this._encryptedCredentials = this._encryptedCredentials ?? cloneDeep(this._allCredentialDetails.credentials);
    return this._encryptedCredentials;
  }
  
  public decryptedCredentials(domainName: string, userId: string) : string{
    const credentials = this._decryptedCredentials.filter((decryptedCredential) => decryptedCredential.userId === userId && decryptedCredential.domainName === domainName);
    if(credentials && credentials.length > 0){
      if(credentials.length > 1){
        // throw error
      }
      else{
        return this.decryptString(credentials[0].password);
      }
    }
    //throw error
    return ""
  }

  public addEncryptedCredential(newCredential: Credentials){
    const checkExistingCredentials = this._allCredentialDetails.credentials.filter((credential) => credential.domainName === newCredential.domainName && credential.userId === newCredential.userId);
    if(checkExistingCredentials.length === 0){
      
    }
  }

  private decryptString(cipherText: string){
    //decryption logic to be implemented
    return ""
  }
}