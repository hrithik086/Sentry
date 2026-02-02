import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
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
  private _encryptedCredentials: WritableSignal<Credentials[]>;

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

  public get allCredentialDetails(): Signal<Credentials[]> {
    if(this._encryptedCredentials == null)
      this._encryptedCredentials = signal<Credentials[]>(this._allCredentialDetails.credentials);
    return this._encryptedCredentials.asReadonly();
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
    else{
      const encryptedCredentialIndex = this._allCredentialDetails.credentials.findIndex((cred) => cred.domainName === domainName && cred.userId === cred.userId);
      if(encryptedCredentialIndex >= 0){
        const decryptedCredential = this.decryptString(this._allCredentialDetails.credentials[encryptedCredentialIndex].password);
        // new DecryptedCredentials{
          
        // }
        //i need create an object of DecryptedCredential to put this object inside the array of decrypted credential which will act as cache
      }
    }
    //throw error
    return ""
  }

  private refreshEncryptedCredentialsSignal() : void{
    this._encryptedCredentials.set(this._allCredentialDetails.credentials);
  }

  public addEncryptedCredential(newCredential: Credentials){
    const checkExistingCredentials = this._allCredentialDetails.credentials.filter((credential) => credential.domainName === newCredential.domainName && credential.userId === newCredential.userId);
    if(checkExistingCredentials.length === 0){
      this._allCredentialDetails.credentials.push(newCredential);
      this.refreshEncryptedCredentialsSignal();
    }
  }

  public removeEncryptedCredentials(domainName: string, userId: string){
    const filteredCredentials = this._allCredentialDetails.credentials.filter((cred) => cred.domainName === domainName && cred.userId === userId);
    if(filteredCredentials.length === 1){
      let index = this._allCredentialDetails.credentials.findIndex((cred) => cred.domainName==domainName && cred.userId === userId);
      this._allCredentialDetails.credentials.splice(index, 1);

      index = this._decryptedCredentials.findIndex((cred) => cred.domainName==domainName && cred.userId === userId);
      if(index >= 0)
        this._decryptedCredentials.splice(index,1);

      this.refreshEncryptedCredentialsSignal();
    }
    else if(filteredCredentials.length > 1){
      //log error that there are duplicates and we need to remove all and then we need to add one
    }
    else{
      //log error that there is no object which is matching the domain name and userid.
    }
  }

  private decryptString(cipherText: string){
    //decryption logic to be implemented
    return ""
  }
}